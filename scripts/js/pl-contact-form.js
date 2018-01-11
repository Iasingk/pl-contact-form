/**
 * Created by cesarmejia on 20/08/2017.
 */
var pl;
(function (pl) {
    var ContactForm = /** @class */ (function () {
        // endregion
        /**
         * Create a contact form instance.
         * @param {HTMLElement} form
         * @param {object} settings
         */
        function ContactForm(form, settings) {
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
            this._req = new XMLHttpRequest;
            /**
             * Contains info for contact form.
             * @type {object}
             */
            this._settings = {};
            if (!(form instanceof HTMLElement))
                throw 'Template is not an HTMLFormElement';
            var defaults = {
                url: 'process-ajax.php',
                useAjax: true
            };
            this._form = form;
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
         * Handle input change event.
         * @param {Event} ev
         */
        ContactForm.prototype.changed = function (ev) {
            var code = ev.which || ev.keyCode || 0;
            console.log('changed...');
            // Do nothing if key is invalid.
            if (this.isInvalidKey(code))
                return;
            // Retrieve input and some attrs.
            var input = ev.target;
            // Show or hide error.
            this.toggleInputError(input);
        };
        /**
         * Disable or enable form.
         */
        ContactForm.prototype.disableForm = function () {
            var _this = this;
            if (this._disabled)
                pl.Util.addClass(this.form, 'disabled');
            else
                pl.Util.removeClass(this.form, 'disabled');
            [].forEach.call(this.inputs, function (input) {
                input.disabled = _this._disabled;
            });
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
            this.changed = this.changed.bind(this);
            this.submit = this.submit.bind(this);
            this.handleReadyStateChange = this.handleReadyStateChange.bind(this);
            // Attach changed handler to each input in form.
            [].forEach.call(this.inputs, function (input) {
                if (input.type === 'text' || input.tagName.toLowerCase() === 'textarea')
                    input.addEventListener('keyup', _this.changed, false);
                input.addEventListener('change', _this.changed, false);
            });
            // Attach on submit handler to form.
            this.form.addEventListener('submit', this.submit, false);
            // Attach onbeforeunload handler.
            window.onbeforeunload = this.beforeUnload;
            // Attach handler to state change of request.
            this._req.onreadystatechange = this.handleReadyStateChange;
        };
        /**
         * Check validity of an input.
         * @param {HTMLInputElement} input
         * @returns {boolean} validity
         */
        ContactForm.prototype.isInputValid = function (input) {
            if ("string" === typeof input.dataset['validate']) {
                // Validation rules could be in this form "notEmpty|count:3"
                var rules = input.dataset['validate'].split('|'), name_1 = input.name, value = input.value, type = input.type, valid = false;
                // region Validate checkbox input.
                if (type === "checkbox") {
                }
                else if (type === "radio") {
                }
                else {
                    for (var i = 0; i < rules.length; i++) {
                        var rule = rules[i], args = void 0, array = void 0;
                        try {
                            if (rules[i].indexOf(":") > -1) {
                                rule = rules[i].slice(0, rules[i].indexOf(":"));
                                args = rules[i].slice(rules[i].indexOf(":") + 1);
                                array = args.split(',');
                                array.unshift(value);
                            }
                            else {
                                array = [value];
                            }
                            // Validate!!
                            valid = pl.Validator[rule].apply(this, array);
                        }
                        catch (e) {
                            "console" in window
                                && console.log("Unknown \"%s\" validation in \"%s\" input", rule, name_1);
                        }
                        if (!valid) {
                            break;
                        }
                    }
                }
                // endregion
                return valid;
            }
            return true;
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
         * Add or remove error from input
         * @param {HTMLElement} input
         */
        ContactForm.prototype.toggleInputError = function (input) {
            var type = input['type'];
            // Points to parent node.
            var inputParent = input.parentNode;
            var hasInputContainer = pl.Util.hasClass(inputParent, 'input-container');
            // If input has an error get it.
            var clueElem = input['clue-elem'];
            var clueText = "";
            if (this.isInputValid(input)) {
                if (clueElem) {
                    // Disappears and remove error element from DOM.
                    clueElem.parentNode.removeChild(clueElem);
                    // Set as null clue elem.
                    input['clue-elem'] = null;
                }
                // Remove invalid class.
                pl.Util.removeClass(input, 'invalid');
                // Unmark as invalid input parent if has class ".input-container"
                hasInputContainer && pl.Util.removeClass(inputParent, 'invalid');
            }
            else {
                if (!clueElem) {
                    // Retrieve input clue.
                    clueText = input.dataset['clue'] || 'Inválido';
                    // Create clue element.
                    clueElem = document.createElement('span');
                    clueElem.innerText = clueText;
                    pl.Util.addClass(clueElem, 'input-clue');
                    // Store clue element in input.
                    input['clue-elem'] = clueElem;
                    pl.Util.insertBefore(clueElem, input);
                    // Notify that an input has a error.
                    this.onInputError(input, clueText);
                }
                // Set invalid class.
                pl.Util.addClass(input, 'invalid');
                // Mark as invalid input parent if has class ".input-container"
                hasInputContainer && pl.Util.addClass(inputParent, 'invalid');
            }
        };
        // endregion
        // region Methods
        /**
         * Gets all values of inputs in JSON format.
         * @returns {object}
         */
        ContactForm.prototype.getFormValues = function () {
            var data = {};
            [].forEach.call(this.inputs, function (input) {
                data[input.name] = input.value;
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
            [].forEach.call(this.inputs, function (input) {
                _this.toggleInputError(input);
                if (!_this.isInputValid(input)) {
                    valid = false;
                }
            });
            return valid;
        };
        /**
         * Reset form inputs.
         */
        ContactForm.prototype.reset = function () {
            this.form.reset();
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
         * Fires when an input has an error.
         * @param {HTMLInputElement} input
         * @param {string} clueText
         */
        ContactForm.prototype.onInputError = function (input, clueText) {
            if (this._inputError) {
                this._inputError.fire(input, clueText);
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
            parseInt(response) === 1 && this.reset();
        };
        Object.defineProperty(ContactForm.prototype, "error", {
            /**
             * Get error event.
             * @returns {pl.Event}
             */
            get: function () {
                if (!this._error) {
                    this._error = new pl.Event();
                }
                return this._error;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ContactForm.prototype, "inputError", {
            /**
             * Get input error event.
             * @returns {pl.Event}
             */
            get: function () {
                if (!this._inputError) {
                    this._inputError = new pl.Event();
                }
                return this._inputError;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ContactForm.prototype, "sending", {
            /**
             * Get sending event
             * @returns {pl.Event}
             */
            get: function () {
                if (!this._sending) {
                    this._sending = new pl.Event();
                }
                return this._sending;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ContactForm.prototype, "success", {
            /**
             * Get success event.
             * @returns {pl.Event}
             */
            get: function () {
                if (!this._success) {
                    this._success = new pl.Event();
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
        Object.defineProperty(ContactForm.prototype, "form", {
            /**
             * Get form element.
             * @returns {HTMLFormElement}
             */
            get: function () {
                return this._form;
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
                    var validInputs = [
                        "input[type=text]",
                        "input[type=checkbox]",
                        "input[type=radio]",
                        "select",
                        "textarea"
                    ];
                    this._inputs = this._form.querySelectorAll(validInputs.join(","));
                }
                return this._inputs;
            },
            enumerable: true,
            configurable: true
        });
        return ContactForm;
    }());
    pl.ContactForm = ContactForm;
})(pl || (pl = {}));
(function (pl) {
    var Event = /** @class */ (function () {
        /**
         * Create a Event instance.
         * @constructor
         */
        function Event() {
            this._handlers = [];
            this._scope = this || window;
        }
        /**
         * Add new handler.
         * @param {function} handler
         */
        Event.prototype.add = function (handler) {
            if (handler) {
                this._handlers.push(handler);
            }
        };
        /**
         * Excecute all suscribed handlers.
         */
        Event.prototype.fire = function () {
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
        Event.prototype.remove = function (handler) {
            this._handlers = this._handlers.filter(function (fn) {
                if (fn != handler)
                    return fn;
            });
        };
        return Event;
    }());
    pl.Event = Event;
})(pl || (pl = {}));
/**
 * Created by cesarmejia on 26/09/2017.
 */
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
 * Created by cesarmejia on 29/08/2017.
 */
(function (pl) {
    var Util = /** @class */ (function () {
        function Util() {
        }
        /**
         * Determine whether any of the matched elements are assigned the given class.
         * @param {HTMLElement} elem
         * @param {string} className
         * @returns {boolean}
         */
        Util.hasClass = function (elem, className) {
            return elem.classList
                ? elem.classList.contains(className)
                : new RegExp("\\b" + className + "\\b").test(elem.className);
        };
        /**
         * Adds the specified class to an element.
         * @param {HTMLElement} elem
         * @param {string} className
         */
        Util.addClass = function (elem, className) {
            if (elem.classList)
                elem.classList.add(className);
            else if (!Util.hasClass(elem, className))
                elem.className += " " + className;
        };
        /**
         * Remove class from element.
         * @param {HTMLElement} elem
         * @param {string} className
         */
        Util.removeClass = function (elem, className) {
            if (elem.classList)
                elem.classList.remove(className);
            else
                elem.className = elem.className.replace(new RegExp("\\b" + className + "\\b", "g"), '');
        };
        /**
         * Insert an HTML structure before a given DOM tree element.
         * @param {HTMLElement} elem
         * @param {HTMLElement} refElem
         */
        Util.insertBefore = function (elem, refElem) {
            refElem.parentNode.insertBefore(elem, refElem);
        };
        /**
         * Insert an HTML structure after a given DOM tree element.
         * @param {HTMLElement} elem
         * @param {HTMLElement} refElem
         */
        Util.insertAfter = function (elem, refElem) {
            refElem.parentNode.insertBefore(elem, refElem.nextSibling);
        };
        /**
         * Utility method to extend defaults with user settings
         * @param {object} source
         * @param {object} settings
         * @return {object}
         */
        Util.extendsDefaults = function (source, settings) {
            var property;
            for (property in settings) {
                if (settings.hasOwnProperty(property))
                    source[property] = settings[property];
            }
            return source;
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
            if (!Validator.isString(value)) { }
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
