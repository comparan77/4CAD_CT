var Menu = function() {
	this.Init = init;
	var iniValTouchMenu;
    var finValTouchMenu;
	var mySidenav;
	
	function init() {
		mySidenav = document.getElementById('mySidenav');
		oCADController.Create(menuAct);
		x$('#div_' + menuAct).removeClass('hidden');
		
		initControls();	
	}

	function initControls() {
		click_lnkMenu();
		click_option();
		mySidenav_touch();
	}
	function click_lnkMenu() {
		document.getElementById('lnkMenu').addEventListener('click', function() {
			Menu.openNav();
		});
	}

	function click_option() {
		var opts = x$('li').has('.optMenu');
		for (var index = 0; index < opts.length; index++) {
			var element = opts[index];
			x$(element).find('a').click(function(){
				menuSel = String(x$(this).attr('id')).split("_")[1];
				if(menuAct != menuSel) 
				{
					x$('#div_' + menuAct).addClass('hidden');
					x$('#div_' + menuAct).html('');
					Menu.removeActive(menuSel);
					x$('#div_' + menuSel).removeClass('hidden');
					x$(this).addClass('active');
					oCADController.Create(menuSel);
				}
				else {
					oCADController.Create(menuSel);
				}
				Menu.closeNav();
			});
		}
	}

	function mySidenav_touch() {
		mySidenav.addEventListener('touchmove', function(evt) {
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
			if(iniValTouchMenu > finValTouchMenu) 
				Menu.closeNav();
		});
	
		mySidenav.addEventListener('touchstart', function(evt) {
			iniValTouchMenu = undefined;
		});
	}
}

Menu.removeActive = function(menuSel) {
	if(menuAct != menuSel) 
	{
		x$('#lnk_' + menuAct).removeClass('active');
		menuAct = menuSel;
	}
}

Menu.changeOpt = function(opt) {
	if(menuAct != opt) 
	{
		x$('#div_' + menuAct).addClass('hidden');
		x$('#div_' + menuAct).html('');
		Menu.removeActive(opt);
		x$('#div_' + opt).removeClass('hidden');
		var optMenuClass = document.getElementsByClassName('optMenu');
		for(itemOpt in optMenuClass) {
			objSel = optMenuClass[itemOpt];
			if(objSel.firstChild.getAttribute('id').split('_')[1] == opt) 
				break;
		}
		objSel.firstChild.className = 'active';
		oCADController.Create(opt);
	}
	else {
		oCADController.Create(opt);
	}
}

Menu.closeNav = function() {
	document.getElementById("mySidenav").style.width = "0";
}

Menu.openNav = function() {
	document.getElementById("mySidenav").style.width = "250px";
}