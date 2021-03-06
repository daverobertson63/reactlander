/*


*/

import Utilities from './Utilities';
import Vector from './Vector';

import { rotatePoint, randomNumBetween } from './helpers';

export default class Lander {

	constructor(width, height, terrainObj)
	//constructor (width, height)
	{
		// Local position
		width = 1024;
		height = 700;

		this.context = null;

		this.thrust = 0;
		this.gravity = 0.2;
		this.vel = new Vector(width / 2, 10, 0);
		this.acc = new Vector(0, 0, 0);
		this.pos = this.vel;
		this.scaler = 0.2;
		this.isThrusting = false;
		this.screenW = width;
		this.screenH = height;
		this.zoomed = false;
		this.fuel = 500;
		this.score = 0;

		this.destroy=0;

		var d = new Date();
		this.startTime = d.getTime();
		this.time = d.getTime();
		this.elapsedTime = this.time - this.startTime;

		this.xVel = 0;
		this.yVel = 0;

		this.speedLimit = 1;

		this.zX = 0;
		this.zY = 0;

		// Start the lander facing upward
		this.rot = -90;

		// Assign a referance to the terrain
		this.terrain = terrainObj;
		this.landingPads = terrainObj.landingPads;

		// Used when the ship explodes
		this.expLines = [];
		this.crashed = false;
		this.landed = false;

		this.message = "";

		this.utilities = new Utilities();

		// Canvas Font generated by Benjamin Joffe at http://random.abrahamjoffe.com.au/public/JavaScripts/canvas/fontGenerator.htm
		this.arial12 = new Image();
		this.arial12.src = 'data:image/png;base64,' +
			'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' +
			'SGGknosAAAAASUVORK5CYII='; // paste your data url string here
		this.arial12.c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789!@#$%^&*()-=[]\\;\',./_+{}|:"<>?`~';
		this.arial12.w = [9, 9, 8, 9, 9, 4, 9, 8, 4, 3, 8, 3, 13, 8, 9, 9, 9, 5, 8, 4, 8, 7, 11, 7, 7, 7, 11, 11, 12, 12, 11, 10, 12, 11, 3, 8, 11, 9, 13, 11, 12, 11, 12, 11, 11, 9, 11, 11, 15, 11, 9, 9, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 16, 9, 9, 14, 7, 11, 6, 5, 5, 5, 9, 4, 4, 4, 4, 3, 4, 4, 4, 9, 9, 5, 5, 3, 4, 6, 9, 9, 9, 5, 9];
		this.arial12.h = 19;


	}

	// public
	checkCrashed() {
		//console.log(this.crashed);
		if (this.destroy > 100 )
			return this.crashed ;
	}

	checkLanded() {
		//console.log(this.crashed);
		
		return this.landed ;
	}

	getScore() {
		//console.log(this.crashed);
		
		return this.score ;
	}

	// Resets the ship for new levels, etc
	reset(state) {
		// Check if we are doing a reset because the ship crashed.
		if (this.crashed) {
			this.fuel = 500;
			this.score = 0;
		}

		var d = new Date();
		this.startTime = d.getTime();
		this.time = d.getTime();
		this.elapsedTime = Math.round((this.time - this.startTime) / 1000);

		this.thrust = 0;
		this.vel = new Vector(this.screenW / 2, 10, 0);
		this.acc = new Vector(0, 0, 0);
		this.pos = this.vel;
		this.scaler = 0.2;
		this.isThrusting = false;

		this.xVel = 0;
		this.yVel = 0;

		this.zX = 0;
		this.zY = 0;

		// Start the lander facing upward
		this.rot = -90;

		// Used when the ship explodes
		this.expLines = [];
		this.crashed = false;
		this.landed = false;

		// Reset zooming
		this.zoomed = false;
		state.zoom = 1;
		state.zx = 1;
		state.zy = 1;

		this.terrain.update(1, 1, 1);
		this.landingPads = this.terrain.landingPads;
		this.curPad = undefined;
	}

	// Handles updating the ship
	update(state, deltaTime) {
		//var landerEvents = Lander.events;
		var landerEvents = state.keys;

		var gravity = this.gravity;
		var dX = 0;
		var dY = 0;

		this.context = state.context;
		//console.log('terrain context= ' + this.context)

		// Controls
		if (state.keys.up) {
			//this.accelerate(1);
		}
		if (state.keys.left) {
			//this.rotate('LEFT');
		}
		if (state.keys.right) {
			//this.rotate('RIGHT');
		}

		//if(state.keys.space && Date.now() - this.lastShot > 300){
		//const bullet = new Bullet({ship: this});
		//this.create(bullet, 'bullets');
		//this.lastShot = Date.now();
		//}

		//this.crashed = 0;
		//this.landed = 0;
		//console.log(landerEvents);
		//console.log(this);

		if (!this.crashed && !this.landed) {
			var d = new Date();
			this.time = d.getTime();

			if (landerEvents.up) {
				if (this.fuel > 0) {
					if (this.zoomed) {
						if (this.thrust < 0.03) {
							this.thrust += 0.0002;
						}
					} else {
						if (this.thrust < 0.015) {
							this.thrust += 0.0001;
						}
					}
				} else {
					this.thrust = 0;
				}
			} else if (landerEvents.down) {
				if (this.zoomed) {
					if (this.thrust > 0) {
						this.thrust -= 0.0002;
					}
				} else {
					if (this.thrust > 0) {
						this.thrust -= 0.0001;
					}
				}
			} else if (landerEvents.space) {
				if (this.zoomed) {
					this.thrust = 0.03;

				} else {

					this.thrust = 0.03;

				}

			}


			// Check if the lander is thrusting "OH YEAH!"
			if (this.thrust > 0 && this.fuel > 0) {
				this.fuel -= this.thrust * 100 / 20;
				this.isThrusting = true;
			} else {
				this.isThrusting = false;
			}

			this.acc.x += (Math.cos(((this.rot)) * Math.PI / 180) * this.thrust * deltaTime);
			this.acc.y += (Math.sin(((this.rot)) * Math.PI / 180) * this.thrust * deltaTime);

			if (landerEvents.left) {
				if (this.rot > -150) {
					this.rot -= 1;
				} else {
					this.rot = -150;
				}
			}

			if (landerEvents.right) {
				if (this.rot < -30) {
					this.rot += 1;
				} else {
					this.rot = -30;
				}
			}


			var padsLen = this.landingPads.length;
			var pads = this.landingPads;

			//this.zoomed=false;

			if (!this.zoomed) {

				for (var i = 0; i < padsLen; i++) {

					dX = (pads[i].x + pads[i].padLength / 2) - this.pos.x;
					dY = pads[i].y - this.pos.y;



					if (Math.sqrt((dX * dX) + (dY * dY)) < 60) {

						this.zoomed = true;

						console.log('Landing pad is now close: ' + Math.sqrt((dX * dX) + (dY * dY)));
						console.log(i);
						//alert("Zooming In");

						state.zoom = 3;
						state.zx = this.pos.x - ((this.screenW / 2) / 3);
						state.zy = (this.pos.y * 2) - 10;

						//Lander.settings.zoom = 3;
						//La/nder.settings.zx = this.pos.x - ((this.screenW / 2)/3);
						//Lander.settings.zy = (this.pos.y * 2) - 10;

						this.acc.x *= 2;
						this.acc.y *= 2;

						this.curPad = i;

						this.terrain.update(3, this.pos.x - ((this.screenW / 2) / 3), (this.pos.y * 2) - 10);
						this.offsetX = this.pos.x - ((this.screenW / 2) / 3);
						this.offsetY = (this.pos.y * 2) - 10;

						this.zX = this.screenW / 2;
						this.zY = this.pos.y * 2;

						this.pos.x = this.zX;
						this.scaler = 0.5;
						break;
					}
				}
			} else {

				dX = ((pads[this.curPad].x - this.offsetX) * 3) - this.pos.x;
				dY = ((pads[this.curPad].y * 3) - this.offsetY + 10) - this.pos.y;


				if (Math.sqrt((dX * dX) + (dY * dY)) > 250) {

					console.log('curpad is: ' + this.curPad)
					console.log(' zooming back out nearest pad is: ' + Math.sqrt((dX * dX) + (dY * dY)));

					this.zoomed = false;

					state.zoom = 1;
					state.zx = 1;
					state.zy = 1;

					this.acc.x *= .5;
					this.acc.y *= .5;

					this.terrain.update(1, 1, 1);
					this.pos.x = pads[this.curPad].x - (((pads[this.curPad].x - this.offsetX) * 3) - this.pos.x) / 3;
					this.pos.y = 10 + (pads[this.curPad].y - (this.offsetY - this.pos.y) / 3);

					this.scaler = 0.2;
					this.curPad = undefined;
				}
			}

			if (!this.checkCollision(this.pos.x - 18 * this.scaler, this.pos.y + (34) * this.scaler)) {
				this.acc.x *= .998;
				this.acc.y *= .995;
				this.vel.x += this.acc.x;

				if (this.zoomed) {
					this.vel.y += this.acc.y + gravity * 2;
				} else {
					this.vel.y += this.acc.y + gravity;
				}

				this.pos = this.vel;

				// Screen bounds check
				if (this.pos.x > this.screenW && !this.zoomed) {
					this.pos.x = 0;
				} else if (this.pos.x < 0 && !this.zoomed) {
					this.pos.x = this.screenW - 10;
				}
				//console.log("No collision - we are on");

			} else {
				// Check if its on one of the pads				
				for (var i = 0; i < padsLen; i++) {
					if (this.pos.x >= ((pads[i].x - this.offsetX) * 3) && this.pos.x <= ((pads[i].x - this.offsetX) * 3) + pads[i].padLength * 3 && this.pos.y > ((pads[i].y * 3) - this.offsetY) - 21) {
						console.log("Yes on the pad");
							if ( true) {
						//if (this.rot > -95 && this.rot < -85 && this.yVel >= -60 && this.yVel <= 60) {
							var score = 0;

							if (this.yVel >= -3 && this.yVel <= 3) {
								score = 500 * pads[i].multiplier - this.elapsedTime * 2;
								this.score += score;
								this.message = "Perfect Landing! " + score + " points scored!";
							} else {
								score = 100 * pads[i].multiplier - this.elapsedTime * 2;
								this.message = "Hard Landing, " + score + " points scored.";
								this.score += score;
							}

							
							this.landed = true;
							// Switch off the thrust ( Might want to take off again!)
							this.thrust=0;
							this.isThrusting=false;
							// I think we drop right out here
							break;
						}
					}
				}

				if (!this.landed) {
					console.log("I have crashed");
					
					for (var lines = 0; lines < 20; lines++) {
						var newLine = [];

						newLine.x1 = this.utilities.getRandomRange(-25, 25);
						newLine.x2 = this.utilities.getRandomRange(-25, 25);
						newLine.y1 = this.utilities.getRandomRange(-25, 25);
						newLine.y2 = this.utilities.getRandomRange(-25, 25);
						newLine.speedX = this.utilities.getRandomRange(-2, 5);
						newLine.speedY = this.utilities.getRandomRange(-2, 5);

						this.expLines.push(newLine);
					}

					this.crashed = true;

					//Lander.message.messageObj.updateMessage("Press Space to Try Again");
					//Lander.settings.beginGame = false;
					this.message = "You just crashed a 100 bazzilion dollar lander!";
					this.vel.y = this.vel.y - 0.1;
					this.pos = this.vel;
				}
			}


			// Set the display values
			this.xVel = Math.round(this.acc.x * 1000) / 10;
			if (this.zoomed) {
				this.yVel = Math.round((this.acc.y / 2 + gravity) * 1000) / 10;
			} else {
				this.yVel = Math.round((this.acc.y + gravity) * 1000) / 10;
			}


		}

	}

	// Checks to see if ship has collided with the terrain
	checkCollision(x, y) {

		var terrainData = this.context;
		var terrainWidth = this.screenW;

		//var terrainData = 0;
		//var terrainWidth = 0;
		var check = 0;

		var imageData;
		var alpha = 0;

		if (this.zoomed) {
			check = 20;
		} else {
			check = 8;
		}
		if (x >= 0 && x <= terrainWidth && y >= 0) {
			imageData = terrainData.getImageData(x, y, check, 2);

			var pxlData = imageData.data;

			for (var i = 0, n = pxlData.length; i < n; i += 4) {
				alpha = imageData.data[i + 3];

				if (alpha !== 0) {
					return true;
				}
			}
		}

		return false;
	}

	// Seperate draw function for the clase instead of the body
	drawCrash(_context) {

		var scaler = this.scaler;
		_context.beginPath();
		_context.translate(this.pos.x, this.pos.y);
		_context.rotate((this.rot + 90) * 0.0174532925);
		_context.strokeStyle = "#fff";

		for (var l = 0; l < this.expLines.length; l++) {
			this.expLines[l].x1 += this.expLines[l].speedX;
			this.expLines[l].y1 += this.expLines[l].speedY;
			this.expLines[l].x2 += this.expLines[l].speedX;
			this.expLines[l].y2 += this.expLines[l].speedY;

			_context.moveTo(this.expLines[l].x1, this.expLines[l].y1);
			_context.lineTo(this.expLines[l].x2, this.expLines[l].y2);

		}
		_context.stroke();
		_context.closePath();

		this.destroy++;
	}

	// Draws the ship body.
	drawBody(_context) {
		var scaler = this.scaler;
		_context.beginPath();
		//this.pos.x = 100;	
		//console.log(this.pos.x);
		//console.log(this.pos.y);

		_context.translate(this.pos.x, this.pos.y);
		_context.rotate((this.rot + 90) * 0.0174532925);

		_context.strokeStyle = "#fff";
		_context.moveTo(-12 * scaler, 0);
		_context.lineTo(0, -10 * scaler);
		_context.lineTo(12 * scaler, 0);
		_context.lineTo(12 * scaler, 12 * scaler);
		_context.lineTo(6 * scaler, 20 * scaler);
		_context.lineTo(-6 * scaler, 20 * scaler);
		_context.lineTo(-12 * scaler, 12 * scaler);
		_context.closePath();

		_context.rect(-14 * scaler, 20 * scaler, 28 * scaler, 4 * scaler);

		_context.moveTo(-14 * scaler, 24 * scaler);
		_context.lineTo(-16 * scaler, 32 * scaler);
		_context.lineTo(-22 * scaler, 32 * scaler);

		_context.moveTo(14 * scaler, 24 * scaler);
		_context.lineTo(16 * scaler, 32 * scaler);
		_context.lineTo(22 * scaler, 32 * scaler);

		_context.moveTo(-4 * scaler, 24 * scaler);
		_context.lineTo(-10 * scaler, 30 * scaler);
		_context.lineTo(10 * scaler, 30 * scaler);
		_context.lineTo(4 * scaler, 24 * scaler);

		if (this.isThrusting) {
			_context.moveTo(-10 * scaler, 30 * scaler);
			_context.lineTo(0 * scaler, ((500 * this.thrust) * scaler * 4) + (this.utilities.getRandomRange(2, 4)) + (30 * scaler));
			_context.lineTo(10 * scaler, 30 * scaler);
		}

		_context.stroke();
		_context.closePath();
	}

	// Draws the ship
	draw(_context) {

		this.elapsedTime = Math.round((this.time - this.startTime) / 1000);
		
		_context.save();
		
		// Draw UI stuff.. should make a UI object
		//_context.drawString('Score : ' + this.score, this.arial12, 10, 10);
		
		// this.setState({
      	//	currentScore: this.score,
    	//});

		var offset = 20;
		
		_context.drawString('Time : ' + this.elapsedTime, this.arial12, offset, 60);
		_context.drawString('Fuel : ' + Math.round(this.fuel * 10) / 10, this.arial12, offset, 80);
		_context.drawString('X Velocity : ' + this.xVel, this.arial12, offset, 100);
		_context.drawString('Y Velocity : ' + this.yVel, this.arial12, offset, 120);
		_context.drawString('Angle : ' + Math.abs(this.rot + 90), this.arial12, offset, 140);
		_context.drawString('Thrust : ' + Math.round(this.thrust * 1000), this.arial12, offset, 160);


		//Debug stuff collision area, and y pos
		/*if(this.zoomed){
			_context.drawString('Angle : ' + this.pos.y + " : " + (((this.landingPads[this.curPad].y * 3) - this.offsetY)-21), arial12,  10, 90);
			_context.fillRect(this.pos.x-9,this.pos.y + (34) * this.scaler,18,2);
		}else{
			_context.fillRect(this.pos.x-18*this.scaler,this.pos.y + (34) * this.scaler,8,2);
		}*/

		if (this.crashed) {
			//_context.drawString(this.message, this.arial12, (this.screenW / 2) - this.message.length * 3, this.screenH / 3);
			//Lander.message.messageObj.updateMessage("Press Space to try again.");
			this.drawCrash(_context);
		} else if (this.landed) {
			//_context.drawString(this.message, this.arial12, (this.screenW / 2) - this.message.length * 3, this.screenH / 3);
			//Lander.message.messageObj.updateMessage("Press Space to Take Off.");
			//Lander.settings.beginGame = false;
			this.thrust = 1;
			this.drawBody(_context);
		} else {
			this.drawBody(_context);
		}

		_context.restore();
	}
}