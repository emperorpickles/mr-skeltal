require('dotenv').config()
const ffmpeg = require('fluent-ffmpeg')

const fs = require('fs')
const Discord = require('discord.js')
const Client = require('./client/Client')

const client = new Client()
client.commands = new Discord.Collection()

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
	const command = require(`./commands/${file}`)
	client.commands.set(command.name, command)
}
console.log(client.commands)

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
	var handle = setInterval(function() {
		var rand = getRandom(1, 4)
		console.log('Rolled a ' + rand)
		if (rand == 4) {
			dootAll('./media/doot.mp3', 1)
		}
    }, 2000 * 60 * 15)
})

client.on('message', async message => {
	const args = message.content.slice().split(/ +/)
	const commandName = args.shift().toLowerCase()
	const command = client.commands.get(commandName)

	if (message.author.bot) return
	try {
		command.execute(message)
	} catch (err) { console.error(err) }
})

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

async function dootAll(file, vol) {
	console.log('Dooting All')
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
			console.log('Doots finished')
		}, timer)
	})
}

client.login(process.env.BOT_TOKEN)