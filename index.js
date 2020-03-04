require('dotenv').config()

const forAll = require('./functions/forAll')

const fs = require('fs')
const Discord = require('discord.js')
const Client = require('./client/Client')
const DBL = require('dblapi.js')

const client = new Client()
client.commands = new Discord.Collection()

const dbl = new DBL(process.env.TOPGG_TOKEN, client)

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
	const command = require(`./commands/${file}`)
	client.commands.set(command.name, command)
}
console.log(client.commands)

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
	console.log(`Connected to ${client.guilds.size} guilds`)

	setInterval(() => {
		dbl.postStats(client.guilds.size)
	}, 1000 * 60 * 30)

	var handle = setInterval(function() {
		var rand = getRandom(1, 4)
		console.log('Rolled a ' + rand)
		if (rand == 4) {
			forAll.dootAll(client, './media/doot.mp3')
		}
    }, 1000 * 60 * 20)
})

client.on('message', async message => {
	const args = message.content.slice().split(/ +/)
	const commandName = args.shift().toLowerCase()
	const command = client.commands.get(commandName)

	if (message.author.bot || !command) return
	try {
		command.execute(message)
	} catch (err) { console.error(err) }
})

function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

client.login(process.env.BOT_TOKEN)