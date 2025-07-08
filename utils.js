Array.prototype.remove = function(idx)
{
	this.splice(idx, 1)
	return this
}
function clamp(value, min, max)
{
	if (value < min) { value = min }
	else if (value > max) { value = max }
	return value
}
function flip_vector(vector, normal)
{
	let dot = vector.x*normal.x+vector.y*normal.y
	return vec2.sub(vector, vec2.mul(2*dot, normal))
}