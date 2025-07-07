const SHAPE =
{
	rect: 0,
	circle: 1
}
class vec2
{
	constructor(x = 0, y = null)
	{
		this.x = x
		this.y = y !== null ? y : x
	}
	static from_float(value)
	{
		if (typeof value === "object")
		{
			return value
		}
		return new vec2(value)
	}
	isZero()
	{
		return this.x == 0 && this.y == 0
	}
	distance_to(point = new vec2(0))
	{
		return Math.sqrt(Math.pow(this.x - point.x, 2)+Math.pow(this.y - point.y, 2))
	}
	direction_to(point = new vec2(0))
	{
		return vec2.sub(point, this).normalized()
	}
	normalized()
	{
		let distance = this.distance_to()
		if (distance === 0) { distance = 1 }
		return vec2.div(this, distance)
	}
}

(function generate_vector_operators()
{
	let operators =
	{
		"add": (v1, v2) => v1+v2,
		"sub": (v1, v2) => v1-v2,
		"mul": (v1, v2) => v1*v2,
		"div": (v1, v2) => v1/v2
	}
	for (const operator in operators)
	{
		vec2[operator] = function(v1, v2)
		{
			v1 = vec2.from_float(v1)
			v2 = vec2.from_float(v2)
			return new vec2
			(
				operators[operator](v1.x, v2.x),
				operators[operator](v1.y, v2.y)
			)
		}
		vec2.prototype[operator] = function(value)
		{
			value = vec2.from_float(value)
			this.x = operators[operator](this.x, value.x)
			this.y = operators[operator](this.y, value.y)
		}
	}
})()

class Canvas
{
	constructor
	(
		size = new vec2(0)
	)
	{
		this.size = size
		this.cell_size = (Math.floor(Math.min(window.innerHeight, window.innerWidth)-20)/Math.max(size.x, size.y))
		console.log(this.cell_size)

		const html_obj = document.querySelector("canvas")
		html_obj.width = this.cell_size*size.x
		html_obj.height = this.cell_size*size.y

		this.ctx = html_obj.getContext("2d")
	}
	clear()
	{
		this.ctx.fillStyle="#151515"
		this.ctx.fillRect(0, 0, this.size.x*this.cell_size, this.size.y*this.cell_size)
	}

	draw(body = new Body())
	{
		this.ctx.fillStyle = body.color
		if (body.shape === SHAPE.rect)
		{
			this.ctx.fillRect
			(
				body.pos.x*this.cell_size,
				body.pos.y*this.cell_size,
				body.size.x*this.cell_size,
				body.size.y*this.cell_size
			)
		}
		else if (body.shape === SHAPE.circle)
		{
			let radius = body.size.x*this.cell_size/2;
			this.ctx.beginPath();
			this.ctx.arc
			(
				body.pos.x*this.cell_size+radius,
				body.pos.y*this.cell_size+radius,
				radius, 0, Math.PI * 2, true
			);
			this.ctx.fill();
		}
	}
}
class Body
{
	constructor
	(
		size = new vec2(0),
		pos = new vec2(0),
		color = "red",
		shape = SHAPE.rect,
		weight = 1,
		vel = new vec2(0)
	)
	{
		this.size = size
		this.pos = pos
		this.color = color
		this.shape = shape
		this.weight = weight
		this.vel = vel
	}
}