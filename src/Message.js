/*

*/

import Utilities from './Utilities';
import Vector from './Vector';
import Lander from './Lander';

export default class Message {

	
	
    Message(options)
    {
		// Required options
		this.utilities = new Utilities();	
		this.message = options.message;
		this.pos = new Vector(options.x,options.y,0);
		this.font = options.font;
		this.type = 1;
		this.visible = 1;
		
		if(options.type){
			this.type = options.type;
		}
		
		if(this.type === 2 && options.blinkTime){
			this.lastBlinkTime = 0;
			this.blinkTime = options.blinkTime;
		}
	}
    
   
    update(deltaTime){
		var curTime = (new Date()).getTime();

		if(this.type === 2 && curTime > this.lastBlinkTime + this.blinkTime){
			this.lastBlinkTime = curTime;
			this.visible = Math.abs(this.visible) - 1;
		}
	}
	
	 updateMessage(message){
		this.message = message;
	}
	
    render(_context)
    {	
		if(this.visible){
			_context.save();
			_context.drawString(this.message,  this.font, this.pos.x, this.pos.y);
			_context.restore();
		}
    }
}