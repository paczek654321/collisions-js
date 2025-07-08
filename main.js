bodies.push
(
	new Body(new vec2(1), new vec2(2, 2), "red", SHAPE.rect, 1, new vec2(5, 5)),
	new Body(new vec2(1), new vec2(8, 2), "blue", SHAPE.circle, 1, new vec2(-5, 5)),
	new Body(new vec2(1), new vec2(4.2, 4), "lime", SHAPE.rect, 1, new vec2(5)),
	new Body(new vec2(1), new vec2(3, 7), "magenta", SHAPE.circle, 1, new vec2(5))
)
bodies[0].onFrame = (body) =>
{
	body.vel.x += (inputs["KeyD"]-inputs["KeyA"])*0.25
	body.vel.y += (inputs["KeyS"]-inputs["KeyW"])*0.25
}

track_key("KeyW")
track_key("KeyS")
track_key("KeyA")
track_key("KeyD")

start_game(new vec2(10))