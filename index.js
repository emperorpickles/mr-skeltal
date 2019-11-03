require('dotenv').config()

const Discord = require('discord.js')
const client = new Discord.Client()
var ffmpeg = require('fluent-ffmpeg')

function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

async function play(channel, file, vol) {
	await channel.join().then(async (connection) => {
		console.log('Joining ' + channel.name + ' & Playing ' + file)
		let dispatcher = await connection.playFile(file, {volume: vol})
		await dispatcher.on('end', function() {
			channel.leave()
		})
	})
}

async function doot(file, vol) {
	let timer = 500
	ffmpeg.ffprobe(file, function(err, metadata) {
		const time = metadata.format.duration * 1000

		var visted = new Array()
		client.channels.forEach(async (channel) => {
			if (channel.type == 'voice' && channel.members.size > 0 && visted.includes(channel.id) == false) {
				setTimeout(function() {
					play(channel, file, vol)
				}, timer)
				timer = timer + time
			}
			visted.push(channel.id)
		})
		setTimeout(function() {
			console.log('Broadcast finished')
		}, timer)
	})
	
	// var visted = new Array()
	// client.channels.forEach(async channel => {
	// 	if (channel.type == 'voice' && channel.members.size > 0 && visted.includes(channel.id) == false) {
	// 		console.log('Joining ' + channel.name)
	// 		await channel.join().then(async connection => {
	// 			const dispatcher = await connection.playFile(file, {volume: vol})
	// 			await dispatcher.on('end', async function() {
	// 				dispatcher.end()
	// 				// await connection.disconnect()
	// 			})
	// 		}).catch (err => {
	// 			console.error(err)
	// 		})
	// 	}
	// 	visted.push(channel.id)
	// })
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
	// doot()
	var handle = setInterval(function() {
		var rand = getRandom(1, 4)
		console.log(rand)
		if (rand == 4) {
			doot('./doot.mp3', 1)
		}
	}, 1000 * 60 * 15)
})

client.on('message', async msg => {
	var content = String(msg.content).toLowerCase()
	if (msg.author.bot == true) {
		content = 'bot'
	}
	if (content.indexOf('doot') > -1) {
		msg.channel.send('Doot!')
		await doot('./doot.mp3', 1)
	}
	else if (content.indexOf('johnnyboi') > -1) {
		msg.reply('DOOT DOOT!')
		await doot('./dootcena.mp3', 1)
	}
	else if (content.indexOf('spoopy') > -1) {
		msg.channel.send({ embed: {
			image: { url: 'https://media1.tenor.com/images/a369655bae5b5f8e8de548e631e80d19/tenor.gif?itemid=14585469' }
		}})
		await doot('./spooky-scary-skullingtumpets.mp3', 0.2)
	}
})

client.login(process.env.BOT_TOKEN)