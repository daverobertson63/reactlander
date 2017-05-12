import Vector from './Vector';

export default class VectorP {

	constructor()
    {
		
	}
	
	add(a, b)
	{
		return new Vector( a.x + b.x, a.y + b.y, a.z + b.z );
	}

	sub = function(a, b)
	{
		return new Vector( a.x - b.x, a.y - b.y, a.z - b.z );
	}		

	multiply = function(a, s)
	{
		return new Vector( a.x * s, a.y * s, a.z * s );
	}

	cross = function(a, b)
	{
		return new Vector( a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x );
	}

	dot = function(a, b)
	{
		return a.x * b.x + a.y * b.y + a.z * b.z;
	}
	
}