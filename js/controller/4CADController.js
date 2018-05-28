var CADController = function() {
    this.Create = create;

    function create(type){
        var obj;
        try {
            if (type === "login") {
                obj = new Login();
            } else if (type === "inicio") {
                obj = new Inicio();
            } else if (type === "recepcion") {
                obj = new RecepcionController();
            } else if (type === "regpas") {
                obj = new RegPasController();
            } else if (type === "capmaq") {
                obj = new CapmaqController();
            } else if (type === "desmaq") {
                obj = new DesmaqController();
            } else if (type === "config") {
                obj = new ConfigController();
            }
            x$('#div_' + type).xhr('./' + type + '.html', {
                async: true,
                callback: function() { 
                    try {
                        x$('#div_' + type).html(this.responseText);
                        obj.Init();    
                    } catch (error) {
                        console.log('error CADController, ' + type + ' xhr: ' + error.message);
                    }
                },
            });
        } catch (error) {
            console.log(error.message);
        }
        
    }
}