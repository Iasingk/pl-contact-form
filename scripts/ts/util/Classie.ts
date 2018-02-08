/**
 * Created by cesarmejia on 07/02/2018.
 */
module pl {

    export class Classie {

        /**
         * Adds the specified class to an element.
         * @param {HTMLElement} elem
         * @param {string} className
         */
        static addClass(elem: HTMLElement, className: string) {
            if (elem.classList) elem.classList.add(className);
            else if (!Classie.hasClass(elem, className)) elem.className += " " + className;
        }

        /**
         * Determine whether any of the matched elements are assigned the given class.
         * @param {HTMLElement} elem
         * @param {string} className
         * @returns {boolean}
         */
        static hasClass(elem: HTMLElement, className: string) {
            return elem.classList
                ? elem.classList.contains(className)
                : new RegExp("\\b" + className + "\\b").test(elem.className);
        }

        /**
         * Remove class from element.
         * @param {HTMLElement} elem
         * @param {string} className
         */
        static removeClass(elem: HTMLElement, className: string) {
            if (elem.classList) elem.classList.remove(className);
            else elem.className = elem.className.replace(new RegExp("\\b" + className + "\\b", "g"), '');
        }

        /**
         * Remove all classes in element.
         * @param {HTMLElement} elem
         */
        static reset(elem: HTMLElement) {
            elem.className = '';
        }

        /**
         * Add or remove class from element.
         * @param {HTMLElement} elem
         * @param {string} className
         */
        static toggleClass(elem: HTMLElement, className: string) {
            if (elem.classList) elem.classList.toggle(className);
            else Classie.hasClass(elem, className)
                ? Classie.removeClass(elem, className)
                : Classie.addClass(elem, className)
        }

    }

}