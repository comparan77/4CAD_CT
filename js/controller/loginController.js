var Login = function() {
    this.Init = init;

    function initControls() {
        btn_click();
    }

    function validaCredenciales(email, pass) {
        try {
            if(pass == '') {
                x$('#div_login').addClass('hidden');
                x$('#mainMenu').removeClass('hidden');
                oIndexCtrl.InitMenu();
            }
            else {
                Common.notificationAlert('Las credenciales no son válidas', 'Login', 'Ok');
                Common.setEstatusBtn('access', 'Login', false);
            }
        } catch (error) {
            alert(error);
        }
    }

	function init() {
		initControls();
	} 

    function btn_click() {
        x$('#access').on('click', function() {
            var passValue = x$("#txt_password").attr('value');
            Common.setEstatusBtn('access', 'Validando', true);
            validaCredenciales('', passValue);
        });
    }
}