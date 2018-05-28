var RegPasController = function() {
	
	this.Init = init;
	var arrExistentes;
	var ordenFinded;
	var serSelected;
	var wizard1;
	var vPaso = 0;
	var ImgPaso64;
	var vPasoDelete = undefined;
	var pasos;

	var iniValTouchMenu;
    var finValTouchMenu;

	function init() {

		pasos = document.getElementById('div_pasos');

		DesOrdController.readFileOrdenes(function(data){
			arrExistentes = data;
			if(arrExistentes!=null && arrExistentes.length>0) {
				arrExistentes = JSON.parse(arrExistentes);
				init_controls();
			}
			else {
				Common.setEstatusBtn('btn_search_orden','<i class="sprite icon Search"></i>Buscar Orden', true);
				Common.notificationAlert('No existen códigos cargados en el dispositivo, favor de realizar la carga.', 'Advertencia', 'Ok');
			}
		});
	} 

	function init_controls() {
		try {

			ddl_orden = document.getElementById('ddl_orden');
			var opt = document.createElement('option');
			opt = document.createElement('option');
			opt.innerHTML = 'Selecciona una orden';
			opt.value = 'none';
			ddl_orden.appendChild(opt);
			for(var i = 0; i < arrExistentes.length; i++) {
				opt = document.createElement('option');
				opt.innerHTML = arrExistentes[i].Folio + ' | ' + arrExistentes[i].Referencia_entrada;
				opt.value = arrExistentes[i].Folio;
				ddl_orden.appendChild(opt);
			}
			
			wizard1 = new Wizard({
				content: 'wizard_1',
				maxStep: 2
			});

			wizard1.open();	
			btn_new_sel();
			btn_Photo_click();
			btn_save_click();
			ddl_orden_change();
		} catch (error) {
			console.log('error wizard: ' + error.message);
		}
	}

	function btn_save_click() {
		x$('#btn_save').on('click', function() {
			try {
				Common.setEstatusBtn('btn_save', 'Guardando pasos ...', true);
				DesOrdController.writeFileOrdenes(JSON.stringify(arrExistentes), function() {
					Common.notificationAlert('Los pasos han sido guardados.', 'Info', 'Ok');
					clear_form();
				});
			} catch (error) {
				Common.notificationAlert('Error: ' + error.message, 'Error al Guardar', 'Ok');
			}
		});
	}

	function appendPaso(txtPromt) {
		
				try {
		
					var divRow = document.createElement('div');
					divRow.setAttribute('id', 'div_paso_' + vPaso)
					divRow.className = 'pure-g';
		
					var divCellPaso = document.createElement('div');
					divCellPaso.className = 'pure-u-1-3';
					var divSpnPaso = document.createElement('span');
					divSpnPaso.innerHTML = vPaso;
					divSpnPaso.className = 'spnPaso';
					divCellPaso.appendChild(divSpnPaso);
					divRow.appendChild(divCellPaso);
		
					var divCellImg = document.createElement('div');
					divCellImg.className = 'pure-u-1-3';
					var imgPaso = document.createElement('img');
					var img = document.getElementById("img_foto");
					imgPaso.setAttribute('src', img.getAttribute('src'));
					imgPaso.setAttribute('width', '50%');
					divCellImg.appendChild(imgPaso);
					divRow.appendChild(divCellImg);
			
					var divCellDesc = document.createElement('div');
					divCellDesc.className = 'pure-u-1-3';
					divCellDesc.innerHTML = txtPromt.toUpperCase();
					divRow.appendChild(divCellDesc);
			
					pasos.appendChild(divRow);

					divCellImg.addEventListener('touchmove', function(evt) {
						if(vPasoDelete== undefined) {
							evt.preventDefault();
							var touches = evt.changedTouches;
							for(var i = 0; i < touches.length; i++) {
								if(!iniValTouchMenu)
									iniValTouchMenu = touches[i].pageX;
								if(!finValTouchMenu) {
									if(touches[i].pageX != iniValTouchMenu) {
										finValTouchMenu = touches[i].pageX;
									}
								}
							}
							
							if(iniValTouchMenu != finValTouchMenu) {
								vPasoDelete = this.parentNode.getAttribute('id');
								if(vPaso == vPasoDelete.split('_')[2]*1) {
									Common.notificationConfirm('Desea eliminar el paso capturado?', 'Eliminar', ['Si', 'No'], confirm_remove_paso); 
								} else {
									vPasoDelete = undefined;
								}
							}
						}
					});

					imgPaso.addEventListener('touchstart', function(evt) {
						iniValTouchMenu = undefined;
					});

				} catch (error) {
					console.log('appendPaso error: ' + error.message)
				}	
			}

	function confirm_remove_paso(btn_idx) {
		if(btn_idx == 1) {
			document.getElementById(vPasoDelete).remove();
			serSelected.PLstPasos.pop();
			vPaso --;
		}
		vPasoDelete = undefined;
	}

	function setPhoto(results) {
		switch (results.buttonIndex) {
			case 2:
				var txtPromt = results.input1.trim();
				if(txtPromt.length <= 0) {
					Common.notificationAlert(
						'Es necesario proporcionar la descripción del paso',
						'Error',
						'Ok'
					);
				}
				else {
					vPaso++;
					appendPaso(txtPromt);
					if(vPaso>0) {						
						var oOrdSerPas = new Bean_maquila_paso(
							0,
							serSelected.Id,
							ImgPaso64,
							txtPromt
						);
						serSelected.PLstPasos.push(oOrdSerPas);
					}
				}
				break;

			default:
				break;
		}
	}

	function photoReady(imageData) {
		try {
			var img = document.getElementById("img_foto");
			img.setAttribute('src', imageData);
			getFileContentAsBase64(imageData,function(base64Image) {
				//console.log(base64Image); 
				ImgPaso64 = base64Image.replace('data:image/jpeg;base64,','');
				var pasoDesc = prompt('Descripción del paso:','');
				var results = {
					input1: pasoDesc,
					buttonIndex: pasoDesc == null ? 1: 2
				}
				setPhoto(results);
			});
		} catch (error) {
			console.log('PhotoReady: ' + error.message)
		}
    }

	function btn_Photo_click() {
		x$('#btn_Photo').on('click', function() {
            try {
				Common.capturePhoto(photoReady);  
            } catch (error) {
                alert(error);
            }
        });
	}

	function clear_form() {
		oCADController.Create('regpas');
	}

	function btn_new_sel() {
		x$('#btn_new_sel').on('click', function() { 
			clear_form();
		});
	}
	
	function fillTblServ(data) {
		try {
			var table = document.getElementById("tbody_serv_pasos");
			table.innerHTML = '';
			var withMaquila = false;
			for(var x in data) {
				var row = table.insertRow(x);
				if(x % 2 != 0)
					row.className = "pure-table-odd";

				var cellTipo = row.insertCell(0);
				var cellRef = row.insertCell(1);
				var cellPieza = row.insertCell(2);
				var cellPaso = row.insertCell(3);

				switch (data[x].Id_servicio) {
					case 1:
						cellTipo.innerHTML = 'Etiqueta';
						break;
					case 2:
						cellTipo.innerHTML = 'NOM';
						break;
					default:
						break;
				}
				withMaquila = data[x].PLstMaq.length > 1;
				cellRef.innerHTML = '<a href="#" withMaq=' + withMaquila + ' id="lnkSerSel_' + data[x].Id + '">' + data[x].Ref2 + '</a>';
				cellPieza.innerHTML = data[x].Piezas;
				cellPieza.setAttribute('align', 'center');
				cellPaso.innerHTML = data[x].PLstPasos.length;
				cellPaso.setAttribute('align', 'center');				
				x$('#lnkSerSel_' + data[x].Id).on('click', function() {
					try {
						vPaso = 0;
						pasos.innerHTML = '';

						if(this.getAttribute('withMaq')=='true') {
							Common.notificationAlert('La referencia ya cuenta con fotos.', 'Info', 'Ok');
							wizard1.disabledBtnNext();
							return false;
						}

						var lbl_trafico = document.getElementById('lbl_trafico');
						var lbl_referencia = document.getElementById('lbl_referencia');
						var lbl_etiqueta_tipo = document.getElementById('lbl_etiqueta_tipo');

						lbl_trafico.innerHTML = '';
						lbl_referencia.innerHTML = '';
						lbl_etiqueta_tipo.innerHTML = '';

						var v_idServ = String(x$(this).attr('id')).split('_')[1] * 1;
						serSelected = ordenFinded[0].PLstOTSer.filter(function (obj) {
							return obj.Id == v_idServ;
						});

						serSelected = serSelected[0];

						if(serSelected.PLstPasos != undefined && serSelected.PLstPasos.length > 0) {
							for(var itemFoto in serSelected.PLstPasos) {
								vPaso++;
								var img = document.getElementById("img_foto");
								img.setAttribute('src', 'data:image/jpeg;base64,' + serSelected.PLstPasos[itemFoto].Foto64);
								appendPaso(serSelected.PLstPasos[itemFoto].Descripcion);
							}
						} else {
							serSelected.PLstPasos = [];
						}
						
						wizard1.setStepValid(1);
						wizard1.enabledBtnNext();

						lbl_trafico.innerHTML = serSelected.Ref1;
						lbl_referencia.innerHTML = serSelected.Ref2;
						lbl_etiqueta_tipo.innerHTML = serSelected.PEtiquetaTipo.Nombre;

					} catch (error) {
						console.log(error.message);						
					}
					return false;
				});
			}
		} catch (error) {
			console.log(error.message);
		}
	}

	function btn_search_orden_click() {
		x$('#btn_search_orden').on('click', function() {
			try {
				Common.setEstatusBtn('btn_search_orden', 'Buscando orden ...', true);

				var ordenBuscada = String(x$('#txt_orden').attr('value'));
				ordenBuscada = ordenBuscada.toUpperCase();
				ordenFinded = arrExistentes.filter(function (obj) {
					return obj.Folio.toUpperCase() == ordenBuscada;
				});

				lbl_supervisor = document.getElementById('lbl_supervisor');
				lbl_folio = document.getElementById('lbl_folio');
				lbl_supervisor.innerHTML = '';
				lbl_folio.innerHTML = '';

				if(ordenFinded.length > 0) {
					x$('#div_sel_servicio').removeClass('hidden');
					x$('#div_new_search').removeClass('hidden');
					x$('#div_search_orden').addClass('hidden');
					lbl_folio.innerHTML =  ordenFinded[0].Folio;
					lbl_supervisor.innerHTML =  ordenFinded[0].Supervisor;
					fillTblServ(ordenFinded[0].PLstOTSer);
				}
				else {
					Common.notificationAlert('El la orden no ha sido encontrada', 'info', 'ok');
				}
				Common.setEstatusBtn('btn_search_orden', '<i class="sprite icon Search"></i>Buscar Orden', false);
			} catch (error) {

				Common.setEstatusBtn('btn_search_orden', '<i class="sprite icon Search"></i>Buscar Orden', false);
			}
		});
	}

	function ddl_orden_change() {
		var ddl_orden = document.getElementById('ddl_orden');
		ddl_orden.addEventListener('change', function() {
			for (var i=0; i<ddl_orden.length; i++) {
				if (ddl_orden.options[i].value == 'none' )
					ddl_orden.remove(i);
				}
			
				var ordenBuscada = ddl_orden.value;
				ordenBuscada = ordenBuscada.toUpperCase();
				ordenFinded = arrExistentes.filter(function (obj) {
					return obj.Folio.toUpperCase() == ordenBuscada;
				});

				lbl_supervisor = document.getElementById('lbl_supervisor');
				lbl_folio = document.getElementById('lbl_folio');
				lbl_ref_ent = document.getElementById('lbl_ref_ent');
				lbl_supervisor.innerHTML = '';
				lbl_folio.innerHTML = '';
				lbl_ref_ent.innerHTML = '';

				if(ordenFinded.length > 0) {
					x$('#div_sel_servicio').removeClass('hidden');
					x$('#div_new_sel').removeClass('hidden');
					x$('#div_sel_orden').addClass('hidden');
					lbl_folio.innerHTML =  ordenFinded[0].Folio;
					lbl_ref_ent.innerHTML = ordenFinded[0].Referencia_entrada;
					lbl_supervisor.innerHTML =  ordenFinded[0].Supervisor;
					fillTblServ(ordenFinded[0].PLstOTSer);
				}
		});
	}
}