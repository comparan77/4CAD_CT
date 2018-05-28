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
                    var status = 'Descargando';
                    if(objItem.Por_recibir == objItem.Tarimas) {
                        status = 'Descargada';
                    }

                    var obj = {
                        Referencia: '',
                        Id: objItem.Id,
                        Fecha: objItem.Inicio,
                        Estatus: status,
                        Avance: objItem.Tarimas / objItem.Por_recibir * 100,
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
    }

    function initChart() {
        var ctx = document.getElementById("myChart").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
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

                            var lbl_bodega = document.getElementById('lbl_bodega');
                            var lbl_cortina = document.getElementById('lbl_cortina');
                            var lbl_tar_declarada = document.getElementById('lbl_tar_declarada');
                            var lbl_tar_recibida = document.getElementById('lbl_tar_recibida');

                            lbl_bodega.innerHTML = obj.Bodega;
                            lbl_cortina.innerHTML = obj.Cortina;
                            lbl_tar_declarada.innerHTML = obj.Declaradas;
                            lbl_tar_recibida.innerHTML = obj.Recibidas;

                            initChart();

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