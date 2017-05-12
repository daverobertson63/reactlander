/*


*/

import Utilities from './Utilities';
import Vector from './Vector';
import Message from './Message';

import { rotatePoint, randomNumBetween } from './helpers';
export default class Terrain {

	
    constructor(state,terrainLength, height, power,messages)
    {    
		this.utilities = new Utilities();	
	
		// hopefully this works
		this.messages = messages;
		this.width = terrainLength;
		this.height = height;
		
		this.y = [];
		this.displacement = 180;
		this.landingPads = [];
		this.power = power;
		this.terrainLength = terrainLength;
		this.blinkTime = 500;
		this.lastBlinkTime = 0;

		this.uX = 0;
		this.uY=0;
		this.zoom=1;
		//this.messages = [];
		
		this.y[0] = 450;
		this.y[this.power] = 450;
		
		for(var i = 1; i<power; i*=2){
			for(var j = (power/i)/2; j <power; j+=power/i){
				this.y[j] = ((this.y[j - (power/i)/2] + this.y[j + (power/i)/2]) / 2) + this.utilities.getRandomRange(-this.displacement, this.displacement);
			}
			this.displacement *= 0.7;
		}
		
		this.createLandingPads(200, 30);

// Canvas Font generated by Benjamin Joffe at http://random.abrahamjoffe.com.au/public/JavaScripts/canvas/fontGenerator.htm
		this.arial12=new Image();
		this.arial12.src='data:image/png;base64,' +
		'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' +
		'SGGknosAAAAASUVORK5CYII='; // paste your data url string here
	this.arial12.c='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789!@#$%^&*()-=[]\\;\',./_+{}|:"<>?`~';
	this.arial12.w=[9,9,8,9,9,4,9,8,4,3,8,3,13,8,9,9,9,5,8,4,8,7,11,7,7,7,11,11,12,12,11,10,12,11,3,8,11,9,13,11,12,11,12,11,11,9,11,11,15,11,9,9,4,9,9,9,9,9,9,9,9,9,9,5,16,9,9,14,7,11,6,5,5,5,9,4,4,4,4,3,4,4,4,9,9,5,5,3,4,6,9,9,9,5,9];
	this.arial12.h=19;


    }
    
    
    
// public
	update(zoom,x,y)
	{
		this.zoom = zoom;
		this.uX=x;
		this.uY=y;

	}


	// Draws the terrain
    draw(state)
    {	
		const context = state.context;
		context.save();
		context.clearRect(0,0,this.width,this.height);
		context.strokeStyle = "#fff";
		context.lineWidth = 1;
					
		context.beginPath();
		
			for(var i = 0; i<=this.width; i+=3){
				if(i === 0){
					context.moveTo(0, this.y[0] * this.zoom);
				}else if(this.y[i] !== undefined){
					context.lineTo((i - this.uX) * this.zoom, (this.y[i] * this.zoom) - this.uY );
				}
			}
					
		context.stroke();
		
		var points = 0;
		
		//for(var i = 0; i < this.messages.length; i++){
	//		Lander.removeEntity(this.messages[i]);
	//	}
		
	//	this.messages = [];
		
		for(var i = 0; i < this.landingPads.length; i++){
			
			if(this.landingPads[i].padLength === 10){
				this.landingPads[i].multiplier = 5;
				points = 5;
			}else if(this.landingPads[i].padLength > 10 && this.landingPads[i].padLength <= 20){
				this.landingPads[i].multiplier = 3;
				points = 3;
			}else{
				this.landingPads[i].multiplier = 1;
				points = 1;
			}
			
			//var mesObj = new Message({message : points + 'x', x : ((this.landingPads[i].x + this.landingPads[i].padLength/2)- x) * zoom, y : (this.landingPads[i].y * zoom) - y + 10, font : this.arial12, type : 2, blinkTime : 500});
			
			//this.messages.push(mesObj);
		}
	
		context.restore();
    };
	
	// Change the level
	nextLevel(level){
		var maxPadLength = 30,
			power = this.power,
			terrainLength = this.terrainLength;
			
		if(level < 5){
			maxPadLength -= 5 * level;
		}
		
		this.y = [];
		this.displacement = 180;
		this.landingPads = [];
		
		this.y[0] = 400;
		this.y[power] = 400;
		
		for(var i = 1; i<power; i*=2){
			for(var j = (power/i)/2; j <power; j+=power/i){
				this.y[j] = ((this.y[j - (power/i)/2] + this.y[j + (power/i)/2]) / 2) + this.utilities.getRandomRange(-this.displacement, this.displacement);
			}
			this.displacement *= 0.7;
		}
		
		this.createLandingPads(200, maxPadLength);
	}
	
	//make some landing pads
	createLandingPads(minDistance, maxPadLength){
		var maxPads = parseInt(this.terrainLength/minDistance);
		
		for(var j = 0; j < maxPads; j++){
			
			var padCheck = false,
				padX = parseInt(this.utilities.getRandomRange(minDistance * j, (minDistance * j) + minDistance)),
				padLength = Math.round(parseInt(this.utilities.getRandomRange(10,maxPadLength) /10) * 10);

			if(j > 0){
				while(padCheck === false){
					for(var p = 0; p < this.landingPads.length; p++){
							if(Math.abs(padX - this.landingPads[p].x) < 40 || (padX + padLength) > this.terrainLength){
								padX = parseInt(this.utilities.getRandomRange(minDistance * j, minDistance * j + minDistance));
								padLength = Math.round(parseInt(this.utilities.getRandomRange(10,30) /10) * 10);
								padCheck = false;
								break;
							}else{
								padCheck = true;
							}
					}
				}
			}
			
			var	pad = Math.round(this.y[padX-1])+20;
			
			this.landingPads.push({x : padX, y :  pad, padLength : padLength});
			
			for(var i = padX-2; i <= (padX + padLength)+2; i++){
					this.y[i] = pad;
			}
		}
	}
	
	// Scrolls the terrain not implemented within the game
	scroll(dir)
    {	
		var i = 0;
		if(Math.abs(dir)=== dir){
			for(i = 0; i<dir; i++){
				this.y.push(this.y.shift());
			}
		}else{
			for(i = 0; i<Math.abs(dir); i++){
				this.y.unshift(this.y.pop());
			}
		}
		
		this.draw(1,1,1);
    }
}