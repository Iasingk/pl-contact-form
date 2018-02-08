/**
 * Created by cesarmejia on 29/08/2017.
 */
/**
 * Created by Sexar on 07/02/2018.
 */
module pl {

    export class Util {

        /**
         * Capitalize text.
         * @param {string} text
         * @returns {string}
         */
        static capitalizeText(text: string) {
            return text.replace(/\w/, l => l.toUpperCase() );
        }

        /**
         * Merge objects and create a new one.
         * @param {Array<Object>} objects
         * @return {Object}
         */
        static extendsDefaults(...objects) {
            let result: Object = {}, i: number;

            for (i = 0; i < objects.length; i++) {
                (currentObj => {
                    let prop;

                    for (prop in currentObj) {
                        if (currentObj.hasOwnProperty(prop)) {
                            result[prop] = currentObj[prop];
                        }
                    }
                })(objects[i]);
            }

            return result;
        }

    }

}