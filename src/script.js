const MAX_HP = 12

const gel = (id) => document.getElementById(id)

const health = new Health(MAX_HP, 'H')

const inject = (mix) => {
	Object
		.keys(mix)
		.forEach(tag => health.inject(tag, mix[tag] || 1))
	return health.compact
}

const update = (n = 1) => {
	health.react(n)
	health.trim(MAX_HP)
	return health.compact
}

const getBar = (tag) => {
	const bar = gel(tag)
	if (!bar) {
		const newBar = document.createElement('div')
		newBar.classList.add('row')
		newBar.id = tag

		const newIcon = document.createElement('img')
		newIcon.classList.add('icon')
		newIcon.src = `img/${tag}.png`

		const newText = document.createElement('div')
		newText.classList.add('text')

		newBar.appendChild(newIcon)
		newBar.appendChild(newText)
		gel('bar').appendChild(newBar)

		return newBar
	}
	return bar
}

const render = () => {
	const stat = health.compact
	
	// update HP
	const hp = stat.get('H') || 0
	gel('hp').querySelector('.text').textContent = `${hp}/${MAX_HP}`

	// update effects
	EFFECTS
		.filter(tag => tag !== 'H')
		.forEach(tag => {
			const level = stat.get(tag) || 0
			const bar = getBar(tag)
			bar.querySelector('.text').textContent = `${level}`

			if (level > 0) {
				bar.classList.remove('hidden')
			} else {
				bar.classList.add('hidden')
			}
		})
}


const tick = () => {
	update(1)
	render()
}


const addButton = (root, text) => {
	const btn = document.createElement('button')
	btn.textContent = text
	root.appendChild(btn)
	return btn
}

const onApply = (effect) => {
	return () => {
		inject(effect())
		update(0)
		render()
	}
}


{
	const act = gel('act')

	addButton(act, 'Damage: 3-6')
		.onclick = onApply(
			() => ({ 'W': 3 + rnd(4) })
		)
	
	addButton(act, 'Heal: 4-8')
		.onclick = onApply(
			() => ({ 'H': 4 + rnd(5) })
		)
	
	addButton(act, 'Poison: 6')
		.onclick = onApply(
			() => ({ 'P': 6 })
		)

	
	render()
	setInterval(
		tick,
		1000
	)
}