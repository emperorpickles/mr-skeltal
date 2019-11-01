require('dotenv').config()

const Discord = require('discord.js')
const client = new Discord.Client()

function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

function play(connection, file) {
	return new Promise(resolve => {
		let dispatcher = connection.playFile(file)
		dispatcher.on('end', function() {
			resolve(true)
		})
	})
}

async function doot() {
	client.channels.forEach(async (channel) => {
		if (channel.type == 'voice' && channel.members.size > 0) {
			try {
				const joined = await channel.join().then(async (connection) => {
					// play(connection, './doot.mp3').then(value => {
					// 	if (value == true) {
					// 		channel.leave()
					// 	}
					// })
					let dispatcher = await connection.playFile('./doot.mp3')
					await dispatcher.on('end', function() {
						channel.leave()
					})
				})
			} catch (err) {
				console.error(err.message)
			}
		}
	})
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
	// doot()
	var handle = setInterval(function() {
		var rand = getRandom(1, 4)
		console.log(rand)
		if (rand == 4) {
			doot()
		}
	}, 1000 * 60 * 15)
})

client.on('message', async msg => {
	if (String(msg.content).indexOf('doot') > -1) {
		doot()
	}
})

// client.on('voiceStateUpdate', (oldMember, newMember) => {
// 	let newUserChannel = newMember.voiceChannel
// 	let oldUserChannel = oldMember.voiceChannel

// 	if (oldUserChannel === undefined && newUserChannel !== undefined) {
// 		// User joined a voice channel
// 		console.log('User joined channel')
// 		var handle = setInterval(function() {
// 			var rand = getRandom(0, 10)
// 			console.log(rand)
// 			if (rand == 10) {
// 				doot()
// 			}
// 		}, 1000)
// 	} else if (newUserChannel === undefined) {
// 		// User left a voice channel
// 		clearInterval(handle)
// 	}
// })

client.login(process.env.BOT_TOKEN_DEV)