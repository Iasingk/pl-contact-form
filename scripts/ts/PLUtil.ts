/**
 * Created by cesarmejia on 29/08/2017.
 */
module pl {

    export class Util {

        /**
         * Determine whether any of the matched elements are assigned the given class.
         * @param {HTMLElement} elem
         * @param {string} className
         * @returns {boolean}
         */
        public static hasClass(elem: HTMLElement, className: string) {
            return elem.classList
                ? elem.classList.contains(className)
                : new RegExp("\\b" + className + "\\b").test(elem.className);
        }

        /**
         * Adds the specified class to an element.
         * @param {HTMLElement} elem
         * @param {string} className
         */
        public static addClass(elem: HTMLElement, className: string) {
            if (elem.classList) elem.classList.add(className);
            else if (!Util.hasClass(elem, className)) elem.className += " " + className;
        }

        /**
         * Remove class from element.
         * @param {HTMLElement} elem
         * @param {string} className
         */
        public static removeClass(elem: HTMLElement, className: string) {
            if (elem.classList) elem.classList.remove(className);
            else elem.className = elem.className.replace(new RegExp("\\b" + className + "\\b", "g"), '');
        }

    }

}