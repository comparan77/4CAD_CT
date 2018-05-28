function OperationModel() {}

OperationModel.carga_recepcion = function(callback, error) {
    var url = urlHandler + 'handlers/Almacen.ashx?op=recepcion&opt=lst';
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