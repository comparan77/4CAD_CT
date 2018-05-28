function CatalogosModel() {}

/**Usuarios */
CatalogosModel.UsuarioCredencialesValidas = function (obj, callback) {
    var url = urlHandler + 'handlers/CAEApp.ashx?op=usuario&opt=CredencialesValidas';
    try {
        var opts = '';
        Common.fetchJSONFile(
            url, 
            function(data) {
                callback(data);
            }, 
            'POST',
            JSON.stringify(obj)
        );
    } catch (error) {
        alert(error);
    }
}