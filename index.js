require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

async function doot() {
	let channel = client.channels.forEach(async (channel) => {
		if (channel.type == 'voice' && channel.members.size > 0) {
			await channel.join().then(async (connection) => {
				let dispatcher = await connection.playFile('./doot.mp3');
				await dispatcher.on('end', function() {
					channel.leave();
				});
			});
		}
	});
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	// doot();
	var handle = setInterval(function() {
		var rand = getRandom(0, 10);
		console.log(rand);
		if (rand == 10) {
			doot();
		}
	}, 1000 * 60 * 30);
});

client.on('message', async msg => {
	if (msg.content === 'doot') {
		doot();
	}
});

// client.on('voiceStateUpdate', (oldMember, newMember) => {
// 	let newUserChannel = newMember.voiceChannel;
// 	let oldUserChannel = oldMember.voiceChannel;

// 	if (oldUserChannel === undefined && newUserChannel !== undefined) {
// 		// User joined a voice channel
// 		console.log('User joined channel');
// 		var handle = setInterval(function() {
// 			var rand = getRandom(0, 10);
// 			console.log(rand);
// 			if (rand == 10) {
// 				doot();
// 			}
// 		}, 1000);
// 	} else if (newUserChannel === undefined) {
// 		// User left a voice channel
// 		clearInterval(handle);
// 	}
// });

client.login(process.env.BOT_TOKEN);