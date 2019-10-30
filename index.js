require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
	if (msg.content === 'ping') {
		if (msg.member.voiceChannel) {
			var voiceChannel = msg.member.voiceChannel;
			voiceChannel.join().then(connection => {
				const dispatcher = connection.playFile('./doot.mp3');
				dispatcher.on('end', end => {
					voiceChannel.leave()
				})
			}).catch(err => console.log(err));
		} else {
			msg.reply('You need to be in a voice channel first!');
		}
	}
});

client.login(process.env.BOT_TOKEN);