var RecepcionController = function() {
    
    this.Init = init;
    this.grd_recepcion;
    var  arrData = [];

    function initControles () {
        
        x$('#info_recepcion_mercancia').addClass('hidden');
        OperationModel.carga_recepcion(function(data) {
            x$('#info_load_data').addClass('hidden');
            var rowNum = 1;
            for (var item in data) {
                var objItem = data[item];
                try {
                    var status = 'Descargando...';
                    if(objItem.Fin != '0001-01-01T00:00:00') {
                        status = 'Descargada';
                    }

                    var avance = 0;
                    if(objItem.Por_recibir!=0)
                        avance = Math.trunc(objItem.Tarimas / objItem.Por_recibir * 100);

                    var obj = {
                        Referencia: '0' + objItem.Id,
                        Id: objItem.Id,
                        Fecha: objItem.Inicio,
                        Estatus: status,
                        Avance: avance,
                        Bodega: objItem.Bodega,
                        Cortina: objItem.Cortina,
                        Declaradas: objItem.Por_recibir,
                        Recibidas: objItem.Tarimas,
                        rowNum: rowNum++
                    };

                    arrData.push(obj);

                    if(arrData.length == 0) {
                        x$('#info_recepcion_mercancia').removeClass('hidden');
                    } else {
                        fillGrd(arrData)
                    }                    
                } catch (error) {
                    x$('#info_load_data').addClass('hidden');                    
                    console.log(error.message);
                }

            }
        },
        function(error) {
            
        });
    }

    function init() {
        initControles();
        btn_regresar_click();
        btn_refresh_click();
    }

    function btn_refresh_click() {
        x$('#btn_refresh').on('click', function() {
            arrData = [];
            x$('#info_load_data').removeClass('hidden');
            initControles();
        });
    }

    function initChart(data) {
        var ctx = document.getElementById("myChart").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ["Recibidas", "Pendientes"],
                datasets: [{
                    label: '# of Votes',
                    data: data,
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(255,99,132,1)',
                    ],
                    borderWidth: 1
                }]
            }
        });
    }

    function fillGrd(data) {
        this.grd_recepcion = new DataGrid({
            Id: 'grd_recepcion',
            source: data,
            CssClass: 'pure-table pure-table-horizontal'
        });
        this.grd_recepcion.open();
        this.grd_recepcion.dataBind();

        var rows = document.getElementsByTagName('tr');
        var rowNum = 1;
        for (var row in rows) {
            if(rows[row].parentNode!=undefined) {
                if(rows[row].parentNode.nodeName == 'TBODY') {
                    rows[row].setAttribute('id', 'row_' + rowNum++)

                    rows[row].addEventListener('click', function() { 
                        var rowKey = this.getAttribute('id').split('_')[1] * 1;
                        try {
                            var arrObj = arrData.filter(function(obj) {
                                return obj.rowNum == rowKey;
                            }); 

                            var obj = arrObj[0];

                            var lbl_referencia = document.getElementById('lbl_referencia');
                            var lbl_bodega = document.getElementById('lbl_bodega');
                            var lbl_cortina = document.getElementById('lbl_cortina');
                            var lbl_tar_declarada = document.getElementById('lbl_tar_declarada');
                            var lbl_tar_recibida = document.getElementById('lbl_tar_recibida');
                            var lbl_por_recibir = document.getElementById('lbl_por_recibir');

                            lbl_referencia.innerHTML = obj.Id;
                            lbl_bodega.innerHTML = obj.Bodega;
                            lbl_cortina.innerHTML = obj.Cortina;
                            lbl_tar_declarada.innerHTML = obj.Declaradas;
                            lbl_tar_recibida.innerHTML = obj.Recibidas;
                            lbl_por_recibir.innerHTML = obj.Declaradas - obj.Recibidas;

                            initChart([obj.Recibidas, obj.Declaradas - obj.Recibidas]);

                        } catch (error) {
                            console.log(error.message);
                        }

                        x$('#div_grd').addClass('hidden');
                        x$('#div_detail').removeClass('hidden');
                    }, false); 
                }
            }
        }
    }

    function btn_regresar_click() {
        x$('#btn_regresar').on('click', function() {
            x$('#div_grd').removeClass('hidden');
            x$('#div_detail').addClass('hidden');
        })
    }
}