require('dotenv').config()

const Discord = require('discord.js')
const client = new Discord.Client()

function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

async function doot(file) {
	var visted = new Array()
	await client.channels.forEach(channel => {
		if (channel.type == 'voice' && channel.members.size > 0 && visted.includes(channel.id) == false) {
			console.log('Joining ' + channel.name)
			channel.join().then(async connection => {
				const dispatcher = await connection.playFile(file)
				await dispatcher.on('end', async function() {
					await channel.leave()
				})
			}).catch (err => {
				console.error(err)
			})
		}
		visted.push(channel.id)
	})
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
	// doot()
	var handle = setInterval(function() {
		var rand = getRandom(1, 4)
		console.log(rand)
		if (rand == 4) {
			doot('./doot.mp3')
		}
	}, 1000 * 60 * 15)
})

client.on('message', async msg => {
	if (String(msg.content).indexOf('doot') > -1) {
		doot('./doot.mp3')
	}
	else if (String(msg.content).indexOf('johnnyboi') > -1) {
		doot('./dootcena.mp3')
	}
	else if (String(msg.content).indexOf('spoopy') > -1) {
		doot('./spooky-scary-skullingtumpets.mp3')
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

client.login(process.env.BOT_TOKEN)