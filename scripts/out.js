/**
 * Created by cesarmejia on 20/08/2017.
 */
var pl;
(function (pl) {
    var Validator = (function () {
        function Validator() {
        }
        /**
         * Validate that value is not empty.
         * @param {any} value
         * @returns {boolean}
         */
        Validator.notEmpty = function (value) {
            return true;
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
