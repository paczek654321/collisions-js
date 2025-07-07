const canvas = new Canvas(new vec2(10))
let bodies =
[
	new Body(new vec2(1), new vec2(2, 2), "red", SHAPE.rect, new vec2(1, 1)),
	new Body(new vec2(1), new vec2(8, 2), "blue", SHAPE.circle, new vec2(-1, 1)),
	new Body(new vec2(1), new vec2(4.2, 4), "lime", SHAPE.rect),
	new Body(new vec2(1), new vec2(3, 7), "magenta", SHAPE.circle)
]

const fps = 60
setInterval(frame, 1000/fps)

function frame()
{
	for (const body of bodies)
	{
		if (!body.vel.isZero())
		{
			move_and_collide(body)
		}
	}
	canvas.clear()
	for (const body of bodies) { canvas.draw(body) }
}

function rect_circle_collision(rect, circle)
{
	let center = vec2.add(circle.pos, vec2.div(circle.size, 2))
	let closest = new vec2()
			
	closest.x = clamp(center.x, rect.pos.x, rect.pos.x+rect.size.x)
	closest.y = clamp(center.y, rect.pos.y, rect.pos.y+rect.size.y)
	
	let distance = Math.max(circle.size.x/2 - center.distance_to(closest), 0)
	return vec2.mul(distance, center.direction_to(closest))
}

function move_and_collide(body, colliders = [...bodies].remove(bodies.indexOf(body)))
{
	body.pos.add(vec2.div(body.vel, fps))

	for (const collider of colliders)
	{
		if (body.shape === SHAPE.circle && collider.shape === SHAPE.circle)
		{
			let overlap = (body.size.x + collider.size.x) / 2 - body.pos.distance_to(collider.pos)
			if (overlap <= 0) { continue }
			body.pos.sub(vec2.mul(body.pos.direction_to(collider.pos), overlap))
		}
		else if (body.shape === SHAPE.rect && collider.shape === SHAPE.circle)
		{
			let movement = rect_circle_collision(body, collider)
			if (!movement.isZero()) { body.pos.add(movement) }
		}
		else if (body.shape === SHAPE.circle && collider.shape === SHAPE.rect)
		{
			let movement = rect_circle_collision(collider, body)
			if (!movement.isZero()) { body.pos.sub(movement) }
		}
		else if (body.shape === SHAPE.rect && collider.shape === SHAPE.rect)
		{
			let center = vec2.add(collider.pos, vec2.div(collider.size, 2))
			let closest = new vec2
			(
				clamp(center.x, body.pos.x, body.pos.x+body.size.x),
				clamp(center.y, body.pos.y, body.pos.y+body.size.y)
			)

			let direction = center.direction_to(closest)
			let axis = {"x": "x", "y": "y"}
			if (Math.abs(direction.y) > Math.abs(direction.x))
			{
				axis["x"] = "y"
				axis["y"] = "x"
			}

			let a = direction[axis.x] === 0 ? 0 : direction[axis.y]/direction[axis.x]

			let target = new vec2(Math.sign(direction[axis.x])*collider.size[axis.x]/2)
			target[axis.y] *= a

			target.add(center)
			target.add(vec2.sub(body.pos, closest))

			if (center.distance_to(target) > center.distance_to(body.pos))
			{
				body.pos = target
			}
		}
		function wall(axis)
		{
			let bound = clamp(body.pos[axis], 0, canvas.size[axis]-body.size[axis])
			if (bound !== body.pos[axis])
			{
				body.vel[axis] *= -1
				body.pos[axis] = bound
			}
		}
		wall("x"); wall("y")
	}
}