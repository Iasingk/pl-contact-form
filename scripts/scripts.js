/**
 * Created by cesarmejia on 20/08/2017.
 */
var pl;
(function (pl) {
    var ContactForm = (function () {
        /**
         *
         * @param {HTMLElement} template
         */
        function ContactForm(template) {
            console.log(template);
        }
        return ContactForm;
    }());
    pl.ContactForm = ContactForm;
})(pl || (pl = {}));
/**
 * Created by cesarmejia on 20/08/2017.
 * https://validatejs.org/#validators-datetime
 */
var pl;
(function (pl) {
    var Validator = (function () {
        function Validator() {
        }
        /**
         * Validate if value is a valid email.
         * @param {any} value
         * @returns {boolean}
         */
        Validator.email = function (value) {
            if (!Validator.isString(value))
                return false;
            return /[\w-\.]{3,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/.test(value);
        };
        /**
         * Validate if value is a valid hash.
         * @param {any} value
         * @returns {boolean}
         */
        Validator.hash = function (value) {
            if (!Validator.isString(value))
                return false;
            return /^#\w*/.test(value);
        };
        /**
         * Validate if value is not empty.
         * @param {any} value
         * @returns {boolean}
         */
        Validator.notEmpty = function (value) {
            if (!Validator.isString(value))
                return false;
            return !!value.length;
        };
        /**
         * Validate if value is a valid phone number.
         * @param {any} value
         * @returns {boolean}
         */
        Validator.phone = function (value) {
            if (!Validator.isString(value)) {
                return false;
            }
            return value.replace(/[^\d]/g, '').length === 10;
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
            return Validator.toString(value) === typeof value;
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
         * Parse given value to string.
         * @param {any} value
         * @returns {string}
         */
        Validator.toString = function (value) {
            return new String(value).toString();
        };
        return Validator;
    }());
    pl.Validator = Validator;
})(pl || (pl = {}));
