/**
 * Created by cesarmejia on 20/08/2017.
 */
module pl {

    export class ContactForm {

        /**
         * @type {HTMLFormElement}
         */
        _form: HTMLFormElement;

        /**
         * @type {NodeList}
         */
        _inputs: NodeList;

        /**
         * Get form inputs.
         * @param {HTMLFormElement} form
         * @returns {NodeListOf<Element>}
         */
        public static getInputs(form: HTMLFormElement) {
            var validInputs = [
                "input[type=text]",
                "input[type=checkbox]",
                "input[type=radio]",
                "textarea"
            ];

            return form.querySelectorAll( validInputs.join(",") );
        }

        /**
         *
         * @param {HTMLElement} form
         */
        constructor(form: HTMLFormElement) {
            if (!(form instanceof HTMLElement))
                throw 'Template is not an HTMLElement';

            this._form = form;
            this._inputs = ContactForm.getInputs(this._form);

            this.onInputChange = this.onInputChange.bind(this);

            this.initializeEvents();
        }

        /**
         * Attach handlers to contact form elements.
         */
        private initializeEvents() {
            [].forEach.call(this._inputs, (input) => {
                if (input.type === 'text' || input.tagName.toLowerCase() === 'textarea')
                    input.addEventListener('keyup', this.onInputChange, false);

                input.addEventListener('change', this.onInputChange, false);
            });

        }

        /**
         * Fires when an input changes.
         * @param {Event} ev
         */
        private onInputChange(ev) {
            console.log(ev.target.value);
        }

        /**
         * Check validity of an input.
         * @param {HTMLElement} input
         * @returns {boolean} validity
         */
        public isInputValid(input: HTMLElement) {

        }

        /**
         * Reset form.
         */
        public reset() {
            this._form.reset();
        }

    }

}