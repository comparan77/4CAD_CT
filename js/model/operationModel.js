function OperationModel() {}

OperationModel.carga_recepcion = function(callback, error) {
    var url = urlHandler + 'handlers/Process.ashx?op=asn&opt=lst';
    try {
        Common.fetchJSONFile(
            url, 
            function(data) {
                callback(data);
            }, 
            function(msg) {
                error(msg);
            },
            'GET'
        );
    } catch (error) {
        console.log(error);
    }
}

OperationModel.AsnById = function(id_asn, callback, error) {
    var url = urlHandler + 'handlers/Process.ashx?op=asn&opt=sltById&key=' + id_asn;
    try {
        Common.fetchJSONFile(
            url, 
            function(data) {
                callback(data);
            }, 
            function(msg) {
                error(msg);
            },
            'GET'
        );
    } catch (error) {
        console.log(error);
    }
}

OperationModel.recepcionCortinaDispBodega = function(id_bodega, callback, error) {
    var url = urlHandler + 'handlers/Warehouse.ashx?op=recepcion&opt=cortinaDispobleByBodega&pk=' + id_bodega;
    try {
        Common.fetchJSONFile(
            url, 
            function(data) {
                callback(data);
            }, 
            function(msg) {
                error(msg);
            },
            'GET'
        );
    } catch (error) {
        console.log(error);
    }
}

OperationModel.recepcionCortinaTomar = function(obj, callback, error) {
    var url = urlHandler + 'handlers/Warehouse.ashx?op=recepcion&opt=cortinaTomar';
    try {
        Common.fetchJSONFile(
            url, 
            function(data) {
                callback(data);
            }, 
            function(msg) {
                error(msg);
            },
            'POST',
            JSON.stringify(obj)
        );
    } catch (error) {
        console.log(error);
    }
}

OperationModel.entradaAddAsn = function(id_asn, obj, callback, error) {
    var url = urlHandler + 'handlers/Warehouse.ashx?op=recepcion&opt=entradaAddAsn&pk=' + id_asn;
    console.log(url);
    console.log(JSON.stringify(obj));
    try {
        Common.fetchJSONFile(
            url, 
            function(data) {
                callback(data);
            }, 
            function(msg) {
                error(msg);
            },
            'POST',
            JSON.stringify(obj)
        );
    } catch (error) {
        console.log(error);
    }
}

OperationModel.recepcionCortinaLiberar = function(id_cortina, callback, error) {
    var url = urlHandler + 'handlers/Warehouse.ashx?op=recepcion&opt=cortinaLiberar&pk=' + id_cortina;
    try {
        Common.fetchJSONFile(
            url, 
            function(data) {
                callback(data);
            }, 
            function(msg) {
                error(msg);
            },
            'GET'
        );
    } catch (error) {
        console.log(error);
    }
}



OperationModel.maquila_addLst = function(obj, callback, error) {
    var url = urlHandler + 'handlers/CAEApp.ashx?op=maquila&opt=addLst';
    try {
        Common.fetchJSONFile(
            url, 
            function(data) {
                callback(data);
            }, 
            function(msg) {
                error(msg);
            },
            'POST',
            JSON.stringify(obj)
        );
    } catch (error) {
        console.log(error.message);
    }
}