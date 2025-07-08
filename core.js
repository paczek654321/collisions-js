let canvas
let bodies = []
let fps

function start_game(canvas_size = new vec2(), _fps = 60)
{
	fps = _fps
	canvas = new Canvas(canvas_size)
	setInterval(frame, 1000/fps)
}

function frame()
{
	for (const body of bodies)
	{
		body.onFrame(body)
		if (!body.vel.isZero()) { move_and_collide(body) }
	}
	canvas.clear()
	for (const body of bodies)
	{	
		canvas.draw(body)
	}
}