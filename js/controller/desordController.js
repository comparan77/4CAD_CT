var DesOrdController = function() {
	
	this.Init = init;
	var grd_ordenes;
	var arrExistentes;
	
	function cargar_ordenes() {
		try {
			var arrOrdTbj = [];
			OperationModel.carga_ordenes_trabajo(function(data) {
				var objOrdTbj;
				var arrOrdTbjSer = [];
				var objOrdTbjSer;
				var pLstOTSer;
				var objEntLiv;
				if(data.length == 0) {
					Common.notificationAlert('No existen órdenes de trabajo en sistema', 'Info', 'Ok');
					Common.setEstatusBtn('btn_load', '<i class="sprite icon DownloadfromtheCloud"></i>&nbsp;Descargar órdenes', false);
					return false;
				}

				for(var x in data) {
					var ordTbjExistente = findOrdTrbInLocal(data[x].Folio);
						arrOrdTbjSer = [];
						objOrdTbj = new Bean_orden_trabajo(
							data[x].id,
							data[x].Folio,
							data[x].Referencia,
							data[x].Referencia_entrada,
							data[x].Fecha,
							data[x].Supervisor
						);
						pLstOTSer = data[x].PLstOTSer;
						objOrdTbj.PEnt = data[x].PEnt;
						for (var y in pLstOTSer) {
							objOrdTbjSer = new Bean_orden_trabajo_servicio(
								pLstOTSer[y].Id,
								pLstOTSer[y].Id_orden_trabajo,
								pLstOTSer[y].Id_servicio,
								pLstOTSer[y].Id_etiqueta_tipo,
								pLstOTSer[y].Piezas,
								pLstOTSer[y].PiezasMaq,
								pLstOTSer[y].Ref1,
								pLstOTSer[y].Ref2
							);
							objOrdTbjSer.PEtiquetaTipo = pLstOTSer[y].PEtiquetaTipo;
							if(pLstOTSer[y].PLstMaq) {
								objOrdTbjSer.PLstMaq = pLstOTSer[y].PLstMaq;
								objOrdTbjSer.PLstPasos = pLstOTSer[y].PLstPasos;
							}
							
							if(ordTbjExistente!=null) {
								ordTbjExistente.PLstOTSer.filter(function(obj) {
									if(obj.Id == objOrdTbjSer.Id) {
										objOrdTbjSer.PLstPasos = obj.PLstPasos;
									}
								});
							}
							
							if(objOrdTbjSer.Id_orden_servicio == 1) {
								objEntLiv = new BeanEntrada_liverpool(
									pLstOTSer[x].PEntLiv.Id,
									pLstOTSer[x].PEntLiv.Id_entrada,
									pLstOTSer[x].PEntLiv.Proveedor,
									pLstOTSer[x].PEntLiv.Trafico,
									pLstOTSer[x].PEntLiv.Pedido,
									pLstOTSer[x].PEntLiv.Piezas,
									pLstOTSer[x].PEntLiv.Fecha_confirma,
									pLstOTSer[x].PEntLiv.Piezas_maq,
									pLstOTSer[x].PEntLiv.Fecha_maquila,
									pLstOTSer[x].PEntLiv.Num_pasos
								)
								objOrdTbjSer.PEntLiv = objEntLiv;
							}
							arrOrdTbjSer.push(objOrdTbjSer);
						}
						objOrdTbj.PLstOTSer = arrOrdTbjSer;
						arrOrdTbj.push(objOrdTbj);
				}
				if(arrOrdTbj.length>0) {
					DesOrdController.writeFileOrdenes(JSON.stringify(arrOrdTbj), function() {
						arrExistentes = JSON.stringify(arrOrdTbj);
						fillOrdenesTbl();					
						Common.notificationAlert('Se cargaron ' + arrOrdTbj.length + ' ordenes correctamente', 'Info', 'Ok');
						Common.setEstatusBtn('btn_load', '<i class="sprite icon DownloadfromtheCloud"></i>&nbsp;Descargar órdenes', false);
					});
				} 
				else {
					Common.notificationAlert('Por el momento no existen nuevas órdenes de trabajo', 'Info', 'Ok');
					Common.setEstatusBtn('btn_load', '<i class="sprite icon DownloadfromtheCloud"></i>&nbsp;Descargar órdenes', false);
				}		
			},
			function (error) {
				Common.notificationAlert('Error: ' + error + '\nFavor de contactar al administrador', 'Error', 'Ok');
				Common.setEstatusBtn('btn_load', '<i class="sprite icon DownloadfromtheCloud"></i>&nbsp;Descargar órdenes', false);
			});

		} catch (error) {
			Common.notificationAlert(error.message, 'Error', 'Ok');
			Common.setEstatusBtn('btn_load', '<i class="sprite icon DownloadfromtheCloud"></i>&nbsp;Descargar órdenes', false);			
		}
	}

	function fillOrdenesTbl() {
		if(arrExistentes!=null && arrExistentes.length>0) {
			arrExistentes = JSON.parse(arrExistentes);
			var v_LstOTSer;
			var arrData = [];
			var objOrd;
			for(var x in arrExistentes) {
				var objOrd = {
					Folio: '',
					Fecha: '',
					Precio: '',
					Nom: ''
				};
				objOrd.Folio = arrExistentes[x].Folio;
				objOrd.Fecha = arrExistentes[x].Fecha.replace(/(T.*)/g, "");
				v_LstOTSer = arrExistentes[x].PLstOTSer;
				
				for(var y in v_LstOTSer) {
					switch (v_LstOTSer[y].Id_servicio) {
						case 1:
							objOrd.Precio = v_LstOTSer[y].Piezas + '/' + v_LstOTSer[y].PiezasMaq;
							break;
						case 2:
							objOrd.Nom = v_LstOTSer[y].Piezas + '/' + v_LstOTSer[y].PiezasMaq;
							break;
						default:
							break;
					}
				}
				arrData.push(objOrd);
			}
			try {
				grd_ordenes = new DataGrid({
					Id: 'grd_ordenes',
					source: arrData
				});
				grd_ordenes.open();
				grd_ordenes.dataBind();	
			} catch (error) {
				console.log(error.message);
			}
			
		}

	}

	function findOrdTrbInLocal(folio) {
		var itemOT = [];
		if(arrExistentes!=null && arrExistentes.length>0) {
			var itemOT = arrExistentes.filter(function(obj) {
				return obj.Folio == folio;
			});
		}
		if(itemOT.length != undefined && itemOT.length > 0) {
			if(itemOT[0].PLstOTSer.length > 0)
				return itemOT[0];
			else 
				return null;
		} else
			return null;
	}

	function find_ordenes_maquilados(codliver) {
		var maquilados = [];
		try {
			if(codliver!=null && codliver.length>0) {
				codliver = JSON.parse(codliver);
				maquilados = codliver.filter(function(obj) {
					return obj.Piezas_maquiladas_hoy > 0;
				});	
			}
		} catch (error) {
			console.log('method find_ordenes_maquilados error: ' + error.message);
		}
		
		return maquilados;
	}

	function init() {
		init_controls();
	} 

	function init_controls() {
		x$('#btn_load').on('click', function() {
			if(grd_ordenes) 
				grd_ordenes.clear();
			switch (Common.checkConnection().tipo) {
				case Connection.UNKNOWN:
				case Connection.NONE:
					Common.notificationAlert('Es necesario tener acceso a internet para descargar las órdenes de trabajo');
					break;
				default:
					Common.setEstatusBtn('btn_load', '<i class="sprite icon DownloadfromtheCloud"></i>&nbsp;Descargando ordenes...', true);
					DesOrdController.readFileOrdenes(function(data){
						arrExistentes = data;
						if(arrExistentes!=null && arrExistentes.length>0) 
							arrExistentes = JSON.parse(arrExistentes);
						cargar_ordenes();
					});
					break;
			}
        });
	}
}

DesOrdController.writeFileOrdenes = function(data, callback) {
	Common.CreateFile('ordenes.txt', false, function(obj) {
        Common.writeFile(obj, data, false, function() {
             if(callback) callback();
        });
    });
}

DesOrdController.readFileOrdenes = function(callback) {
	Common.CreateFile('ordenes.txt', false, function(obj) { 
        return Common.readFile(obj, function(result) {
            if(callback) callback(result);
        });
    });
}