const lst = (key, times) => Array.apply(null, {length: times}).fill(key)

const BIOCHEM = {
	// health
	'H': [
		...lst('H', 3),
	],

	// wound (it get worse and coud produce an infection)
	'W': [
		...lst('W', 1),
		...lst('I', 3),
		// ...lst('', 1),
	],

	// infection is spreading an can lead to intoxication (duh)
	'I': [
		...lst('W', 1),
		...lst('I', 2),
		...lst('P', 3),
		// ...lst('', 1),
	],

	// and poison just kills you
	'P': [
		...lst('P', 3),
		// ...lst('', 1),
	],
}

const EFFECTS = Object.keys(BIOCHEM)

const rnd = (a) => Math.floor(Math.random() * a)
const pick = (arr = []) => arr[rnd(arr.length)]


class Health {
	constructor(size = 12, init = 'H') {
		this.poll = lst(init, size)
	}

	/**
	 * Compact view
	 */
	get compact() {
		const map = new Map()
		this.poll.forEach(tag => {
			const count = map.get(tag) || 0
			map.set(tag, count + 1)
		})
		return map
	}

	/**
	 * Inject new substance
	 */
	inject(tag, count = 1) {
		for(let i = 0; i < count; i++) {
			this.poll.push(tag)
		}
	}

	/**
	 * Pick a random substance and cause an appropriate effect
	 */
	react(n = 1) {
		for (let i = 0; i < n; i++) {
			const agent = pick(this.poll)
			const outcome = BIOCHEM[agent] || [agent] // fallback to reproducing itself
			this.inject(pick(outcome))
		}

		this.poll = this.poll.filter(tag => !!tag)
	}

	/**
	 * Throwing away excess substances
	 */
	trim(size = 12) {
		if (size > this.poll.length) {
			return
		}

		const map = this
			.poll
			.map(_ => Math.random())
		const index = this
			.poll
			.map((value, index) => index)
		index.sort((a, b) => {
			return map[a] - map[b]
		})
		const chosen = index.slice(0, size)

		this.poll = this.poll.filter((value, index) => chosen.includes(index))
	}
}