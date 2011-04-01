/**
 * A class of utility functions
 * @class Utility
 */
var Util = {
		init: function() {
				if (!Array.prototype.inArray) {
						Array.prototype.inArray = function(needle) {
								for (var i = 0; i < this.length; i++) {
										if (this[i] == needle) {
												return true;
										}
								}

								return false;
						}
				}
		},

		/**
		 * Generate a really lame hash. This is just used to disguise the easter eggs
		 * @method hash
		 * @param {string} str the string to hash
		 */
		hash: function(str) {
				var sum = 0;

				for (var i = 0; i < str.length; i++) {
						sum += str.charCodeAt(i);
				}

				return sum;
		},

		/**
		 * Generate a random integer
		 * @method rand
		 * @param {int} from the smallest possible random number
		 * @param {int} to the highest possible random number
		 */
		rand: function(from, to) {
				return Math.floor(Math.random() * (to - from + 1) + from);
		},

		/**
		 * Create a new elemnt
		 * @method createElement
		 * @param {string} type the type of element
		 * @param {object} style styles for the element
		 * @param {object} attributes attributes for the element
		 */
		createElement: function(type, style, attributes) {
				var elm = document.createElement(type);

				for (key in style) {
						elm.style[key] = style[key];
				}

				for (key in attributes) {
						elm.setAttribute(key, attributes[key]);
				}

				return elm;
		},

		/**
		 * Find the position of an element on the page
		 * FROM: http://www.quirksmode.org/js/findpos.html
		 * @method findPos
		 * @param {object} obj the element to locate
		 */
		findPos: function(obj) {
				var curleft = curtop = 0;

				if (obj.offsetParent) {
						do {
								curleft += obj.offsetLeft;
								curtop += obj.offsetTop;
						} while (obj = obj.offsetParent);

						return {
								left: curleft,
								top: curtop - window.scrollY
						};
				}

				return false;
		}
};