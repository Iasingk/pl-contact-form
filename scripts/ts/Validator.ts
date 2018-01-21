/**
 * Created by cesarmejia on 20/08/2017.
 * https://validatejs.org/#validators-datetime
 */
module pl {

    export class Validator {

        /**
         * Validate if value has an specific length.
         * @param {any} value
         * @param {any} length
         */
        static count (value: any, length: any): boolean {
            let string = Validator.toString(value);

            if (string === "undefined"
                || string === "null"
                || string === "NaN"
                || string === "Infinity"
            ) return false;

            return string.length === length;
        }

        /**
         * Validate if value is a valid credit card number.
         * @param {string} value
         * @returns {boolean}
         */
        static creditCardNumber (value: string): boolean {
            if (!Validator.isString(value))
                return false;

            return /^(\d{4}-?){3}\d{4}$/.test(value);
        }

        /**
         * Validate if value is a valid date "dd/mm/yyyy".
         * @param {string} value
         * @returns {boolean}
         */
        static date (value: string): boolean {
            if (!Validator.isString(value))
                return false;

            // First check for the pattern
            if (!/^\d{1,2}\/|-\d{1,2}\/|-\d{4}$/.test(value))
                return false;

            // Parse the date parts to integers
            let parts = value.split(/\/|-/);
            let day   = parseInt(parts[0], 10);
            let month = parseInt(parts[1], 10);
            let year  = parseInt(parts[2], 10);

            // Check the ranges of month and year
            if (year < 1000 || year > 3000 || month == 0 || month > 12)
                return false;

            var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

            // Adjust for leap years
            if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
                monthLength[1] = 29;

            // Check the range of the day
            return day > 0 && day <= monthLength[month - 1];
        }

        /**
         * Validate if value is a valid datetime.
         * @param {string} value
         * @returns {boolean}
         */
        static datetime (value: string): boolean {
            throw 'Not implemented yet';
        }

        /**
         * Validate if value is a valid email.
         * @param {string} value
         * @returns {boolean}
         */
        static email (value: string): boolean {
            if (!Validator.isString(value))
                return false;

            return /[\w-\.]{3,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/.test(value);
        }

        /**
         * Validate if two values are equal.
         * @param {string} value
         * @param {string} confirm
         * @returns {boolean}
         */
        static equality (value: string, confirm: string) {
            if (!Validator.isString(value) && !Validator.isString(confirm))
                return false;

            return value === confirm;
        }

        /**
         * Validate if value is a valid hash.
         * @param {string} value
         * @returns {boolean}
         */
        static hash (value: string): boolean {
            if (!Validator.isString(value))
                return false;

            return /^#\w*/.test(value);
        }

        /**
         * Validate if value is not empty.
         * @param {string} value
         * @returns {boolean}
         */
        static notEmpty (value: string): boolean {
            if (!Validator.isString(value))
                return false;

            return !!value.length;
        }

        /**
         * Validate if value is a valid phone number.
         * @param {string} value
         * @returns {boolean}
         */
        static phone (value: string): boolean {
            if (!Validator.isString(value))
                return false;

            return value.replace(/[^\d]/g, '').length === 10;
        }

        /**
         * Validate the length of a string in a range.
         * @param {string} value
         * @param {any} min
         * @param {any} max
         * @returns {boolean}
         */
        static range (value: string, min: any, max?: any): boolean {
            let string: string = Validator.toString(value);

            if (string === "undefined"
                || string === "null"
                || string === "NaN"
                || string === "Infinity"
            ) return false;

            min = Validator.toInteger(<string>min);
            max = Validator.toInteger(<string>max);

            if ("number" === typeof max && !isNaN(max)) {
                return string.length >= min && string.length <= max;
            } else {
                return string.length >= min;
            }
        }

        /**
         * Validate if value is a valid url.
         * @param {string} value
         * @returns {boolean}
         */
        static url (value: string): boolean {
            if (!Validator.isString(value))
                return false;

            return /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(value);
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
            return "number" === typeof value;
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
         * Parse given value to float.
         * @param {string} value
         * @returns {number}
         */
        static toFloat (value: string): number {
            return parseFloat(value);
        }

        /**
         * Parse given value to integer.
         * @param {string} value
         * @returns {number}
         */
        static toInteger (value: string): number {
            return parseInt(value);
        }

        /**
         * Parse given value to string.
         * @param {any} value
         * @returns {string}
         */
        static toString (value: any): string {
            return String(value);
        }

    }

}