;(function() {
    
    // Define constructor
    this.DataGrid = function() {

        // Create global element references
        this.table = null;
        this.thead = null;
        this.tbody = null;
        this.tfoot = null;
        this.arrMapCols = [];
        this.arrDataKeys = [];
        this.numRow = null;
        
        
        // Define option defaults
        var defaults = {
            Id: '',
            CssClass: 'pure-table',
            Style: 'table-layout: fixed; word-wrap: break-word;',
            Width: '95%',
            source: null,
            AutoGenerateColumns: false,
            DataKeyNames: [],
            onRowCommand: '',
            callBackRowCommand: null
        }

        // Create options by extending defaults with the passed in arugments
        if (arguments[0] && typeof arguments[0] === "object") {
            this.options = extendDefaults(defaults, arguments[0]);
        }

    }

    // Public methods
    DataGrid.prototype.open = function() {
        // open code goes here
        buildOut.call(this);

        //initializeEvents.call(this);
    }

    DataGrid.prototype.clear = function() {
        this.table.innerHTML = '';
    }

    DataGrid.prototype.dataBind = function() {
        try {
            while (this.tbody.firstChild) {
                this.tbody.removeChild(this.tbody.firstChild);
            }

            if(this.options.DataKeyNames == null)
                this.options.DataKeyNames = [];

            if(this.options.onRowCommand == null)
            this.options.onRowCommand = '';

            if(this.options.DataKeyNames.length > 0 && this.options.onRowCommand.length > 0) {
                fillDataGridWithDataKeys.call(this);
                initializeEvents.call(this);
            }
            else {
                fillDataGrid.call(this);    
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    function initializeEvents() {
        var _ = this;
        var rows = _.table.rows;
        var cellsOfRow;
        for (var r = 1; r < rows.length; r ++) {
            cellsOfRow = rows[r].getElementByTagName('td');
            for(var c = 0; c < cellsOfRow.length; c ++) {
                if(cellsOfRow[c].getAttribute('type') == 'ButtonField')
                    cellsOfRow[c].addEventListener('click', function() {
                        var args = {
                            commandArgument: _.arrDataKeys[r].value
                            ,commandName: cellsOfRow[c].getAttribute('CommandName')
                        };
                        if(_.options.callBackRowCommand) _.options.callBackRowCommand(args);
                    });
            }
        }
    }

    function fillDataGridWithDataKeys() {
        this.numRow = 0;
        var _ = this;
        for(var idx = 0; idx < this.options.source.length; idx ++) {
            row = this.tbody.insertRow(this.numRow);
            var objJson = this.options.source[idx];
            var datakeyvalue = {};
            for(var idxDK = 0; idxDK < this.options.DataKeyNames; idxDK ++) {
                datakeyvalue[this.options.DataKeyNames[idx]] = objJson[this.options.DataKeyNames[idx]];
            }

            var dataKeyname = {
                numRow: _.numRow,
                value: datakeyvalue
            };

            row.setAttribute("Id", "rowkey_" + this.numRow);
            arrDataKeys.push(dataKeyname);

            for(cx = 0; cx < this.arrMapCols.length; cx ++) {
                var v_map_col = this.arrMapCols[cx];
                var cellData = row.insertCell(v_map_col.Idx);
                cellData.innerHTML = objJson[v_map_col.DataField];
                cellData.setAttribute('type', objJson[v_map_col.Type]);
                cellData.setAttribute('CommandName', objJson[v_map_col.CommandName]);
            }
            this.numRow++;
        }
    }

    function fillDataGrid() {
        this.numRow = 0;
        for(var idx = 0; idx < this.options.source.length; idx ++) {
            row = this.tbody.insertRow(this.numRow);
            var objJson = this.options.source[idx];
            
            for(cx = 0; cx < this.arrMapCols.length; cx ++) {
                var v_map_col = this.arrMapCols[cx];
                var cellData = row.insertCell(v_map_col.Idx);
                cellData.innerHTML = objJson[v_map_col.DataField];
            }
            this.numRow++;
        }
    }

    function buildOut() { 

        this.table = document.getElementById('tbl_' + this.options.Id);
        if(this.table!=null) {
        	document.getElementById(this.options.Id).removeChild(this.table);
        }
        this.table = document.createElement('table');
        this.table.setAttribute('id','tbl_' + this.options.Id);
        this.table.setAttribute('style', this.options.Style);
        this.table.className = this.options.CssClass;
        this.table.setAttribute('width', this.options.Width);

        this.thead = document.createElement('thead');
        this.tbody = document.createElement('tbody');

        this.numRow = 0;
        var cellTbl = 0;
        
        var c = document.getElementById(this.options.Id).children;
        var txt = "";
        var i;
        
        this.arrMapCols = [];
        
        for (i = 0; i < c.length; i++) {
            var div = c[i];
            if(div.attributes.id != undefined)
            switch(div.attributes.id.value) {
                case 'columns':
                    var columns = document.getElementById('columns').children;
                    var row = this.thead.insertRow(this.numRow);
                    for(var col = 0; col < columns.length; col ++) {
                        var column = columns[col];
                        var cellh = document.createElement('th');
                        cellh.innerHTML = column.attributes.getNamedItem('headertext').value;
                        row.appendChild(cellh);

                        var oMapCol = new MapCol(
                            col, 
                            column.attributes.getNamedItem('type').value,
                            column.attributes.getNamedItem('datafield').value, 
                            column.hasAttribute('commandName') ? column.attributes.getNamedItem('commandName').value: null
                        );

                        this.arrMapCols.push(oMapCol);
                        cellTbl++;
                    }
                    break;
            }
        }
        this.table.appendChild(this.thead);
        this.table.appendChild(this.tbody);

        document.getElementById(this.options.Id).appendChild(this.table);
    }

    /* <div id="grd_maquila">
        <div id="columns">
            <div type="Boundfield" datafield="folio" headertext="Folio"></div>
            <div type="Boundfield" datafield="servicio" headertext="Serv."></div>
            <div type="Boundfield" datafield="pasos" headertext="Pasos"></div>
            <div type="ButtonField" commandName="lnkPiezas" datafield="piezas" headertext="Pza(s)"></div>
        </div>
    </div> */

    var MapCol = function(idx, type, datafield, commandName) {
        this.Idx = idx;
        this.Type = type;
        this.DataField = datafield;
        this.CommandName = commandName;
    }

    // Utility method to extend defaults with user options
    function extendDefaults(source, properties) {
        var property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }
        return source;
    }

}());