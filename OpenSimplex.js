'use strict';

var OpenSimplex = function(){
	var NextRandom = function(seed){
		return (seed * 63641362 + 14426950) % (1<<30);
	};
	var STRETCH_CONSTANT_2D = -0.211324865405187;    //(1/Math.sqrt(2+1)-1)/2;
	var SQUISH_CONSTANT_2D = 0.366025403784439;      //(Math.sqrt(2+1)-1)/2;
	var STRETCH_CONSTANT_3D = -1.0 / 6;              //(1/Math.sqrt(3+1)-1)/3;
	var SQUISH_CONSTANT_3D = 1.0 / 3;                //(Math.sqrt(3+1)-1)/3;
	var STRETCH_CONSTANT_4D = -0.138196601125011;    //(1/Math.sqrt(4+1)-1)/4;
	var SQUISH_CONSTANT_4D = 0.309016994374947;      //(Math.sqrt(4+1)-1)/4;

	var NORM_CONSTANT_2D = 47;
	var NORM_CONSTANT_3D = 103;
	var NORM_CONSTANT_4D = 30;

	var DEFAULT_SEED = 0;

	var NewSimplex = {};
	var gradients2D = [
		5,  2,    2,  5,
			-5,  2,   -2,  5,
		5, -2,    2, -5,
			-5, -2,   -2, -5,
	];

	var gradients3D = [
			-11,  4,  4,     -4,  11,  4,    -4,  4,  11,
		11,  4,  4,      4,  11,  4,     4,  4,  11,
			-11, -4,  4,     -4, -11,  4,    -4, -4,  11,
		11, -4,  4,      4, -11,  4,     4, -4,  11,
			-11,  4, -4,     -4,  11, -4,    -4,  4, -11,
		11,  4, -4,      4,  11, -4,     4,  4, -11,
			-11, -4, -4,     -4, -11, -4,    -4, -4, -11,
		11, -4, -4,      4, -11, -4,     4, -4, -11,
	];

	var extrapolate2d = function (xsb,ysb,dx,dy, Simplex)
	{
		var index = Simplex.perm[(Simplex.perm[xsb & 0xFF] + ysb) & 0xFF] & 0x0E;
		var ret = gradients2D[index] * dx
			+ gradients2D[index + 1] * dy;
		if(ret<0)
			var x = 0;

		return ret;
	}

	return {
		create : function(seed){


			NewSimplex.noise2D = function(x, y){
				//Place input coordinates onto grid.
				var stretchOffset = (x + y) * STRETCH_CONSTANT_2D;
				var xs = x + stretchOffset;
				var ys = y + stretchOffset;

				//Floor to get grid coordinates of rhombus (stretched square) super-cell origin.
				var xsb = Math.floor(xs);
				var ysb = Math.floor(ys);

				//Skew out to get actual coordinates of rhombus origin. We'll need these later.
				var squishOffset = (xsb + ysb) * SQUISH_CONSTANT_2D;
				var xb = xsb + squishOffset;
				var yb = ysb + squishOffset;

				//Compute grid coordinates relative to rhombus origin.
				var xins = xs - xsb;
				var yins = ys - ysb;

				//Sum those together to get a value that determines which region we're in.
				var inSum = xins + yins;

				//Positions relative to origin povar.
				var dx0 = x - xb;
				var dy0 = y - yb;

				//We'll be defining these inside the next block and using them afterwards.
				var dx_ext, dy_ext;
				var xsv_ext, ysv_ext;

				var value = 0;

				//Contribution (1,0)
				var dx1 = dx0 - 1 - SQUISH_CONSTANT_2D;
				var dy1 = dy0 - 0 - SQUISH_CONSTANT_2D;
				var attn1 = 2 - dx1 * dx1 - dy1 * dy1;
				if (attn1 > 0) {
					attn1 *= attn1;
					value += attn1 * attn1 * extrapolate2d(xsb + 1, ysb + 0, dx1, dy1, this);
				}

				//Contribution (0,1)
				var dx2 = dx0 - 0 - SQUISH_CONSTANT_2D;
				var dy2 = dy0 - 1 - SQUISH_CONSTANT_2D;
				var attn2 = 2 - dx2 * dx2 - dy2 * dy2;
				if (attn2 > 0) {
					attn2 *= attn2;
					value += attn2 * attn2 * extrapolate2d(xsb + 0, ysb + 1, dx2, dy2, this);
				}

				if (inSum <= 1) { //We're inside the triangle (2-Simplex) at (0,0)
					var zins = 1 - inSum;
					if (zins > xins || zins > yins) { //(0,0) is one of the closest two triangular vertices
						if (xins > yins) {
							xsv_ext = xsb + 1;
							ysv_ext = ysb - 1;
							dx_ext = dx0 - 1;
							dy_ext = dy0 + 1;
						} else {
							xsv_ext = xsb - 1;
							ysv_ext = ysb + 1;
							dx_ext = dx0 + 1;
							dy_ext = dy0 - 1;
						}
					} else { //(1,0) and (0,1) are the closest two vertices.
						xsv_ext = xsb + 1;
						ysv_ext = ysb + 1;
						dx_ext = dx0 - 1 - 2 * SQUISH_CONSTANT_2D;
						dy_ext = dy0 - 1 - 2 * SQUISH_CONSTANT_2D;
					}
				} else { //We're inside the triangle (2-Simplex) at (1,1)
					var zins = 2 - inSum;
					if (zins < xins || zins < yins) { //(0,0) is one of the closest two triangular vertices
						if (xins > yins) {
							xsv_ext = xsb + 2;
							ysv_ext = ysb + 0;
							dx_ext = dx0 - 2 - 2 * SQUISH_CONSTANT_2D;
							dy_ext = dy0 + 0 - 2 * SQUISH_CONSTANT_2D;
						} else {
							xsv_ext = xsb + 0;
							ysv_ext = ysb + 2;
							dx_ext = dx0 + 0 - 2 * SQUISH_CONSTANT_2D;
							dy_ext = dy0 - 2 - 2 * SQUISH_CONSTANT_2D;
						}
					} else { //(1,0) and (0,1) are the closest two vertices.
						dx_ext = dx0;
						dy_ext = dy0;
						xsv_ext = xsb;
						ysv_ext = ysb;
					}
					xsb += 1;
					ysb += 1;
					dx0 = dx0 - 1 - 2 * SQUISH_CONSTANT_2D;
					dy0 = dy0 - 1 - 2 * SQUISH_CONSTANT_2D;
				}

				//Contribution (0,0) or (1,1)
				var attn0 = 2 - dx0 * dx0 - dy0 * dy0;
				if (attn0 > 0) {
					attn0 *= attn0;
					value += attn0 * attn0 * extrapolate2d(xsb, ysb, dx0, dy0, this);
				}

				//Extra Vertex
				var attn_ext = 2 - dx_ext * dx_ext - dy_ext * dy_ext;
				if (attn_ext > 0) {
					attn_ext *= attn_ext;
					value += attn_ext * attn_ext * extrapolate2d(xsv_ext, ysv_ext, dx_ext, dy_ext, this);
				}

				return value / NORM_CONSTANT_2D;
			};

			NewSimplex.perm = [];
			NewSimplex.permGradIndex3D = [];
			var source = [];
			for (var i = 0; i < 256; i++)
				source[i] = i;
			seed=NextRandom(seed);
			seed=NextRandom(seed);
			seed=NextRandom(seed);
			for (var i = 255; i >= 0; i--) {
				seed=NextRandom(seed);
				var r = ((seed + 31) % (i + 1));
				if (r < 0)
					r += (i + 1);
				NewSimplex.perm[i] = source[r];
				NewSimplex.permGradIndex3D[i] = ((NewSimplex.perm[i] % (gradients3D.length / 3)) * 3);
				source[r] = source[i];
			}
			return NewSimplex;
		}
	}
}();
