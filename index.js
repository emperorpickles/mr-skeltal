require('dotenv').config()

const forAll = require('./functions/forAll')

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
			forAll.dootAll(client, './media/doot.mp3')
		}
    }, 1000 * 60 * 15)
})

client.on('message', async message => {
	const args = message.content.slice().split(/ +/)
	const commandName = args.shift().toLowerCase()
	const command = client.commands.get(commandName)

<<<<<<< HEAD
	if (message.author.bot || !command) return
=======
	if (message.author.bot) return
>>>>>>> ae509eb9b73918e0966dc59d8472181636d4dea1
	try {
		command.execute(message)
	} catch (err) { console.error(err) }
})

function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

client.login(process.env.BOT_TOKEN)