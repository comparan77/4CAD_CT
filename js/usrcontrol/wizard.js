;(function() {
    
    // Define constructor
    this.Wizard = function() {

        // Create global element references
        this.stepNum = null;
        this.maxStep = null;
        this.arrStepValid = null;
        this.lnkAnt = null;
        this.lnkSig = null;
        
        // Define option defaults
        var defaults = {
            content: '',
            maxStep: 1,
            arrCallBackAnt: [],
            arrCallBackSig: []
        }

        // Create options by extending defaults with the passed in arugments
        if (arguments[0] && typeof arguments[0] === "object") {
            this.options = extendDefaults(defaults, arguments[0]);
        }

    }

    // Public methods
    Wizard.prototype.open = function() {
        // open code goes here
        buildOut.call(this);

        initializeEvents.call(this);
    }

    Wizard.prototype.setStepValid = function(step) {
		if(this.arrStepValid.indexOf(step)<0)
			this.arrStepValid.push(step);
    }

    Wizard.prototype.remStepValid = function(step) {
        var idx = this.arrStepValid.indexOf(step);
        this.arrStepValid.splice(idx, 0);
    }
    
    Wizard.prototype.enabledBtnNext = function() {
        setEstatusBtn.call(this, 'lnk_sig', 'SIG >', true);
		this.lnkSig.classList.remove('pure-button-disabled');
		this.showBtnNext();
	}

	Wizard.prototype.disabledBtnNext = function() {
		setEstatusBtn.call(this, 'lnk_sig', 'SIG >', false);
		this.lnkSig.className ='pure-button-disabled';
	}

	Wizard.prototype.showBtnNext = function() {
		this.lnkSig.classList.remove('hidden');
	}

	Wizard.prototype.hideBtnNext = function() {
		this.lnkSig.className ='hidden';
	}

	Wizard.prototype.enabledBtnPrev = function() {
		setEstatusBtn.call(this, 'lnk_ant', '< ANT', true);
		this.lnkAnt.classList.remove('pure-button-disabled');
		this.showBtnPrev();
	}

	Wizard.prototype.disabledBtnPrev = function() {
		setEstatusBtn.call(this, 'lnk_ant', '< ANT', false);
		this.lnkAnt.className ='pure-button-disabled';
	}

	Wizard.prototype.showBtnPrev = function() {
		this.lnkAnt.classList.remove('hidden');
	}

	Wizard.prototype.hideBtnPrev = function() {
        this.lnkAnt.className ='hidden';
	}

    function buildOut() {
        this.stepNum = 1;
        this.arrStepValid = [];
        var content = document.getElementById(this.options.content);
        content.className = 'navigator';
        
        this.lnkAnt = document.createElement('a');
        this.lnkAnt.setAttribute('href', '#');
        this.lnkAnt.setAttribute('id', 'lnk_ant');
        this.lnkAnt.innerHTML = '< ANT';
        content.appendChild(this.lnkAnt);

        this.lnkSig = document.createElement('a');
        this.lnkSig.setAttribute('href', '#');
        this.lnkSig.setAttribute('id', 'lnk_sig');
        this.lnkSig.innerHTML = 'SIG >';
        content.appendChild(this.lnkSig);

        this.hideBtnPrev();
		this.disabledBtnNext();
    }

    function initializeEvents() {
        var _ = this;
        if(this.lnkAnt && this.lnkSig) {
            
            this.lnkSig.addEventListener('click', function() {
                try {
                    document.getElementById('step_' + _.stepNum).className ='hidden';
                    _.stepNum ++;
                    document.getElementById('step_' + _.stepNum).classList.remove('hidden');
                    _.enabledBtnPrev();
                    if(_.arrStepValid.indexOf(_.stepNum)<0)
                        _.disabledBtnNext();
                    else
                        _.enabledBtnNext();
                    _.lnkSig.innerHTML = 'SIG >';
                    if(_.stepNum == _.options.maxStep) {
                        _.lnkSig.innerHTML = 'FIN';
                    }    
                    if(_.options.arrCallBackSig[_.stepNum - 1]) 
                    _.options.arrCallBackSig[_.stepNum - 1]();
                } catch (error) {
                    console.log(error.message);
                }
            });

            this.lnkAnt.addEventListener('click', function() {
                try {
                    document.getElementById('step_' + _.stepNum).className ='hidden';
                    _.stepNum --;
                    document.getElementById('step_' + _.stepNum).classList.remove('hidden');
                    if(_.stepNum == 1)
                        _.hideBtnPrev();
                    _.enabledBtnNext();    
                    if(_.options.arrCallBackAnt[_.stepNum - 1]) 
                        _.options.arrCallBackAnt[_.stepNum - 1]();
                } catch (error) {
                    console.log(error.message);
                }
            });
        }
    }

    function setEstatusBtn(element, text, disabled) {
        if(disabled) {
            document.getElementById(element).setAttribute('disabled', 'disabled');
            document.getElementById(element).innerHTML = text;
        }
        else {
            document.getElementById(element).removeAttribute('disabled');
            document.getElementById(element).innerHTML = text;
        }
    }

    // Utility method to extend defaults with user options
    function extendDefaults(source, properties) {
        var property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }
        return source;
    }

}());