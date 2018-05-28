/**Orden de trabajo */
var Bean_orden_trabajo = function(id, folio, referencia, referencia_entrada, fecha, supervisor) {
    this.Id = id;
    this.Folio = folio;
    this.Referencia = referencia;
    this.Referencia_entrada = referencia_entrada;
    this.Fecha = fecha;
    this.Supervisor = supervisor;
    this.PLstOTSer = [];
    this.PEnt;
}

var Bean_orden_trabajo_servicio = function(id, id_orden_trabajo, id_servicio, id_etiqueta_tipo, piezas, piezasMaq, ref1, ref2) {
    this.Id = id;
    this.Id_orden_trabajo = id_orden_trabajo;
    this.Id_servicio = id_servicio;
    this.Id_etiqueta_tipo = id_etiqueta_tipo;
    this.Piezas = piezas;
    this.PiezasMaq = piezasMaq;
    this.Ref1 = ref1;
    this.Ref2 = ref2;
    this.PEntLiv;
    this.PLstMaq = [];
    this.PLstPasos = [];
    this.PEtiquetaTipo;
}

var Bean_etiqueta_tipo = function(id, nombre) {
    this.Id = id;
    this.Nombre = nombre;
}

var Bean_maquila_paso = function(id, id_ord_tbj_srv, foto64, descripcion) {
    this.Id = id;
    this.Id_ord_tbj_srv = id_ord_tbj_srv;
    this.Foto64 = foto64;
    this.Descripcion = descripcion;
}

var Bean_maquila = function(id, id_ord_tbj_srv, fecha, piezas, bultos, pallets, capturada) {
    this.Id = id;
    this.Id_ord_tbj_srv = id_ord_tbj_srv;
    this.Fecha = fecha;
    this.Piezas = piezas;
    this.Bultos = bultos;
    this.Pallets = pallets;
    this.Capturada = capturada;
    this.PLstPasos = [];
}

/**Entrada Auditoria Mercancia */
var BeanEntrada_liverpool = function (id, id_entrada, proveedor, trafico, pedido, piezas, fecha_confirma, piezas_maq, fecha_maquila, num_pasos) {
    this.Id = id;
    this.Id_entrada = id_entrada;
    this.Proveedor = proveedor;
    this.Trafico = trafico;
    this.Pedido = pedido;
    this.Piezas = piezas;
    this.Fecha_confirma = fecha_confirma;
    this.Piezas_maq = piezas_maq;
    this.Fecha_maquila = fecha_maquila;
    this.Piezas_maquiladas_hoy = 0;
    this.Num_pasos = num_pasos;
    this.PLstMaquila;
}

var BeanEntrada_liverpool_maquila = function (id, id_entrada_liverpool, piezas, fecha_maq) {
    this.Id = id;
    this.Id_entrada_liverpool = id_entrada_liverpool;
    this.Piezas = piezas;
    this.Fecha_maq = fecha_maq;
    this.PEntLivSer;
}

var BeanEntrada_liverpool_servicio = function (id, id_liverpool_maquila, id_servicio) {
    this.Id = id;
    this.Id_liverpool_maquila = id_liverpool_maquila;
    this.Id_servicio = id_servicio;
}