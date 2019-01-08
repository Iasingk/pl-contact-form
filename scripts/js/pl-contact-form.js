/**
 * Created by cesarmejia on 26/09/2017.
 */
var pl;
(function (pl) {
    var Key;
    (function (Key) {
        Key[Key["ALT"] = 18] = "ALT";
        Key[Key["CAPS_LOCK"] = 20] = "CAPS_LOCK";
        Key[Key["CTRL"] = 17] = "CTRL";
        Key[Key["DOWN_ARROW"] = 40] = "DOWN_ARROW";
        Key[Key["LEFT_ARROW"] = 37] = "LEFT_ARROW";
        Key[Key["RIGHT_ARROW"] = 39] = "RIGHT_ARROW";
        Key[Key["SELECT"] = 93] = "SELECT";
        Key[Key["SHIFT"] = 16] = "SHIFT";
        Key[Key["UP_ARROW"] = 38] = "UP_ARROW";
        Key[Key["TAB"] = 9] = "TAB";
    })(Key = pl.Key || (pl.Key = {}));
})(pl || (pl = {}));
/**
 * Created by cesarmejia on 20/08/2017.
 */
(function (pl) {
    var PLEvent = /** @class */ (function () {
        // endregion
        /**
         * Create a PLEvent instance.
         * @constructor
         */
        function PLEvent() {
            this._handlers = [];
            this._scope = this || window;
        }
        // region Methods
        /**
         * Add new handler.
         * @param {function} handler
         */
        PLEvent.prototype.add = function (handler) {
            if (handler) {
                this._handlers.push(handler);
            }
        };
        /**
         * Excecute all suscribed handlers.
         */
        PLEvent.prototype.fire = function () {
            var _this = this;
            var args = arguments;
            this._handlers.forEach(function (handler) {
                handler.apply(_this._scope, args);
            });
        };
        /**
         * Remove handler from handlers.
         * @param {function} handler
         */
        PLEvent.prototype.remove = function (handler) {
            this._handlers = this._handlers.filter(function (fn) {
                if (fn != handler)
                    return fn;
            });
        };
        return PLEvent;
    }());
    pl.PLEvent = PLEvent;
})(pl || (pl = {}));
/**
 * Created by cesarmejia on 07/02/2018.
 */
(function (pl) {
    var Classie = /** @class */ (function () {
        function Classie() {
        }
        /**
         * Adds the specified class to an element.
         * @param {HTMLElement} elem
         * @param {string} className
         */
        Classie.addClass = function (elem, className) {
            if (elem.classList)
                elem.classList.add(className);
            else if (!Classie.hasClass(elem, className))
                elem.className += " " + className;
        };
        /**
         * Determine whether any of the matched elements are assigned the given class.
         * @param {HTMLElement} elem
         * @param {string} className
         * @returns {boolean}
         */
        Classie.hasClass = function (elem, className) {
            return elem.classList
                ? elem.classList.contains(className)
                : new RegExp("\\b" + className + "\\b").test(elem.className);
        };
        /**
         * Remove class from element.
         * @param {HTMLElement} elem
         * @param {string} className
         */
        Classie.removeClass = function (elem, className) {
            if (elem.classList)
                elem.classList.remove(className);
            else
                elem.className = elem.className.replace(new RegExp("\\b" + className + "\\b", "g"), '');
        };
        /**
         * Remove all classes in element.
         * @param {HTMLElement} elem
         */
        Classie.reset = function (elem) {
            elem.className = '';
        };
        /**
         * Add or remove class from element.
         * @param {HTMLElement} elem
         * @param {string} className
         */
        Classie.toggleClass = function (elem, className) {
            if (elem.classList)
                elem.classList.toggle(className);
            else
                Classie.hasClass(elem, className)
                    ? Classie.removeClass(elem, className)
                    : Classie.addClass(elem, className);
        };
        return Classie;
    }());
    pl.Classie = Classie;
})(pl || (pl = {}));
/**
 * Created by cesarmejia on 29/08/2017.
 */
/**
 * Created by Sexar on 07/02/2018.
 */
(function (pl) {
    var Util = /** @class */ (function () {
        function Util() {
        }
        /**
         * Capitalize text.
         * @param {string} text
         * @returns {string}
         */
        Util.capitalizeText = function (text) {
            return text.replace(/\w/, function (l) { return l.toUpperCase(); });
        };
        /**
         * Merge objects and create a new one.
         * @param {Array<Object>} objects
         * @return {Object}
         */
        Util.extendsDefaults = function () {
            var objects = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                objects[_i] = arguments[_i];
            }
            var result = {}, i;
            for (i = 0; i < objects.length; i++) {
                (function (currentObj) {
                    var prop;
                    for (prop in currentObj) {
                        if (currentObj.hasOwnProperty(prop)) {
                            result[prop] = currentObj[prop];
                        }
                    }
                })(objects[i]);
            }
            return result;
        };
        return Util;
    }());
    pl.Util = Util;
})(pl || (pl = {}));
/**
 * Created by cesarmejia on 20/08/2017.
 * https://validatejs.org/#validators-datetime
 */
(function (pl) {
    var Validator = /** @class */ (function () {
        function Validator() {
        }
        /**
         * Validate if value has an specific length.
         * @param {any} value
         * @param {any} length
         */
        Validator.count = function (value, length) {
            var string = Validator.toString(value);
            if (string === "undefined"
                || string === "null"
                || string === "NaN"
                || string === "Infinity")
                return false;
            return string.length === length;
        };
        /**
         * Validate if value is a valid credit card number.
         * @param {string} value
         * @returns {boolean}
         */
        Validator.creditCardNumber = function (value) {
            if (!Validator.isString(value))
                return false;
            return /^(\d{4}-?){3}\d{4}$/.test(value);
        };
        /**
         * Validate if value is a valid date "dd/mm/yyyy".
         * @param {string} value
         * @returns {boolean}
         */
        Validator.date = function (value) {
            if (!Validator.isString(value))
                return false;
            // First check for the pattern
            if (!/^\d{1,2}\/|-\d{1,2}\/|-\d{4}$/.test(value))
                return false;
            // Parse the date parts to integers
            var parts = value.split(/\/|-/);
            var day = parseInt(parts[0], 10);
            var month = parseInt(parts[1], 10);
            var year = parseInt(parts[2], 10);
            // Check the ranges of month and year
            if (year < 1000 || year > 3000 || month == 0 || month > 12)
                return false;
            var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            // Adjust for leap years
            if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
                monthLength[1] = 29;
            // Check the range of the day
            return day > 0 && day <= monthLength[month - 1];
        };
        /**
         * Validate if value is a valid datetime.
         * @param {string} value
         * @returns {boolean}
         */
        Validator.datetime = function (value) {
            throw 'Not implemented yet';
        };
        /**
         * Validate if value is a valid email.
         * @param {string} value
         * @returns {boolean}
         */
        Validator.email = function (value) {
            if (!Validator.isString(value))
                return false;
            return /[\w-\.]{3,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/.test(value);
        };
        /**
         * Validate if two values are equal.
         * @param {string} value
         * @param {string} confirm
         * @returns {boolean}
         */
        Validator.equality = function (value, confirm) {
            if (!Validator.isString(value) && !Validator.isString(confirm))
                return false;
            return value === confirm;
        };
        /**
         * Validate if value is a valid hash.
         * @param {string} value
         * @returns {boolean}
         */
        Validator.hash = function (value) {
            if (!Validator.isString(value))
                return false;
            return /^#\w*/.test(value);
        };
        /**
         * Validate if value is not empty.
         * @param {string} value
         * @returns {boolean}
         */
        Validator.notEmpty = function (value) {
            if (!Validator.isString(value))
                return false;
            return !!value.length;
        };
        /**
         * Validate if value is a valid phone number.
         * @param {string} value
         * @returns {boolean}
         */
        Validator.phone = function (value) {
            if (!Validator.isString(value))
                return false;
            return value.replace(/[^\d]/g, '').length === 10;
        };
        /**
         * Validate the length of a string in a range.
         * @param {string} value
         * @param {any} min
         * @param {any} max
         * @returns {boolean}
         */
        Validator.range = function (value, min, max) {
            var string = Validator.toString(value);
            if (string === "undefined"
                || string === "null"
                || string === "NaN"
                || string === "Infinity")
                return false;
            min = Validator.toInteger(min);
            max = Validator.toInteger(max);
            if ("number" === typeof max && !isNaN(max)) {
                return string.length >= min && string.length <= max;
            }
            else {
                return string.length >= min;
            }
        };
        /**
         * Validate if value is a valid url.
         * @param {string} value
         * @returns {boolean}
         */
        Validator.url = function (value) {
            if (!Validator.isString(value))
                return false;
            return /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(value);
        };
        /**
         * Validate if value is an array.
         * @param {any} value
         * @returns {boolean}
         */
        Validator.isArray = function (value) {
            return value instanceof Array;
        };
        /**
         * Validate if value is boolean.
         * @param {any} value
         * @returns {boolean}
         */
        Validator.isBoolean = function (value) {
            return "boolean" === typeof value;
        };
        /**
         * Validate if value is number.
         * @param {any} value
         * @returns {boolean}
         */
        Validator.isNumber = function (value) {
            return "number" === typeof value;
        };
        /**
         * Validate if value is string.
         * @param value
         * @returns {boolean}
         */
        Validator.isString = function (value) {
            return "string" === typeof value;
        };
        /**
         * Parse given value to float.
         * @param {string} value
         * @returns {number}
         */
        Validator.toFloat = function (value) {
            return parseFloat(value);
        };
        /**
         * Parse given value to integer.
         * @param {string} value
         * @returns {number}
         */
        Validator.toInteger = function (value) {
            return parseInt(value);
        };
        /**
         * Parse given value to string.
         * @param {any} value
         * @returns {string}
         */
        Validator.toString = function (value) {
            return String(value);
        };
        return Validator;
    }());
    pl.Validator = Validator;
})(pl || (pl = {}));
/**
 * Created by cesarmejia on 20/08/2017.
 */
(function (pl) {
    var ContactForm = /** @class */ (function () {
        // endregion
        /**
         * Create a contact form instance.
         * @param {HTMLElement} element
         * @param {object} settings
         */
        function ContactForm(element, settings) {
            if (settings === void 0) { settings = {}; }
            /**
             * Determine if window could close or not.
             * @type {boolean}
             */
            this._letCloseWindow = true;
            /**
             * Object that will be used to make requests.
             * @type {XMLHttpRequest}
             */
            this._req = new XMLHttpRequest();
            /**
             * Contains info for contact form.
             * @type {object}
             */
            this._settings = {};
            if (!(element instanceof HTMLElement))
                throw 'Template is not an HTMLFormElement';
            var defaults = {
                url: 'process-ajax.php',
                useAjax: true,
                inputSelectors: [
                    "input[type=text]",
                    "select",
                    "textarea"
                ]
            };
            this._element = element;
            this._settings = pl.Util.extendsDefaults(defaults, settings);
            this.initializeEvents();
        }
        // region Private Methods
        /**
         * Make an ajax request with contact form data.
         * @param {object} data
         */
        ContactForm.prototype.ajaxRequest = function (data) {
            var async = true;
            var method = 'POST';
            var settings = this._settings;
            var dataString = "data=" + JSON.stringify(data);
            this.onSending();
            this._req.open(method, settings['url'], async);
            this._req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            this._req.send(dataString);
        };
        /**
         * Shows message while contact form is working
         * and avoid user closes the window.
         */
        ContactForm.prototype.beforeUnload = function () {
            if (!this._letCloseWindow) {
                return 'Sending message';
            }
        };
        /**
         * Disable or enable form.
         */
        ContactForm.prototype.disableForm = function () {
            var _this = this;
            if (this._disabled)
                pl.Classie.addClass(this.element, 'disabled');
            else
                pl.Classie.removeClass(this.element, 'disabled');
            [].forEach.call(this.inputs, function (input) {
                input.disabled = _this._disabled;
            });
        };
        /**
         * Get input container if have it.
         * @param {HTMLElement} input
         * @param {boolean} isText
         * @returns {HTMLElement|null}
         */
        ContactForm.prototype.getInputContainer = function (input, isText) {
            var container = null, parent = input;
            while (parent = parent.parentNode) {
                if (parent instanceof HTMLElement) {
                    if (isText && pl.Classie.hasClass(parent, 'input-container')) {
                        break;
                    }
                    if (!isText && (pl.Classie.hasClass(parent, 'input-group') || 'fieldset' === parent.tagName.toLowerCase())) {
                        break;
                    }
                }
            }
            return parent;
        };
        /**
         * Handle input change event.
         * @param {Event} ev
         */
        ContactForm.prototype.handleChange = function (ev) {
            // Do nothing if key is invalid.
            if (this.isInvalidKey(ev.which || ev.keyCode || 0))
                return;
            // Retrieve input and some attrs.
            var input = ev.target;
            // Validate input.
            var valid = this.validate(input);
            // Notify that input changed.
            this.onInputChange(input, valid);
        };
        /**
         * Handles state changes of request.
         * @param {Event} ev
         */
        ContactForm.prototype.handleReadyStateChange = function (ev) {
            var DONE = 4; // readyState 4 means the request is done.
            var OK = 200; // status 200 is a successful return.
            if (this._req.readyState === DONE) {
                if (this._req.status === OK) {
                    this.onSuccess(this._req.responseText, this._req.status, this._req.statusText);
                }
                else {
                    this.onError(this._req.status, this._req.statusText);
                }
            }
        };
        /**
         * Attach handlers to contact form elements.
         */
        ContactForm.prototype.initializeEvents = function () {
            var _this = this;
            this.beforeUnload = this.beforeUnload.bind(this);
            this.handleChange = this.handleChange.bind(this);
            this.submit = this.submit.bind(this);
            this.handleReadyStateChange = this.handleReadyStateChange.bind(this);
            // Attach handleChange handler to each input in form.
            [].forEach.call(this.inputs, function (input) {
                if (input.type === 'text' || input.tagName.toLowerCase() === 'textarea')
                    input.addEventListener('keyup', _this.handleChange, false);
                input.addEventListener('change', _this.handleChange, false);
            });
            // Attach on submit handler to form.
            this.element.addEventListener('submit', this.submit, false);
            // Attach onbeforeunload handler.
            window.onbeforeunload = this.beforeUnload;
            // Attach handler to state change of request.
            this._req.onreadystatechange = this.handleReadyStateChange;
        };
        /**
         * Return if code is an invalid key.
         * @param {number} code
         */
        ContactForm.prototype.isInvalidKey = function (code) {
            var i, invalidKeys = [
                pl.Key.ALT,
                pl.Key.CAPS_LOCK,
                pl.Key.CTRL,
                pl.Key.DOWN_ARROW,
                pl.Key.LEFT_ARROW,
                pl.Key.RIGHT_ARROW,
                pl.Key.SELECT,
                pl.Key.SHIFT,
                pl.Key.UP_ARROW,
                pl.Key.TAB
            ];
            for (i = 0; i < invalidKeys.length; i++) {
                if (invalidKeys[i] === code)
                    return true;
            }
            return false;
        };
        /**
         * Validate input checkbox.
         * @param {HTMLInputElement} input
         * @returns {boolean}
         */
        ContactForm.prototype.isCheckboxValid = function (input) {
            var name = input.name;
            var group = this.checkboxes[name];
            var valid = false;
            group.forEach(function (item) { if (item.checked) {
                valid = true;
            } });
            return valid;
        };
        /**
         * Validate input radio.
         * @param {HTMLInputElement} input
         * @returns {boolean}
         */
        ContactForm.prototype.isRadioValid = function (input) {
            var name = input.name;
            var group = this.radios[name];
            var valid = false;
            group.forEach(function (item) { if (item.checked) {
                valid = true;
            } });
            return valid;
        };
        /**
         * Validate input text value.
         * @param {HTMLInputElement} input
         * @returns {boolean}
         */
        ContactForm.prototype.isTextValid = function (input) {
            if ("string" === typeof input.dataset['validate']) {
                // Validation rules could be in this form "notEmpty|count:3|range:5,10"
                var rules = input.dataset['validate'].split('|'), name_1 = input.name, value = input.value, valid = false;
                var _loop_1 = function (i) {
                    var rule = rules[i], args, array = [];
                    // Value that will be valued need to be the first argument
                    // to Validator methods.
                    array.push(value);
                    try {
                        if (rules[i].indexOf(":") > -1) {
                            rule = rules[i].slice(0, rules[i].indexOf(":"));
                            args = rules[i].slice(rules[i].indexOf(":") + 1);
                            // When the rule is equality we must find the element with which
                            // we're going to do the comparison.
                            if (rule === "equality") {
                                var filter = this_1.texts.filter(function (e) { return e.name === args; });
                                array.push(filter[0].value);
                            }
                            else {
                                array = array.concat(args.split(','));
                            }
                        }
                        // Validate!!
                        valid = pl.Validator[rule].apply(this_1, array);
                    }
                    catch (e) {
                        "console" in window
                            && console.log("Unknown \"%s\" validation in \"%s\" input", rule, name_1);
                    }
                    // All rules must be true, if one fails break the loop.
                    if (!valid) {
                        return "break";
                    }
                };
                var this_1 = this;
                for (var i = 0; i < rules.length; i++) {
                    var state_1 = _loop_1(i);
                    if (state_1 === "break")
                        break;
                }
                return valid;
            }
            return true;
        };
        /**
         * Add or remove error from input
         * @param {HTMLElement} input
         * @param {boolean} isValid
         */
        ContactForm.prototype.toggleInputError = function (input, isValid) {
            var type = input['type'];
            // If input has an error get it.
            var clueElem = input['clue-elem'];
            var clueText = "";
            // Points to parent node.
            var isText = ("checkbox" !== type && "radio" !== type);
            var inputContainer = this.getInputContainer(input, isText);
            // Toggle error of the input.
            if (isValid) {
                if (clueElem) {
                    // Disappears and remove error element from DOM.
                    clueElem.parentNode.removeChild(clueElem);
                    // Set as null clue elem.
                    input['clue-elem'] = null;
                }
                // Remove invalid class.
                pl.Classie.removeClass(input, 'invalid');
                // Unmark as invalid input parent if has class ".input-container"
                inputContainer && pl.Classie.removeClass(inputContainer, 'invalid');
            }
            else {
                if (!clueElem) {
                    // Retrieve input clue.
                    clueText = input.dataset['clue'] || 'Invalid';
                    // Create clue element.
                    clueElem = document.createElement('span');
                    clueElem.innerText = clueText;
                    pl.Classie.addClass(clueElem, 'input-clue');
                    // Store clue element in input.
                    input['clue-elem'] = clueElem;
                    // Insert before.
                    input.parentNode.insertBefore(clueElem, input);
                }
                // Set invalid class.
                pl.Classie.addClass(input, 'invalid');
                // Mark as invalid input parent if has class ".input-container"
                inputContainer && pl.Classie.addClass(inputContainer, 'invalid');
            }
        };
        /**
         * Validate input.
         * @param {HTMLInputElement} input
         * @returns {boolean}
         */
        ContactForm.prototype.validate = function (input) {
            var _this = this;
            var type = input.type;
            var name = input.name;
            var valid;
            // Get validity of "checkbox" and toggle his error.
            if ("checkbox" === type) {
                valid = this.isCheckboxValid(input);
                this.checkboxes[name].forEach(function (checkbox) { _this.toggleInputError(checkbox, valid); });
            }
            // Get validity of "radio" and toggle his error.
            else if ("radio" === type) {
                valid = this.isRadioValid(input);
                this.radios[name].forEach(function (radio) { _this.toggleInputError(radio, valid); });
            }
            // Get validity of "text" and toggle his error.
            else {
                valid = this.isTextValid(input);
                this.toggleInputError(input, valid);
            }
            if (!valid) {
                this.onInputError(input);
            }
            return valid;
        };
        // endregion
        // region Methods
        /**
         * Gets all values of inputs in JSON format.
         * @returns {object}
         */
        ContactForm.prototype.getFormValues = function () {
            var data = {}, name, type;
            [].forEach.call(this.inputs, function (input) {
                name = input.name;
                type = input.type;
                // Checkboxes
                if ("checkbox" === type && input.checked) {
                    if ("string" === typeof data[name]) {
                        data[name] += ", " + input.value;
                    }
                    else {
                        data[name] = input.value;
                    }
                }
                // Radios
                if ("radio" === type && input.checked) {
                    data[name] = input.value;
                }
                // Texts
                if ("text" === type || "hidden" === type || "textarea" === input.tagName.toLowerCase()) {
                    data[name] = input.value;
                }
            });
            return data;
        };
        /**
         * Validates all inputs in the form.
         * @returns {boolean}
         */
        ContactForm.prototype.isFormValid = function () {
            var _this = this;
            var valid = true;
            var prop, input;
            // Check validity of checkboxes.
            for (prop in this.checkboxes) {
                // Check first element of a group.
                input = this.checkboxes[prop][0];
                if (!this.validate(input)) {
                    valid = false;
                }
            }
            // Check validity of radios.
            for (prop in this.radios) {
                // Check first element of a group.
                input = this.radios[prop][0];
                if (!this.validate(input)) {
                    valid = false;
                }
            }
            // Check validity of texts and textarea.
            this.texts.forEach(function (input) { if (!_this.validate(input)) {
                valid = false;
            } });
            return valid;
        };
        /**
         * Reset form inputs.
         */
        ContactForm.prototype.reset = function () {
            this.element.reset();
        };
        /**
         * Handle submit event.
         * @param {Event} ev
         */
        ContactForm.prototype.submit = function (ev) {
            // Validate form.
            if (this.isFormValid()) {
                // If we're using ajax make other validations. Else let the flow keeps going.
                if (this._settings['useAjax']) {
                    // If form is disabled, it's possible that contact form is sending a request.
                    if (this._disabled)
                        return;
                    // Maybe submit is called manually and there is no ev.
                    ev && ev.preventDefault();
                    var data = {
                        host: location.hostname,
                        data: this.getFormValues()
                    };
                    this.ajaxRequest(data);
                }
            }
            else {
                // Maybe submit is called manually and there is no ev.
                ev && ev.preventDefault();
            }
        };
        // endregion
        // region Events
        /**
         * Fires when contact form request has an error.
         * @param {number} status
         * @param {string} statusText
         */
        ContactForm.prototype.onError = function (status, statusText) {
            if (this._error) {
                this._error.fire(status, statusText);
            }
            this.disabled = false;
            this._letCloseWindow = true;
        };
        /**
         * Fires when an input changes its value.
         * @param {HTMLElement} input
         * @param {boolean} valid
         */
        ContactForm.prototype.onInputChange = function (input, valid) {
            if (this._inputChange) {
                this._inputChange.fire(input, valid);
            }
        };
        /**
         * Fires when an input has an error.
         * @param {HTMLInputElement} input
         */
        ContactForm.prototype.onInputError = function (input) {
            if (this._inputError) {
                this._inputError.fire(input);
            }
        };
        /**
         * Fires when contact form is sending.
         */
        ContactForm.prototype.onSending = function () {
            if (this._sending) {
                this._sending.fire();
            }
            this.disabled = true;
            this._letCloseWindow = false;
        };
        /**
         * Fires when contact form request was success.
         * @param {string} response
         * @param {number} status
         * @param {string} statusText
         */
        ContactForm.prototype.onSuccess = function (response, status, statusText) {
            if (this._success) {
                this._success.fire(response, status, statusText);
            }
            this.disabled = false;
            this._letCloseWindow = true;
            // Specific line to Goplek.
            var data = parseInt(response);
            if (!isNaN(data) && data === 1) {
                this.reset();
            }
        };
        Object.defineProperty(ContactForm.prototype, "error", {
            /**
             * Get error event.
             * @returns {pl.PLEvent}
             */
            get: function () {
                if (!this._error) {
                    this._error = new pl.PLEvent();
                }
                return this._error;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ContactForm.prototype, "inputError", {
            /**
             * Get input error event.
             * @returns {pl.PLEvent}
             */
            get: function () {
                if (!this._inputError) {
                    this._inputError = new pl.PLEvent();
                }
                return this._inputError;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ContactForm.prototype, "inputChange", {
            /**
             * Get input change event.
             * @returns {pl.PLEvent}
             */
            get: function () {
                if (!this._inputChange) {
                    this._inputChange = new pl.PLEvent();
                }
                return this._inputChange;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ContactForm.prototype, "sending", {
            /**
             * Get sending event
             * @returns {pl.PLEvent}
             */
            get: function () {
                if (!this._sending) {
                    this._sending = new pl.PLEvent();
                }
                return this._sending;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ContactForm.prototype, "success", {
            /**
             * Get success event.
             * @returns {pl.PLEvent}
             */
            get: function () {
                if (!this._success) {
                    this._success = new pl.PLEvent();
                }
                return this._success;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ContactForm.prototype, "disabled", {
            /**
             * Get disable mode.
             * @returns {boolean}
             */
            get: function () {
                return this._disabled;
            },
            /**
             * Set disable mode.
             * @param {boolean} disabled
             */
            set: function (disabled) {
                if (disabled !== this._disabled) {
                    this._disabled = disabled;
                    this.disableForm();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ContactForm.prototype, "element", {
            /**
             * Get form element.
             * @returns {HTMLFormElement}
             */
            get: function () {
                return this._element;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ContactForm.prototype, "inputs", {
            /**
             * Get form inputs.
             * @returns {NodeListOf<Element>}
             */
            get: function () {
                if (!this._inputs) {
                    var selectors = this._settings['inputSelectors'];
                    this._inputs = this._element.querySelectorAll(selectors.join(","));
                }
                return this._inputs;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ContactForm.prototype, "checkboxes", {
            /**
             * Get checkboxes.
             * @returns {Object}
             */
            get: function () {
                var _this = this;
                if (!this._checkboxes) {
                    this._checkboxes = {};
                    [].forEach.call(this.inputs, function (input) {
                        if ("checkbox" === input.type) {
                            if (!_this._checkboxes.hasOwnProperty(input.name)) {
                                _this._checkboxes[input.name] = [];
                            }
                            _this._checkboxes[input.name].push(input);
                        }
                    });
                }
                return this._checkboxes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ContactForm.prototype, "radios", {
            /**
             * Get radios.
             * @returns {Object}
             */
            get: function () {
                var _this = this;
                if (!this._radios) {
                    this._radios = {};
                    [].forEach.call(this.inputs, function (input) {
                        if ("radio" === input.type) {
                            if (!_this._radios.hasOwnProperty(input.name)) {
                                _this._radios[input.name] = [];
                            }
                            _this._radios[input.name].push(input);
                        }
                    });
                }
                return this._radios;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ContactForm.prototype, "texts", {
            /**
             * Get texts.
             * @returns {Object}
             */
            get: function () {
                var _this = this;
                if (!this._texts) {
                    this._texts = [];
                    [].forEach.call(this.inputs, function (input) {
                        if ("text" === input.type || "hidden" === input.type || "textarea" === input.tagName.toLowerCase()) {
                            _this._texts.push(input);
                        }
                    });
                }
                return this._texts;
            },
            enumerable: true,
            configurable: true
        });
        return ContactForm;
    }());
    pl.ContactForm = ContactForm;
})(pl || (pl = {}));
