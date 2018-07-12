var RecepcionController = function() {
    
    this.Init = init;
    this.grd_recepcion;
    var arrData = [];
    
    var ddl_cortina;
    var lbl_tarima;
    
    var oCortDisp;
    var oAsn;
    var arrTarima = [];

    var Tarima;

    var h2_opt_Act = 'Listado de ASN';
    var h2_opt_Ant = 'Listado de ASN';

    function initControles () {
        
        x$('#info_recepcion_mercancia').addClass('hidden');
        arrData = [];
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
                        rowNum: rowNum,
                        Id: objItem.Id,
                        Folio: objItem.Folio,
                        Fecha: objItem.Fecha_hora,
                        Cliente: objItem.ClienteNombre,
                        Cortina: objItem.CortinaNombre,
                        Pallet: objItem.Pallet,
                        UnidadVerificada: false
                    };
                    if(!objItem.Descargada) {
                        arrData.push(obj);
                        rowNum++;                  
                    }
                } catch (error) {
                    x$('#info_load_data').addClass('hidden');                    
                    console.log(error.message);
                }
            }
            if(arrData.length == 0) {
                x$('#info_recepcion_mercancia').removeClass('hidden');
                Common.clearNode('tbl_grd_recepcion');
            } else {
                fillGrd(arrData);
            }  
        },
        function(error) {
            
        });
    }

    function init() {
        ddl_cortina = document.getElementById('ddl_cortina');
        lbl_tarima = document.getElementById('lbl_tarima');

        initControles();
        btn_regresar_click();
        btn_regresar_grd_click();
        btn_refresh_click();
        ddl_cortina_change();
        btn_init_scan_tarima_click();
        btn_init_scan_producto_click();
        btn_confirmar_unidad_click();
        btn_cerrar_recibo_click();
    }

    function btn_cerrar_recibo_click() {
        x$('#btn_cerrar_recibo').on('click', function() {

            var arrSalida = [];

            for(var t in arrTarima) {
                var oSal = {
                    Id: 0,
                    Referencia: document.getElementById('lbl_referencia').innerHTML,
                    Fecha: '0001-01-01',
                    Sku: arrTarima[t].Sku,
                    Mercancia: '',
                    Ubicacion: '',
                    Serielote: '',
                    Sid: arrTarima[t].Sid,
                    Tarima: 1,
                    Cantidad: arrTarima[t].Cajas,
                    Calidad: 'A'
                };
                arrSalida.push(oSal);
            }
            x$('#btn_cerrar_recibo').addClass('pure-button-disabled');
            x$('#btn_cerrar_recibo').html('Cerrando recibo ...')
            OperationModel.entradaAddAsn(
                arrTarima[0].Id_asn,
                arrSalida,
                function(data) {
                    x$('#div_grd').removeClass('hidden');
                    x$('#div_detail').addClass('hidden');
                    x$('#btn_cerrar_recibo').addClass('pure-button-disabled');
                    x$('#btn_cerrar_recibo').html('Cerrar recibo')
                    initControles();
                    Common.notificationAlert('La recepción se guardó correctamente', 'Cierre', 'Ok');
                },
                function (err) {
                    Common.notificationAlert(err.message, 'Error en cierre', 'Ok');
                }
            );
        });
    }

    function btn_confirmar_unidad_click() {
        x$('#btn_confirmar_unidad').on('click', function() {
            var idx = arrData.map(function(e) { return e.Folio; }).indexOf(document.getElementById('lbl_folio_asn').innerHTML);
            arrData[idx].UnidadVerificada = true;
            x$('#div_grd').removeClass('hidden');
            x$('#div_verificar_unidad').addClass('hidden');
            x$('#h2_opt').html(h2_opt_Ant);
            fillGrd(arrData);
        });
    }

    function ddl_cortina_change() {
        ddl_cortina.addEventListener('change', function() {
            
            var id_cortina = this.value;

            oCortDisp = {
                Id_usuario: 1,
                Id: 0,
                Id_cortina: id_cortina,
                Id_asn: oAsn.Id,
                Tarima_x_recibir: oAsn.Pallet,
                Tarima_recibida: 0
            }
            
            x$('#btn_regresar_grd').html('Tomando cortina disponible...').addClass('pure-button-disabled');
            x$('#ddl_cortina').addClass('pure-button-disabled');

            OperationModel.recepcionCortinaTomar(
                oCortDisp,
                function(data) {

                    x$('#btn_regresar_grd').html('Regresar').removeClass('pure-button-disabled');
                    x$('#ddl_cortina').removeClass('pure-button-disabled');

                    x$('#div_grd').removeClass('hidden');
                    x$('#div_sin_cortina').addClass('hidden');

                    x$('#info_load_data').removeClass('hidden');
                    x$('#h2_opt').html(h2_opt_Ant);
                    initControles();
                },
                function (err) {
                    console.log(err.message);
                }
            )
        });
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

        var rows = document.getElementById('grd_recepcion').getElementsByTagName('tr');
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
                            oAsn = obj;
                            //console.log(JSON.stringify(arrData));
                            if(obj.Cortina != null) {
                            
                                OperationModel.AsnById(
                                    obj.Id, 
                                    function(data) {

                                        if(obj.UnidadVerificada) {
                                            arrTarima = [];
                                            oAsn = data;
                                            //console.log(JSON.stringify(data));

                                            var lbl_referencia = document.getElementById('lbl_referencia');
                                            var lbl_bodega = document.getElementById('lbl_bodega');
                
                                            lbl_referencia.innerHTML = data.Referencia;
                                            lbl_bodega.innerHTML = data.BodegaNombre;
                                            lbl_cortina.innerHTML = data.CortinaNombre;

                                            for(var p in data.PLstPartida) {
                                                data.PLstPartida[p].TarRec = 0;
                                                data.PLstPartida[p].CajRec = 0;
                                            }

                                            var grd_partida = new DataGrid({
                                                Id: 'grd_partida',
                                                source: data.PLstPartida,
                                                CssClass: 'pure-table pure-table-horizontal'
                                            });

                                            grd_partida.open();
                                            grd_partida.dataBind();

                                            x$('#div_grd').addClass('hidden');
                                            x$('#div_detail').removeClass('hidden');
                                            h2_opt_Act = 'Asignar SID';
                                            x$('#h2_opt').html(h2_opt_Act);
                                        } else {

                                            document.getElementById('lbl_transportista').innerHTML = data.Operador;
                                            document.getElementById('lbl_transporte').innerHTML = data.TransporteNombre;
                                            document.getElementById('lbl_folio_asn').innerHTML = data.Folio;

                                            x$('#div_grd').addClass('hidden');
                                            x$('#div_verificar_unidad').removeClass('hidden');
                                            fillGrdUnidad(data.PLstTranSello);
                                            h2_opt_Act = 'Verificar Unidad';
                                            x$('#h2_opt').html(h2_opt_Act);
                                        }
                                    },
                                    function(msg) {
                                        console.log(msg.message);
                                    }
                                );
                                
                            } else {
                                
                                OperationModel.recepcionCortinaDispBodega(
                                    1,
                                    function(data) {
                                        
                                        Common.clearNode('ddl_cortina');    
                                        var opt = document.createElement('option');
                                        opt = document.createElement('option');
                                        opt.innerHTML = 'Selecciona una cortina';
                                        opt.value = 'none';
                                        ddl_cortina.appendChild(opt);
                                        for(var i = 0; i < data.length; i++) {
                                            opt = document.createElement('option');
                                            opt.innerHTML = data[i].Nombre;
                                            opt.value = data[i].Id;
                                            ddl_cortina.appendChild(opt);
                                        }

                                        x$('#div_grd').addClass('hidden');
                                        x$('#div_sin_cortina').removeClass('hidden');
                                        h2_opt_Act = 'Asignar Cortina';
                                        x$('#h2_opt').html(h2_opt_Act);
                                    },
                                    function (err) {
                                        console.log(err.message);
                                    }
                                );
                            }

                            //initChart([obj.Recibidas, obj.Declaradas - obj.Recibidas]);

                        } catch (error) {
                            console.log(error.message);
                        }

                    }, false); 
                }
            }
        }
    }

    function fillGrdUnidad(data) {

        //console.log(JSON.stringify(data));

        var grd_unidad = new DataGrid({
            Id: 'grd_unidad',
            source: data,
            CssClass: 'pure-table pure-table-horizontal'
        });

        grd_unidad.open();
        grd_unidad.dataBind();
    }

    function btn_regresar_click() {
        x$('#btn_regresar').on('click', function() {
            x$('#div_grd').removeClass('hidden');
            x$('#div_detail').addClass('hidden');
            x$('#h2_opt').html(h2_opt_Ant);
        })
    }

    function btn_regresar_grd_click() {
        x$('#btn_regresar_grd').on('click', function() {
            x$('#div_grd').removeClass('hidden');
            x$('#div_sin_cortina').addClass('hidden');
            x$('#h2_opt').html(h2_opt_Ant);
        })
    }

    function btn_init_scan_tarima_click() {
        x$('#btn_init_scan_tarima').on('click', function() {
            scanearTarima();
        });
    }

    function btn_init_scan_producto_click() {
        x$('#btn_init_scan_producto').on('click', function() {
            scanearProducto();
        });
    }

    function scanearTarima() {
        lbl_tarima.innerHTML = '';
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                lbl_tarima.innerHTML = result.text;

                Tarima = {
                    Id_asn: oAsn.Id,
                    Sid: result.text,
                    Cajas: 0,
                    Sku: ''
                };

                if(arrTarima.filter(function(obj) {
                    return obj.Sid == result.text;
                }).length == 0 ) {

                    x$('#btn_init_scan_tarima').addClass('hidden');
                    x$('#div_tarima_seleccionada').removeClass('hidden');
                    x$('#div_tarima_producto').removeClass('hidden');

                } else {
                    Common.notificationAlert('La tarima ya ha sido completada, por favor selecciona otra tarima', 'Estatus Tarima');
                }
            },
            function (error) {
                Common.notificationAlert(error, 'Fallo escaneo', 'Ok');
            }
        );
    }

    function scanearProducto(cancelled) {
        //var lbl_tarima = document.getElementById('lbl_tarima');
        //lbl_tarima.innerHTML = '';
        if(cancelled == undefined) cancelled = false;
        if(cancelled == true)
            return false;

        cordova.plugins.barcodeScanner.scan(
            function (result) {

                var oCaja = oAsn.PLstPartida.find(function(obj){
                    return obj.Sku == result.text;
                });

                Tarima.Cajas ++;
                Tarima.Sku = result.text;

                if(Tarima.Cajas == oCaja.PMercancia.Cajas_x_tarima) {
                    Common.notificationAlert('Tarima completada', 'Estatus Tarima');
                    arrTarima.push(Tarima);

                    x$('#btn_init_scan_tarima').removeClass('hidden');
                    x$('#div_tarima_seleccionada').addClass('hidden');
                    x$('#div_tarima_producto').addClass('hidden');

                    updateGrdPartida();
                    scanearProducto(true);
                }
                else {
                    scanearProducto(result.cancelled);
                }
            },
            function (error) {
                Common.notificationAlert(error, 'Fallo escaneo', 'Ok');
            }
        );
    }

    function updateGrdPartida() {
        var trPartidas = document.getElementById('grd_partida').getElementsByTagName('tr');
        
        var totTarima = 0;
        var totCaja = 0;
        var cajas = 0;
        for(var i = 1; i < trPartidas.length; i++) {
            var trP = trPartidas[i];
            var arrSku = arrTarima.filter(function(obj) {
                return obj.Sku == trP.children[0].innerHTML;
            });
            trP.children[3].innerHTML = arrSku.length;

            cajas = arrSku.reduce(function(a,b) {
                return { Cajas: a.Cajas + b.Cajas };
            }).Cajas;

            trP.children[4].innerHTML = cajas;

            totTarima += parseInt(trP.children[1].innerHTML);
            totCaja += parseInt(trP.children[2].innerHTML);
        }

        cajas = arrTarima.reduce(function(a,b) {
            return { Cajas: a.Cajas + b.Cajas };
        }).Cajas;

        console.log('arr tarima: ' + arrTarima.length + ', tbl: ' + totTarima);
        console.log('arr caja: ' + cajas + ', tbl: ' + totCaja);

        if(arrTarima.length == totTarima && cajas == totCaja) {
            x$('#btn_cerrar_recibo').removeClass('pure-button-disabled');
        }

    }

}