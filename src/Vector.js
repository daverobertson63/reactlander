//
// Basic 3D Vector stuff
//
export default class Vector {

	constructor(x, y, z) {

		this.x = x;
		this.y = y;
		this.z = z;
		this.dx = 0;
		this.dy = 0;
		this.dz = 0;
		this.tz = 0;
		this.ty = 0;
		this.tz = 0;
		this.userData = 0;
		
	}

	copy(v) {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
	}
	add(v) {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
	}
	sub(v) {
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
	}
	cross(v) {
		this.tx = this.x;
		this.ty = this.y;
		this.tz = this.z;

		this.x = this.ty * v.z - this.tz * v.y;
		this.y = this.tz * v.x - this.tx * v.z;
		this.z = this.tx * v.y - this.ty * v.x;
	}
	multiply(s) {
		//console.log(s);
		this.x *= s;
		this.y *= s;
		this.z *= s;
		//console.log(this.x);
	}
	distanceTo(v) {
		this.dx = this.x - v.x;
		this.dy = this.y - v.y;
		this.dz = this.z - v.z;

		return Math.sqrt(this.dx * this.dx + this.dy * this.dy + this.dz * this.dz);
	}

	distanceToSquared(v) {
		this.dx = this.x - v.x;
		this.dy = this.y - v.y;
		this.dz = this.z - v.z;

		return this.dx * this.dx + this.dy * this.dy + this.dz * this.dz;
	}

	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	lengthSq() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}

	negate() {
		this.x = -this.x;
		this.y = -this.y;
		this.z = -this.z;
	}

	normalize() {
		if (this.length() > 0)
			this.ool = 1.0 / this.length();
		else
			this.ool = 0;

		this.x *= this.ool;
		this.y *= this.ool;
		this.z *= this.ool;
		return this;
	}

	dot(v) {
		return this.x * v.x + this.y * v.y + this.z * v.z;
	}

	clone() {
		return new Vector(this.x, this.y, this.z);
	}

	toString() {
		return '(' + this.x + ', ' + this.y + ', ' + this.z + ')';
	}

}
