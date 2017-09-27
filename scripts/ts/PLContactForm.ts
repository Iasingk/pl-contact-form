/**
 * Created by cesarmejia on 20/08/2017.
 * Implement: 1. Hide Loader
 *            2. Show Loader
 */
module pl {

    export class ContactForm {

        /**
         * Points to form element.
         * @type {HTMLFormElement}
         * @private
         */
        private _form: HTMLFormElement;

        /**
         * Store custom handlers for each event in ajax request.
         * @type {object}
         * @private
         */
        private _handlers: Object = {};

        /**
         * Points to form inputs.
         * @type {NodeListOf<Element>}
         * @private
         */
        private _inputs: NodeListOf<Element>;

        /**
         * Determine if window could close or not.
         * @type {boolean}
         * @private
         */
        private _letCloseWindow: boolean = true;

        /**
         * Contains info for contact form.
         * @type {object}
         * @private
         */
        private _settings: Object = {};

        /**
         * Check validity of an input.
         * @param {HTMLInputElement} input
         * @returns {boolean} validity
         */
        static isInputValid(input: HTMLInputElement) {
            let validation = input.dataset['validate'],
                name  = input.name,
                value = input.value;

            switch (validation) {
                case 'notEmpty':
                    return Validator.notEmpty(value);
                case 'phone':
                    return Validator.phone(value);
                case 'email':
                    return Validator.email(value);
                default:
                    "console" in window
                    && console.log("Unknown validation type: " + name);
                    return true;
            }
        }

        /**
         * Return if code is an invalid key.
         * @param {number} code
         */
        static isInvalidKey(code: number) {
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
         * Get form inputs.
         * @param form
         * @returns {NodeListOf<Element>}
         */
        static getInputs(form: HTMLFormElement) {
            let validInputs = [
                "input[type=text]",
                "input[type=checkbox]",
                "input[type=radio]",
                "textarea"
            ];

            return form.querySelectorAll( validInputs.join(",") );
        }

        /**
         * Create a contact form instance.
         * @param {HTMLElement} form
         * @param {object} settings
         */
        constructor(form: HTMLFormElement, settings: Object = {}) {
            if (!(form instanceof HTMLElement))
                throw 'Template is not an HTMLElement';

            let defaults = {
                method: 'POST',
                url: 'send-mail.php',
                async: true
            };

            this._form = form;
            this._inputs = ContactForm.getInputs(this._form);
            this._settings = Util.extendsDefaults(defaults, settings);

            this.beforeUnload = this.beforeUnload.bind(this);
            this.onInputChange = this.onInputChange.bind(this);
            this.onSubmit = this.onSubmit.bind(this);

            this.initializeEvents();
        }

        /**
         * Make an ajax request with contact form data.
         * @param {object} data
         */
        private ajaxRequest(data) {
            let req = new XMLHttpRequest();
            let settings = this._settings;
            let dataString = `data=${JSON.stringify(data)}`;

            req.onreadystatechange = function () {
                console.log(this.readyState);
                if (this.readyState === 4 && this.status === 200)
                    console.log(this.responseText);
            };

            req.open(settings['method'], settings['url'], settings['async']);
            req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            req.send(dataString);

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
         * Gets an object with form values.
         * @returns {object}
         */
        private getFormData() {
            let data = { };

            [].forEach.call(this._inputs, (input) => {
                data[input.name] = input.value
            });

            return data;
        }

        /**
         * Attach handlers to contact form elements.
         */
        private initializeEvents() {
            // Attach onInputChange handler to each input in form.
            [].forEach.call(this._inputs, (input) => {
                if (input.type === 'text' || input.tagName.toLowerCase() === 'textarea')
                    input.addEventListener('keyup', this.onInputChange, false);

                input.addEventListener('change', this.onInputChange, false);
            });


            // Attach on Submit handler to form.
            this._form.addEventListener('submit', this.onSubmit, false);

            // Attach onbeforeunload handler.
            window.onbeforeunload = this.beforeUnload;

        }

        /**
         * Handle input change event.
         * @param {Event} ev
         */
        private onInputChange(ev) {
            let code = ev.which || ev.keyCode || 0;

            // Do nothing if key is invalid.
            if (ContactForm.isInvalidKey(code)) return;

            // Retrieve input and some attrs.
            let input: HTMLInputElement = ev.target;

            this.toggleInputError(input);
        }

        /**
         * Set or remove error from input
         * @param {HTMLElement} input
         */
        private toggleInputError(input) {
            let type : String = input['type'];

            // If input has an error get it.
            let clueElem: HTMLElement = input['clue-elem'];
            let clueText: string = "";

            if (ContactForm.isInputValid(input)) {

                if (clueElem) {
                    // Disappears and remove error element from DOM.
                    clueElem.parentNode.removeChild(clueElem);

                    // Set as null clue elem.
                    input['clue-elem'] = null;
                }

                // Remove invalid class.
                Util.removeClass(input, 'invalid');

            } else {

                if (!clueElem) {
                    // Retrieve input clue.
                    clueText = input.dataset['clue'] || 'Inválido';

                    // Create clue element.
                    clueElem = document.createElement('span');
                    clueElem.innerText = clueText;

                    Util.addClass(clueElem, 'input-clue');

                    // Store clue element in input.
                    input['clue-elem'] = clueElem;

                    Util.insertBefore(clueElem, input);

                }

                // Set invalid class.
                Util.addClass(input, 'invalid');

            }
        }

        /**
         * Handle submit event.
         * @param {Event} ev
         */
        private onSubmit(ev) {
            ev.preventDefault();

            let form  = ev.target,
                valid = true;

            // Validate inputs before submit.
            [].forEach.call(this._inputs, (input) => {
                if (!ContactForm.isInputValid(input)) {
                    this.toggleInputError(input);
                    valid = false;
                }
            });

            if (!valid) {
                throw "There are invalid inputs.";

            } else {

                let data = {
                    host: location.hostname,
                    data: this.getFormData()
                };

                this.ajaxRequest(data);
            }

        }

        /**
         * Add custom handler.
         * @param {string} name before|error|success
         * @param {function} handler
         */
        public addHandler(name, handler) {
            this._handlers[name] = handler;
        }

        /**
         * Reset form.
         */
        public reset() {
            this._form.reset();
        }

    }

}