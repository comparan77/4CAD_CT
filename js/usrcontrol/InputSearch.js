;(function(){
    
    //Constructor
    this.InputSearch = function() {

        this.searchButton = null;
        this.searchDiv = null;
        this.searchTxtDato = null;
        this.searchHiddenIdDato = null;
        this.searchHiddenTxtDato = null;

        var defaults = {
            content: '',
            className: '',
            txtPlaceHolder: 'Referencia',
            functionModel: '',
            clickBtnSearch: '',
            callbackBtnSearch: '',
            maskDataSearch: '',
            typeDataSearch: 'text'
        }

        // Create options by extending defaults with the passed in arugments
        if (arguments[0] && typeof arguments[0] === "object") {
            this.options = extendDefaults(defaults, arguments[0]);
        }

        build.call(this);
    }

    //private methods
    function build() {
        var docFrag, content;
        content = document.getElementById(this.options.content);
        content.className = 'pure-form' + this.options.className;
        this.searchTxtDato = document.createElement('input');
        this.searchTxtDato.setAttribute('type', this.options.typeDataSearch)
        this.searchTxtDato.setAttribute('id', 'txt_dato');
        this.searchTxtDato.setAttribute('placeHolder', this.options.txtPlaceHolder);
        this.searchTxtDato.className = 'pure-input-rounded';
        content.appendChild(this.searchTxtDato);
        this.searchButton = document.createElement('button');
        this.searchButton.className = 'pure-button';
        this.searchButton.innerHTML = '<i class="sprite icon Search"></i>Buscar';
        content.appendChild(this.searchButton);
        this.searchHiddenIdDato = document.createElement('input');
        this.searchHiddenIdDato.setAttribute('type', 'hidden');
        this.searchHiddenIdDato.setAttribute('id', 'h_id_dato');
        content.appendChild(this.searchHiddenIdDato);
        this.searchHiddenTxtDato = document.createElement('input');
        this.searchHiddenTxtDato.setAttribute('type', 'hidden');
        this.searchHiddenTxtDato.setAttribute('id', 'h_txt_dato');
        content.appendChild(this.searchHiddenTxtDato);

        initializeEvents.call(this);
    }

    function initializeEvents() {
        var _ = this;
        _.searchButton.addEventListener('click', function() {
            if(_.options.clickBtnSearch) _.options.clickBtnSearch();
            Common.setEstatusBtn(_.searchButton, 'Buscando...', true);
            var dato =  maskDataSearch.call(_);
            //dato = '47-3061-7002660';
            try {
                _.options.functionModel(dato, function(data) {
                    if(typeof(data)!='object') {
                        Common.notificationAlert(data, 'Alerta', 'Ok')
                    }
                    else {
                        _.searchHiddenTxtDato.value = _.searchTxtDato.value;
                        _.searchHiddenIdDato.value = data.Id;
                        _.options.callbackBtnSearch(data);
                    }
                    Common.setEstatusBtn(_.searchButton, 'Buscar', false);
                });
            } catch (error) {
                alert(error);
            }
        });
    }

    function maskDataSearch() {
        var dato = this.searchTxtDato.value;
        var patron = '';
        switch (this.options.maskDataSearch) {
            case 'pedimento':
                patron = /(\d{2})(\d{4})(\d{7})/;
                dato = dato.replace(patron, "$1-$2-$3");
                break;
            case 'ordencarga':
                if(dato.length < 1) return dato;
                patron = /^(\d{1,5})((\-)([1,2])(\d{1}))?$/;
                dato = dato.match(patron)[0]; 
                dato = dato.indexOf('-') == -1 ? dato + '-' + new Date().getFullYear().toString().substr(-2) : dato;
                var folio_anio = dato.split('-');
                var folio = folio_anio[0];
                var str = "" + folio;
                var pad = "00000"
                var ans = pad.substring(0, pad.length - str.length) + str;
                dato = 'ORC-' + ans + '-' + folio_anio[1];
                this.searchTxtDato.value = dato;
                break;
            default:
                alert('the data type not exists...')
                break;
        }
        return dato;
    }

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