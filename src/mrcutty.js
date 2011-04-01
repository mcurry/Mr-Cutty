/**
 * Main class for showing weapon and triggering Blood and Carnage
 * @class MrCutty
 */
function MrCutty() {
		var loadingIcon = Util.createElement("img", {
				position: "fixed",
				top: "15px",
				left: "15px"
		}, {
				"class": "mrcutty-loading-icon",
				src: "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.2/themes/smoothness/images/ui-anim_basic_16x16.gif"
		});
		document.body.appendChild(loadingIcon);

		var cuts = {
				cutting: false
		};
		var weapon = {};
		var blood = {};

		var angle = 0;
		var prevX = 0;
		var muted = true;

		var shortcuts = {
				67: Chainsaw,
				76: Lightsaber,
				89: Yahoo,
				71: Google,
				66: Bing,
				74: Jcal
		}

		var eggs = {
				1008: Lightsaber,
				1405: Bing,
				1184: Google,
				1312: Yahoo,
				1428: Jcal
		};

		Util.init();
		Carnage.init();

		var hostnameHash = Util.hash(window.location.hostname);
		if (eggs[hostnameHash]) {
				weaponClass = eggs[hostnameHash];
		} else {
				weaponClass = Chainsaw;
		}

		addStyle();
		addBloodCanvas();
		addCutsCanvas();
		addWeaponCanvas();

		initSound();

		initMouseDown();
		initMouseUp();
		initMouseMovement();
		initWeaponJitter();
		initScroll();
		initKeyPress();

		document.body.removeChild(loadingIcon);

		/**
		 * Setup the sound effects
		 * @method initSound
		 */
		function initSound() {
				var muteIcon = Util.createElement("img", {}, {
						"class": "mrcutty-sound",
						src: rootPath + "img/sound_mute.png"
				});
				muteIcon.addEventListener("click", function() {
						muted = false;
						if (weapon.Snd.Idle) {
								weapon.Snd.Idle.play();
						}

						unMuteIcon.style.display = "block";
						muteIcon.style.display = "none";
				}, true);
				document.body.appendChild(muteIcon);

				var unMuteIcon = Util.createElement("img", {}, {
						"class": "mrcutty-sound",
						src: rootPath + "img/sound.png"
				});
				unMuteIcon.addEventListener("click", function() {
						muted = true;
						if (weapon.Snd.Idle) {
								weapon.Snd.Idle.pause();
						}
						if (weapon.Snd.Cut) {
								weapon.Snd.Cut.pause();
						}

						unMuteIcon.style.display = "none";
						muteIcon.style.display = "block";
				}, true);
				document.body.appendChild(unMuteIcon);

				if (muted) {
						unMuteIcon.style.display = "none";
				} else {
						muteIcon.style.display = "none";
				}

				weapon.Snd = {};
				if (weaponClass.idleSnd) {
						weapon.Snd.Idle = Util.createElement("audio", {}, {
								loop: true,
								src: weaponClass.idleSnd
						});
						document.body.appendChild(weapon.Snd.Idle);
						if (!muted) {
								weapon.Snd.Idle.play();
						}
				}

				if (weaponClass.cutSnd) {
						weapon.Snd.Cut = Util.createElement("audio", {}, {
								loop: true,
								src: weaponClass.cutSnd
						});
						weapon.Snd.Cut.muted = muted;
						document.body.appendChild(weapon.Snd.Cut);
				}
		}

		/**
		 * Setup handler for page scrolling
		 * @method initScroll
		 */
		function initScroll() {
				window.addEventListener("scroll", function(evt) {
						blood.canvas.style.top = "-" + window.scrollY + "px";
						cuts.canvas.style.top = "-" + window.scrollY + "px";
				}, false);
		}

		/**
		 * Setup handler for key presses
		 * @method initKeyPress
		 */
		function initKeyPress() {
				window.addEventListener("keyup", function(evt) {
						var newWeaponClass = null;
						console.log(evt.keyCode);
						if (shortcuts[evt.keyCode]) {
								old = {
										top: weapon.canvas.style.top,
										left: weapon.canvas.style.left
								};
								weaponClass = shortcuts[evt.keyCode];
								document.body.removeChild(weapon.canvas);
								if (weapon.Snd.Idle) {
										document.body.removeChild(weapon.Snd.Idle);
								}
								if (weapon.Snd.Cut) {
										document.body.removeChild(weapon.Snd.Cut);
								}
								addWeaponCanvas();
								initSound();
								initMouseDown();
								initMouseUp();
								initMouseMovement();
								weapon.canvas.style.top = old.top;
								weapon.canvas.style.left = old.left;
						}
				}, false);
		}

		/**
		 * Setup handler for mouse down event
		 * @method initMouseDown
		 */
		function initMouseDown() {
				window.addEventListener("mousedown", function(evt) {
						cuts.ctx.beginPath();
						cuts.ctx.moveTo(evt.pageX, evt.pageY);

						weapon.ctx.save();
						weapon.ctx.beginPath();
						weapon.ctx.clearRect(0, 0, weaponClass.width, weaponClass.height / 2);
						weapon.ctx.rect(0, weaponClass.buryHeight, weaponClass.width, weaponClass.height - weaponClass.buryHeight);
						weapon.ctx.clip();

						cuts.ctx.moveTo(evt.pageX + angle, evt.pageY - weaponClass.cutHeight);

						cuts.start = {
								x: evt.pageX + (angle * 2.25),
								y: evt.pageY - weaponClass.cutHeight
						};

						if (!muted && weapon.Snd.Idle) {
								weapon.Snd.Idle.pause();
						}
						if (!muted && weapon.Snd.Cut) {
								weapon.Snd.Cut.play();
						}

						cuts.cutting = true;
				}, false);
		}

		/**
		 * Setup handler for mouse up event
		 * @method initMouseUp
		 */
		function initMouseUp() {
				window.addEventListener("mouseup", function(evt) {
						if (!muted && weapon.Snd.Cut) {
								weapon.Snd.Cut.pause();
						}
						if (!muted && weapon.Snd.Idle) {
								weapon.Snd.Idle.play();
						}

						cuts.cutting = false;
						weapon.ctx.restore();
				}, false);
		}

		/**
		 * Setup handler for mouse move event
		 * @method initMouseMovement
		 */
		function initMouseMovement() {
				window.addEventListener("mousemove", function(evt) {
						weapon.canvas.style.top = (evt.clientY - weaponClass.height + 30) + "px";
						weapon.canvas.style.left = (evt.clientX - weaponClass.width / 2) + "px";

						if (cuts.cutting) {
								cutX = evt.pageX + (angle * 2.25);
								cutY = evt.pageY - weaponClass.cutHeight;

								cuts.ctx.strokeStyle = "red";
								cuts.ctx.lineWidth = 10;
								cuts.ctx.lineTo(cutX, cutY);
								cuts.ctx.stroke();

								new Blood(blood.ctx, cuts.start, {
										x: cutX,
										y: cutY
								});

								cuts.start = {
										x: cutX,
										y: cutY
								};

								elm = getElement(evt.clientX + (angle * 2.25), evt.clientY - weaponClass.cutHeight);
								if (elm) {
										Carnage.trigger(elm);
								}

						}

						if (prevX > evt.pageX) {
								setAngle(1);
						} else if (prevX < evt.pageX) {
								setAngle(-1);
						}

						drawWeapon();

						prevX = evt.pageX;
				}, false);
		}


		/**
		 * Setup weapon jitter
		 * @method initWeaponJitter
		 */
		function initWeaponJitter() {
				setInterval(function() {
						setAngle();
						drawWeapon();
				}, 100);
		}

		/**
		 * Location the DOM element at position x,y
		 * @method getElement
		 * $param {int} x the x coordinate
		 * $param {int} y the y coordinate
		 */
		function getElement(x, y) {
				blood.canvas.style.visibility = "hidden";
				cuts.canvas.style.visibility = "hidden";
				weapon.canvas.style.visibility = "hidden";

				elm = document.elementFromPoint(x, y);

				blood.canvas.style.visibility = "visible";
				cuts.canvas.style.visibility = "visible";
				weapon.canvas.style.visibility = "visible";

				return elm;
		}

		/**
		 * Draw the weapon on the canvas
		 * @method drawWeapon
		 */
		function drawWeapon() {
				weapon.ctx.clearRect(0, 0, weaponClass.width, weaponClass.height);
				weapon.ctx.save();

				weapon.ctx.translate(weaponClass.width / 2, weaponClass.height);
				weapon.ctx.rotate(angle * Math.PI / 180);
				weapon.ctx.drawImage(weapon.Img, -weaponClass.width / 2, -weaponClass.height);

				if (cuts.cutting) {
						weapon.ctx.beginPath();
						weapon.ctx.fillStyle = "red";
						weapon.ctx.arc(0, -weaponClass.cutHeight - 40, 10, 0, Math.PI * 2);
						weapon.ctx.fill();
				}

				weapon.ctx.restore();
		}

		/**
		 * Add the weapon canvas to the page
		 * @method addWeaponCanvas
		 */
		function addWeaponCanvas() {
				weapon.Img = new Image();
				weapon.Img.src = weaponClass.img;

				weapon.canvas = Util.createElement("canvas", {
						position: "fixed",
						zIndex: 99999
				}, {
						width: weaponClass.width,
						height: weaponClass.height
				});

				weaponClass.buryHeight = Math.round(weaponClass.height * .2);
				weaponClass.cutHeight = weaponClass.height - weaponClass.buryHeight - 30;

				document.body.appendChild(weapon.canvas);
				weapon.ctx = weapon.canvas.getContext('2d');
		}

		/**
		 * Add the dripping blood canvas to the page
		 * @method addBloodCanvas
		 */
		function addBloodCanvas() {
				blood.canvas = Util.createElement("canvas", {
						position: "fixed",
						zIndex: 99998,
						top: 0,
						left: 0
				}, {
						width: document.body.scrollWidth,
						height: document.body.scrollHeight
				});
				document.body.appendChild(blood.canvas);
				blood.ctx = blood.canvas.getContext('2d');
		}

		/**
		 * Add the cuts canvas to the page
		 * @method addCutsCanvas
		 */
		function addCutsCanvas() {
				cuts.canvas = Util.createElement("canvas", {
						position: "fixed",
						zIndex: 99997,
						top: 0,
						left: 0
				}, {
						width: document.body.scrollWidth,
						height: document.body.scrollHeight
				});

				document.body.appendChild(cuts.canvas);
				cuts.ctx = cuts.canvas.getContext('2d');
		}

		/**
		 * Add the style sheet to turn off text highlighting and other stuff
		 * @method addStyle
		 */
		function addStyle() {
				document.onselectstart = function() {
						return false;
				}

				var ss = Util.createElement("style", {}, {
						type: "text/css"
				});
				ss.innerHTML = "*{-moz-user-select: none;}"
					+ "body{cursor: pointer;}"
					+ ".mrcutty-sound{position:fixed;top:15px;left:15px;z-index:99999;background:#fff;border:1px solid #999;padding:5px;-moz-border-radius:5px;border-radius:5px;}";

				document.getElementsByTagName("head")[0].appendChild(ss);
		}

		/**
		 * Calculate the angle of the weapon.  Capped at +-20 degrees
		 * @method setAngle
		 * @param {int} n
		 */
		function setAngle(n) {
				n = n || Util.rand(-1, 1);
				angle += n;

				angle = Math.min(Math.max(angle, -20), 20);
		}
};