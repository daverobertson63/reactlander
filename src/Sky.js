/*
.

*/
import Utilities from './Utilities';
import Vector from './Vector';

export default class Sky {
	
    constructor(_width, _terrainObj)
    {    
		
		this.utilities = new Utilities();
		this.width = _width;
		this.reset(_terrainObj);
		
			

		console.log('Random:' + this.utilities.getRandomRange(100,200));
	
    }
    
   
    
// public
	// Draws the sky
    draw(state)
    {	
		const _context = state.context;
		_context.save();
		_context.fillStyle = "#fff";
		var starNum = this.stars.length,
		zoom = state.zoom,
		x = state.zx,
		y = state.zy;
			
		for(var star = 0; star < starNum; star++){
			_context.fillRect((this.stars[star].x - x) * zoom, (this.stars[star].y*zoom)-y, this.stars[star].size, this.stars[star].size);
		}
		_context.restore();
    };
	
	reset(_terrain){
		
		var starNum = this.utilities.getRandomRange(100,200);
		let curY = 0;
		let curX = 0;
		let terrainObj = _terrain;
			
		this.stars = [];
		
		for(var star = 0; star < starNum; star++){
			curY = this.utilities.getRandomRange(0,600);
			curX = this.utilities.getRandomRange(0, this.width);
			
			if(curY < terrainObj.y[curX]){
				this.stars.push({x : curX, y :curY, size :1});
			}else{
				star--;
			}
		}
	}
}