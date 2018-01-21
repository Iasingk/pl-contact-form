/**
 * Created by cesarmejia on 20/08/2017.
 */
module pl {
	
	export class PLEvent {

		// region Fields

		/**
		 * @type {Array<function>}
		 */
		private _handlers: Array<() => {}>;

		/**
		 * @type {any}
		 */
		private _scope: any;

		// endregion

		/**
		 * Create a PLEvent instance.
		 * @constructor
		 */
		constructor() {
			this._handlers = [];
			this._scope    = this || window;
		}

		// region Methods

		/**
		 * Add new handler.
		 * @param {function} handler
		 */
		public add(handler: () => {}) {
			if (handler) {
				this._handlers.push(handler);
			}
		}

		/**
		 * Excecute all suscribed handlers.
		 */
		public fire() {
			let args = arguments;

			this._handlers.forEach((handler) => {
				handler.apply(this._scope, args);
			});
		}

		/**
		 * Remove handler from handlers.
		 * @param {function} handler
		 */
		public remove(handler: () => {}) {
			this._handlers = this._handlers.filter((fn) => {
				if (fn != handler)
					return fn;
			});
		}

		// endregion

	}

}