/**
 * Created by cesarmejia on 20/08/2017.
 */
module pl {

    export class ContactForm {

        // region Fields

        /**
         * Disable mode.
         * @type {boolean}
         */
        private _disabled: boolean;

        /**
         * Determine if window could close or not.
         * @type {boolean}
         */
        private _letCloseWindow: boolean = true;

        /**
         * Object that will be used to make requests.
         * @type {XMLHttpRequest}
         */
        private _req: XMLHttpRequest = new XMLHttpRequest();

        /**
         * Contains info for contact form.
         * @type {object}
         */
        private _settings: Object = {};

        // endregion

        /**
         * Create a contact form instance.
         * @param {HTMLElement} element
         * @param {object} settings
         */
        constructor(element: HTMLFormElement, settings: Object = {}) {
            if (!(element instanceof HTMLElement))
                throw 'Template is not an HTMLFormElement';

            let defaults = {
                url    : 'process-ajax.php',
                useAjax: true,
                inputSelectors: [
                    "input[type=text]",
                    "select",
                    "textarea"
                ]
            };

            this._element = element;
            this._settings = Util.extendsDefaults(defaults, settings);

            this.initializeEvents();
        }

        // region Private Methods

        /**
         * Make an ajax request with contact form data.
         * @param {object} data
         */
        private ajaxRequest(data) {
            let async = true;
            let method = 'POST';
            let settings = this._settings;
            let dataString = `data=${JSON.stringify(data)}`;

            this.onSending();

            this._req.open(method, settings['url'], async);
            this._req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            this._req.send(dataString);

        }

        /**
         * Shows message while contact form is working
         * and avoid user closes the window.
         */
        private beforeUnload() {
            if (!this._letCloseWindow) {
                return 'Sending message';
            }
        }

        /**
         * Disable or enable form.
         */
        private disableForm() {
            if (this._disabled)
                Classie.addClass(this.element, 'disabled');
            else
                Classie.removeClass(this.element, 'disabled');

            [].forEach.call(this.inputs, input => {
                input.disabled = this._disabled;
            });
        }

        /**
         * Get input container if have it.
         * @param {HTMLElement} input
         * @param {boolean} isText
         * @returns {HTMLElement|null}
         */
        private getInputContainer(input: HTMLElement, isText: boolean) {
            let container: HTMLElement = null,
                parent: HTMLElement = input;

            while (parent = <HTMLElement>parent.parentNode) {
                if (parent instanceof HTMLElement) {
                    if (isText && Classie.hasClass(parent, 'input-container')) { break; }
                    if (!isText && (Classie.hasClass(parent, 'input-group') || 'fieldset' === parent.tagName.toLowerCase())) { break; }
                }
            }

            return parent;
        }

        /**
         * Handle input change event.
         * @param {Event} ev
         */
        private handleChange(ev) {
            // Do nothing if key is invalid.
            if (this.isInvalidKey(ev.which || ev.keyCode || 0)) return;

            // Retrieve input and some attrs.
            let input: HTMLInputElement = ev.target;

            // Validate input.
            let valid = this.validate(input);

            // Notify that input changed.
            this.onInputChange(input, valid);
        }

        /**
         * Handles state changes of request.
         * @param {Event} ev
         */
        private handleReadyStateChange(ev) {
            let DONE = 4; // readyState 4 means the request is done.
            let OK   = 200; // status 200 is a successful return.

            if (this._req.readyState === DONE) {
                if (this._req.status === OK) {
                    this.onSuccess(
                        this._req.responseText,
                        this._req.status,
                        this._req.statusText
                    );
                } else {
                    this.onError(
                        this._req.status,
                        this._req.statusText
                    );
                }
            }
        }

        /**
         * Attach handlers to contact form elements.
         */
        private initializeEvents() {
            this.beforeUnload = this.beforeUnload.bind(this);
            this.handleChange = this.handleChange.bind(this);
            this.submit       = this.submit.bind(this);
            this.handleReadyStateChange = this.handleReadyStateChange.bind(this);


            // Attach handleChange handler to each input in form.
            [].forEach.call(this.inputs, (input) => {
                if (input.type === 'text' || input.tagName.toLowerCase() === 'textarea')
                    input.addEventListener('keyup', this.handleChange, false);

                input.addEventListener('change', this.handleChange, false);
            });


            // Attach on submit handler to form.
            this.element.addEventListener('submit', this.submit, false);

            // Attach onbeforeunload handler.
            window.onbeforeunload = this.beforeUnload;

            // Attach handler to state change of request.
            this._req.onreadystatechange = this.handleReadyStateChange;

        }

        /**
         * Return if code is an invalid key.
         * @param {number} code
         */
        private isInvalidKey(code: number) {
            let i, invalidKeys = [
                Key.ALT,
                Key.CAPS_LOCK,
                Key.CTRL,
                Key.DOWN_ARROW,
                Key.LEFT_ARROW,
                Key.RIGHT_ARROW,
                Key.SELECT,
                Key.SHIFT,
                Key.UP_ARROW,
                Key.TAB
            ];

            for (i = 0; i < invalidKeys.length; i++) {
                if (invalidKeys[i] === code)
                    return true;
            }

            return false;
        }

        /**
         * Validate input checkbox.
         * @param {HTMLInputElement} input
         * @returns {boolean}
         */
        private isCheckboxValid(input: HTMLInputElement): boolean {
            let name: string = input.name;
            let group: Array<HTMLInputElement> = this.checkboxes[name];
            let valid: boolean = false;

            group.forEach(item => { if (item.checked) { valid = true; } });

            return valid;
        }

        /**
         * Validate input radio.
         * @param {HTMLInputElement} input
         * @returns {boolean}
         */
        private isRadioValid(input: HTMLInputElement): boolean {
            let name: string = input.name;
            let group: Array<HTMLInputElement> = this.radios[name];
            let valid: boolean = false;

            group.forEach(item => { if (item.checked) { valid = true; } });

            return valid;
        }

        /**
         * Validate input text value.
         * @param {HTMLInputElement} input
         * @returns {boolean}
         */
        private isTextValid(input: HTMLInputElement): boolean {
            if ("string" === typeof input.dataset['validate']) {
                // Validation rules could be in this form "notEmpty|count:3|range:5,10"
                let rules: Array<string> = (<string>input.dataset['validate']).split('|'),
                    name : string  = input.name,
                    value: string  = input.value,
                    valid: boolean = false;

                for (let i = 0; i < rules.length; i++) {
                    let rule: string = rules[i],
                        args: string,
                        array: Array<string> = [];

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
                                let filter = this.texts.filter((e: HTMLInputElement) => e.name === args);
                                array.push(filter[0].value);

                            } else {
                                array = array.concat(args.split(','));

                            }
                        }

                        // Validate!!
                        valid = Validator[rule].apply(this, array);

                    } catch (e) {
                        "console" in window
                        && console.log("Unknown \"%s\" validation in \"%s\" input", rule, name);
                    }

                    // All rules must be true, if one fails break the loop.
                    if (!valid) { break; }
                }

                return valid;
            }

            return true;
        }

        /**
         * Add or remove error from input
         * @param {HTMLElement} input
         * @param {boolean} isValid
         */
        private toggleInputError(input, isValid) {
            let type : String = input['type'];

            // If input has an error get it.
            let clueElem: HTMLElement = input['clue-elem'];
            let clueText: string = "";

            // Points to parent node.
            let isText: boolean = ("checkbox" !== type && "radio" !== type);
            let inputContainer: HTMLElement = this.getInputContainer(input, isText);


            // Toggle error of the input.
            if (isValid) {

                if (clueElem) {
                    // Disappears and remove error element from DOM.
                    clueElem.parentNode.removeChild(clueElem);

                    // Set as null clue elem.
                    input['clue-elem'] = null;
                }

                // Remove invalid class.
                Classie.removeClass(input, 'invalid');

                // Unmark as invalid input parent if has class ".input-container"
                inputContainer && Classie.removeClass(inputContainer, 'invalid');

            } else {

                if (!clueElem) {
                    // Retrieve input clue.
                    clueText = input.dataset['clue'] || 'Invalid';

                    // Create clue element.
                    clueElem = document.createElement('span');
                    clueElem.innerText = clueText;

                    Classie.addClass(clueElem, 'input-clue');

                    // Store clue element in input.
                    input['clue-elem'] = clueElem;

                    // Insert before.
                    input.parentNode.insertBefore(clueElem, input);

                }

                // Set invalid class.
                Classie.addClass(input, 'invalid');

                // Mark as invalid input parent if has class ".input-container"
                inputContainer && Classie.addClass(inputContainer, 'invalid');

            }
        }

        /**
         * Validate input.
         * @param {HTMLInputElement} input
         * @returns {boolean}
         */
        private validate(input: HTMLInputElement): boolean {
            let type: string = input.type;
            let name: string = input.name;
            let valid: boolean;

            // Get validity of "checkbox" and toggle his error.
            if ("checkbox" === type) {
                valid = this.isCheckboxValid(input);
                this.checkboxes[name].forEach(checkbox => { this.toggleInputError(checkbox, valid); });
            }

            // Get validity of "radio" and toggle his error.
            else if ("radio" === type) {
                valid = this.isRadioValid(input);
                this.radios[name].forEach(radio => { this.toggleInputError(radio, valid); });
            }

            // Get validity of "text" and toggle his error.
            else {
                valid = this.isTextValid(input);
                this.toggleInputError(input, valid);
            }

            if (!valid) { this.onInputError(input); }

            return valid;
        }

        // endregion

        // region Methods

        /**
         * Gets all values of inputs in JSON format.
         * @returns {object}
         */
        getFormValues() {
            let data: Object = { },
                name: string,
                type: string;

            [].forEach.call(this.inputs, (input: HTMLInputElement) => {
                name = input.name;
                type = input.type;

                // Checkboxes
                if ("checkbox" === type && input.checked) {
                    if ("string" === typeof data[name]) { data[name] += `, ${ input.value }`; }
                    else { data[name] = input.value; }
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
        }

        /**
         * Validates all inputs in the form.
         * @returns {boolean}
         */
        isFormValid() {
            let valid: boolean = true;
            let prop: string, input: HTMLInputElement;

            // Check validity of checkboxes.
            for (prop in this.checkboxes) {
                // Check first element of a group.
                input = this.checkboxes[prop][0];
                if (!this.validate(input)) { valid = false; }
            }

            // Check validity of radios.
            for (prop in this.radios) {
                // Check first element of a group.
                input = this.radios[prop][0];
                if (!this.validate(input)) { valid = false; }
            }

            // Check validity of texts and textarea.
            this.texts.forEach(input => { if (!this.validate(input)) { valid = false; } });

            return valid;
        }

        /**
         * Reset form inputs.
         */
        reset() {
            this.element.reset();
        }

        /**
         * Handle submit event.
         * @param {Event} ev
         */
        submit(ev) {

            // Validate form.
            if (this.isFormValid()) {

                // If we're using ajax make other validations. Else let the flow keeps going.
                if (this._settings['useAjax']) {

                    // If form is disabled, it's possible that contact form is sending a request.
                    if (this._disabled) return;

                    // Maybe submit is called manually and there is no ev.
                    ev && ev.preventDefault();

                    let data = {
                        host: location.hostname,
                        data: this.getFormValues()
                    };

                    this.ajaxRequest(data);

                }

            } else {
                // Maybe submit is called manually and there is no ev.
                ev && ev.preventDefault();
            }

        }

        // endregion

        // region Events

        /**
         * Fires when contact form request has an error.
         * @param {number} status
         * @param {string} statusText
         */
        private onError(status, statusText) {
            if (this._error) {
                this._error.fire(status, statusText);
            }

            this.disabled = false;
            this._letCloseWindow = true;
        }

        /**
         * Fires when an input changes its value.
         * @param {HTMLElement} input
         * @param {boolean} valid
         */
        private onInputChange(input, valid) {
            if (this._inputChange) {
                this._inputChange.fire(input, valid);
            }
        }

        /**
         * Fires when an input has an error.
         * @param {HTMLInputElement} input
         */
        private onInputError(input) {
            if (this._inputError) {
                this._inputError.fire(input);
            }
        }

        /**
         * Fires when contact form is sending.
         */
        private onSending() {
            if (this._sending) {
                this._sending.fire();
            }

            this.disabled = true;
            this._letCloseWindow = false;
        }

        /**
         * Fires when contact form request was success.
         * @param {string} response
         * @param {number} status
         * @param {string} statusText
         */
        private onSuccess(response, status, statusText) {
            if (this._success) {
                this._success.fire(response, status, statusText);
            }

            this.disabled = false;
            this._letCloseWindow = true;

            // Specific line to Goplek.
            let data = parseInt(response);
            if (!isNaN(data) && data === 1) {
                this.reset()
            }
        }

        // endregion

        // region Properties

        /**
         * Error event.
         * @type {pl.PLEvent}
         */
        private _error: PLEvent;

        /**
         * Get error event.
         * @returns {pl.PLEvent}
         */
        get error() {
            if (!this._error) {
                this._error = new PLEvent();
            }

            return this._error;
        }

        /**
         * Input error event.
         * @type {pl.PLEvent}
         */
        private _inputError: PLEvent;

        /**
         * Get input error event.
         * @returns {pl.PLEvent}
         */
        get inputError() {
            if (!this._inputError) {
                this._inputError = new PLEvent();
            }

            return this._inputError;
        }

        /**
         * Input change event.
         * @type {pl.PLEvent}
         */
        private _inputChange: PLEvent;

        /**
         * Get input change event.
         * @returns {pl.PLEvent}
         */
        get inputChange() {
            if (!this._inputChange) {
                this._inputChange = new PLEvent();
            }

            return this._inputChange;
        }

        /**
         * Sending event.
         * @type {pl.PLEvent}
         */
        private _sending: PLEvent;

        /**
         * Get sending event
         * @returns {pl.PLEvent}
         */
        get sending() {
            if (!this._sending) {
                this._sending = new PLEvent();
            }

            return this._sending;
        }

        /**
         * Success event.
         * @type {pl.PLEvent}
         */
        private _success: PLEvent;

        /**
         * Get success event.
         * @returns {pl.PLEvent}
         */
        get success() {
            if (!this._success) {
                this._success = new PLEvent();
            }

            return this._success;
        }

        /**
         * Get disable mode.
         * @returns {boolean}
         */
        get disabled() {
            return this._disabled;
        }

        /**
         * Set disable mode.
         * @param {boolean} disabled
         */
        set disabled(disabled) {
            if (disabled !== this._disabled) {
                this._disabled = disabled;
                this.disableForm();
            }
        }

        /**
         * Points to form element.
         * @type {HTMLFormElement}
         */
        private _element: HTMLFormElement;

        /**
         * Get form element.
         * @returns {HTMLFormElement}
         */
        get element(): HTMLFormElement {
            return this._element;
        }

        /**
         * Point to all form inputs.
         * @type {NodeListOf<Element>}
         */
        private _inputs: NodeListOf<Element>;

        /**
         * Get form inputs.
         * @returns {NodeListOf<Element>}
         */
        get inputs() {
            if (!this._inputs) {
                let selectors = this._settings['inputSelectors'];
                this._inputs = this._element.querySelectorAll( selectors.join(",") );
            }

            return this._inputs;
        }

        /**
         * Store checkboxes grouped by name attribute.
         * @type {Object}
         */
        private _checkboxes: Object;

        /**
         * Get checkboxes.
         * @returns {Object}
         */
        get checkboxes(): Object {
            if (!this._checkboxes) {
                this._checkboxes = { };

                [].forEach.call(this.inputs, (input: HTMLInputElement) => {
                    if ("checkbox" === input.type) {
                        if (!this._checkboxes.hasOwnProperty(input.name)) {
                            this._checkboxes[input.name] = [];
                        }

                        this._checkboxes[input.name].push(input);
                    }
                });
            }

            return this._checkboxes;
        }

        /**
         * Store radios gropued by name attribute.
         * @type {Object}
         */
        private _radios: Object;

        /**
         * Get radios.
         * @returns {Object}
         */
        get radios(): Object {
            if (!this._radios) {
                this._radios = { };

                [].forEach.call(this.inputs, (input: HTMLInputElement) => {
                    if ("radio" === input.type) {
                        if (!this._radios.hasOwnProperty(input.name)) {
                            this._radios[input.name] = [];
                        }

                        this._radios[input.name].push(input);
                    }
                });
            }

            return this._radios;
        }

        /**
         * Store texts.
         * @type {Array<HTMLInputElement>}
         */
        private _texts: Array<HTMLInputElement>;

        /**
         * Get texts.
         * @returns {Object}
         */
        get texts(): Array<HTMLInputElement> {
            if (!this._texts) {
                this._texts = [];

                [].forEach.call(this.inputs, (input: HTMLInputElement) => {
                    if ("text" === input.type || "hidden" === input.type || "textarea" === input.tagName.toLowerCase()) {
                        this._texts.push(input);
                    }
                });

            }

            return this._texts;
        }

        // endregion

    }

}