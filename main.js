const canvas = new Canvas(new vec2(10))
let bodies =
[
	new Body(new vec2(1), new vec2(2, 2), "red", SHAPE.rect, 1, new vec2(5, 5)),
	new Body(new vec2(1), new vec2(8, 2), "blue", SHAPE.circle, 1, new vec2(-5, 5)),
	new Body(new vec2(1), new vec2(4.2, 4), "lime", SHAPE.rect, 1, new vec2(5)),
	new Body(new vec2(1), new vec2(3, 7), "magenta", SHAPE.circle, 1, new vec2(5))
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
	return [vec2.mul(distance, center.direction_to(closest)), circle.pos.direction_to(closest)]
}

function apply_collision(offset, normal, body, collider)
{
	let ratio = body.weight/(body.weight+collider.weight)
	body.pos.add(vec2.mul(offset, 1-ratio))
	collider.pos.sub(vec2.mul(offset, ratio))
	ratio = 0.5
	collider.vel.add(vec2.div(vec2.mul((1-ratio)*body.weight, body.vel), collider.weight))//
	body.vel = flip_vector(vec2.mul(body.vel, ratio), normal)
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
			apply_collision(vec2.mul(body.pos.direction_to(collider.pos), -overlap), vec2.sub(body.pos, collider.pos).normalized(), body, collider)
		}
		else if (body.shape === SHAPE.rect && collider.shape === SHAPE.circle)
		{
			let [movement, normal] = rect_circle_collision(body, collider)
			if (!movement.isZero()) { apply_collision(movement, normal, body, collider) }
		}
		else if (body.shape === SHAPE.circle && collider.shape === SHAPE.rect)
		{
			let [movement, normal] = rect_circle_collision(collider, body)
			if (!movement.isZero()) { apply_collision(vec2.mul(movement, -1), vec2.mul(normal, -1), body, collider) }
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
				let normal = new vec2(0)
				if (direction.x === direction.y)
				{
					normal = new vec2(Math.sign(direction.x), Math.sign(direction.y)).normalized()
				}
				else if (direction.x > direction.y)
				{
					normal.x = Math.sign(direction.x)
				}
				else
				{
					normal.y = Math.sign(direction.y)
				}
				apply_collision(vec2.sub(target, body.pos), normal, body, collider)
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