
/*
	Utilities class for some operations

*/
export default class Utilities {
  
  constructor() {
    //console.log('In Utilities');
  }

	getRandomRange(_min, _max) {   
		return Math.floor(Math.random()*_max+_min);
	}
	
	getDistance(a, b) {
		return Math.sqrt(((b.globalX + b.width/2)-a.x)*((b.globalX + b.width/2)-a.x)+((b.globalY + b.height/2)-a.y)*((b.globalY + b.height/2)-a.y));
	}
	
	dot(a, b)
	{
		return a.x * b.x + a.y * b.y + a.z * b.z;
	}
	
}