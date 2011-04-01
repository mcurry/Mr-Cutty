/**
 * Class for drawing dripping blood
 * @class Blood
 * @param {object} ctx the canvas context for drawing
 * @param {object} x,y coordinates for the start of the blood path
 * @param {object} x,y coordinates for the end of the blood path
 */
function Blood(ctx, start, end) {
		var startY = start.y + ((end.y - start.y) / 2);
		var points = [];
		var prev = start;

		for (i = 0; i < 5; i++) {
				temp = {
						start: prev,
						h: 0,
						rate: Util.rand(1, 3)
				};

				if (i == 9) {
						temp.end = end;
				} else {
						w = Util.rand(10, 50);
						temp.end = {};
						temp.end.x = temp.start.x + w;

						diffY = end.y - start.y;
						diffX = end.x - start.x;

						temp.end.y = temp.start.y + ((w / diffX) * diffY);

						if (temp.end.x >= end.x) {
								temp.end.x = end.x;
								temp.end.y = end.y;
								i = 10;
						}
				}

				temp.startY = temp.start.y + ((temp.end.y - temp.start.y) / 2);

				prev = temp.end;
				points.push(temp);
		}
		var t = 0;

		var iv = setInterval(function() {
				ctx.save();
				ctx.beginPath();
				ctx.moveTo(points[0].start.x, points[0].start.y);

				for (i = 0; i < points.length; i++) {
						draw(points[i]);
						points[i].h += points[i].rate;

						//if (i < points.length - 1) {
								points[i].start.y += Util.rand(0, 10) / 10;
								points[i].end.y += Util.rand(0, 10) / 10;
						//}
				}

				ctx.closePath();
				ctx.fillStyle = "red";
				ctx.fill();
				ctx.restore();

				t++;
				if (t > 100) {
						clearInterval(iv);
				}
		}, 100);

		function draw(obj) {
				cp1x = obj.start.x + ((obj.end.x - obj.start.x) / 2);
				cp1y = obj.startY + obj.h;

				ctx.quadraticCurveTo(cp1x, cp1y, obj.end.x, obj.end.y);
		}
};
