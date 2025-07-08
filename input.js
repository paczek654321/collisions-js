addEventListener("keydown", keydown)
addEventListener("keyup", keyup)
let inputs = {"KeyW": 0, "KeyS": 0, "KeyA": 0, "KeyD": 0}
function keydown(event)
{
	if (Object.keys(inputs).includes(event.code)) {inputs[event.code]=1}
}
function keyup(event)
{
	if (Object.keys(inputs).includes(event.code)) {inputs[event.code]=0}
}
function track_key(code)
{
	inputs[code] = 0
}