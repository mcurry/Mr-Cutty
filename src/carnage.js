/**
 * Class for destorying a web page
 * @class Carnage
 */
var Carnage = {
	elmTypes: ["img", "h1", "h2", "h3", "h4", "h5", "h4", "li", "p", "object", "embed", "a", "span"],

	/**
	 * Initialize the page for the pending carnage
	 * @method init
	 */
	init: function() {
		for(var i = 0; i < Carnage.elmTypes.length; i ++) {
			Carnage.tagElements(Carnage.elmTypes[i]);
		}
	},

	/**
	 * Loop through the elements and flag those that can be carnaged
	 * @method init
	 * @param {string} type the type of elements to check
	 */
	tagElements: function(type) {
		elms = document.getElementsByTagName(type);

		for (var i = elms.length - 1; i >= 0; i --) {
			if(elms[i].tagName == "SPAN" && elms[i].parentNode.className.indexOf("mrcutty-") != -1) {
				continue;
			}

			if(elms[i].tagName != "P") {
				if(elms[i].className != "") {
					elms[i].className += " ";
				}
				elms[i].className += "mrcutty-to-be-carnaged";
			} else {
				//this messes up the text for some reason
				//newElm = Util.createElement(type);
				newText = "";

				for (j = 0; j < elms[i].childNodes.length; j ++) {
					if(elms[i].childNodes[j].nodeType == Node.TEXT_NODE) {
						pieces = elms[i].childNodes[j].textContent.split(" ");

						for(k = 0; k < pieces.length; k ++) {
							//tempElm = Util.createElement("span", {}, {"class": "mrcutty-to-be-carnaged"});
							//tempElm.innerHTML = pieces[k];
							//newElm.appendChild(tempElm);
							newText += "<span class='mrcutty-to-be-carnaged'>" + pieces[k] + "</span> ";
						}
					} else {
						//newElm.appendChild(elms[i].childNodes[j]);
						newText += "<" + elms[i].childNodes[j].tagName + " ";
						attr = elms[i].childNodes[j].attributes;
						for(k = 0; k < attr.length; k ++) {
							if(attr[k].value != "") {
								newText += attr[k].name + "='" + attr[k].value + "' ";
							} else {
								newText += attr[k].name + " ";
							}
						}

						newText +=  ">";
						newText += elms[i].childNodes[j].innerHTML;
						newText += "</" + elms[i].childNodes[j].tagName + ">";
					}
				}

				//elms[i].parentNode.replaceChild(newElm, elms[i]);
				elms[i].innerHTML = newText;
			}
		}
	},

	/**
	 * Trigger the carnage
	 * @method trigger
	 * @param {object} elm the element to be carnaged if possible
	 */
	trigger: function(elm) {
		if(elm.className.indexOf("mrcutty-to-be-carnaged") == -1) {
			return;
		}
		elm.className = elm.className.replace("mrcutty-to-be-carnaged", "mrcutty-carnaged");

		var d = {elm: elm};
		var pos = Util.findPos(d.elm);

		d.elm.style.position = "fixed";
		d.elm.style.left = pos["left"] + "px"
		d.elm.style.top = pos["top"] + "px"

		d.x = pos["left"];

		range = [-3,-2,-1,1,2,3];
		d.c = range[Util.rand(0,5)];

		d.offset = Util.rand (5, 70);
		d.offset = d.c * d.offset;

		d.x0 = d.x;
		d.y = pos["top"];
		d.a = .01;

		d.elm.style.left = d.x + "px";
		d.elm.style.top = d.y + "px";
		var intT = setInterval(function() {
			d.x += d.c;
			var y = (d.a * (d.x0 - d.x + d.offset) * (d.x0 - d.x)) + d.y;

			d.elm.style.left = d.x + "px";
			d.elm.style.top = y + "px";

			if ((d.x + d.elm.offsetWidth) < 0 || d.x > window.innerWidth || y > window.innerHeight) {
				d.elm.parentNode.removeChild(d.elm);
				clearInterval(intT);
			}
		}, 25);
	}
};
