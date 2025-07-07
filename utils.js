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