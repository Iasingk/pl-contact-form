/**
 * Created by cesarmejia on 20/08/2017.
 * https://validatejs.org/#validators-datetime
 */
module pl {

    export class Validator {

        /**
         * Validate if value is a valid email.
         * @param {any} value
         * @returns {boolean}
         */
        static email (value: any): boolean {
            if (!Validator.isString(value))
                return false;

            return /[\w-\.]{3,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/.test(value);
        }

        /**
         * Validate if value is a valid hash.
         * @param {any} value
         * @returns {boolean}
         */
        static hash (value: any): boolean {
            if (!Validator.isString(value))
                return false;

            return /^#\w*/.test(value);
        }

        /**
         * Validate if value is not empty.
         * @param {any} value
         * @returns {boolean}
         */
        static notEmpty (value: any): boolean {
            if (!Validator.isString(value))
                return false;

            return !!value.length;
        }

        /**
         * Validate if value is a valid phone number.
         * @param {any} value
         * @returns {boolean}
         */
        static phone (value: any): boolean {
            if (!Validator.isString(value)) {
                return false;
            }

            return value.replace(/[^\d]/g, '').length === 10;
        }

        /**
         * Validate if value is an array.
         * @param {any} value
         * @returns {boolean}
         */
        static isArray (value: any): boolean {
            return value instanceof Array;
        }

        /**
         * Validate if value is boolean.
         * @param {any} value
         * @returns {boolean}
         */
        static isBoolean (value: any): boolean {
            return "boolean" === typeof value;
        }

        /**
         * Validate if value is number.
         * @param {any} value
         * @returns {boolean}
         */
        static isNumber (value: any): boolean {
            return Validator.toString(value) === typeof value;
        }

        /**
         * Validate if value is string.
         * @param value
         * @returns {boolean}
         */
        static isString (value: any): boolean {
            return "string" === typeof value;
        }

        /**
         * Parse given value to string.
         * @param {any} value
         * @returns {string}
         */
        static toString (value: any): string {
            return new String(value).toString();
        }

    }

}