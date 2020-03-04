const embed = require('../functions/embed')

// Assign file paths for each possible command argument
const fileRef = [
    { name: 'doot', path: './media/doot.mp3' },
    { name: 'spoopy', path: './media/spooky-scary-skullingtumpets.mp3', vol: 0.2 },
    { name: 'johnnyboi', path: './media/dootcena.mp3'}
]

module.exports = {
    name: 'doot',
    description: 'doot doot',
    async execute(message) {
        const args = message.content.split(' ')
        const command = args[1]
        const queue = message.client.queue
        const serverQueue = message.client.queue.get(message.guild.id)

        // Check if command args are valid
        if (!fileRef.find(o => o.name === command)) return

        // Try to join users voice channel, if not in a channel find random active channel
        var voiceChannel = message.member.voiceChannel
        if (!voiceChannel) {
            voiceChannel = this.findChannel(message)
            if (!voiceChannel) return
        }
        // Check if the bot has permission to join voice channels
        const permissions = voiceChannel.permissionsFor(message.client.user)
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
            return message.channel.send('I need permission to join and speak in your channel!')
        }

        // Create command queue if it doesn't exist, otherwise add command to queue
        if (!serverQueue) {
            const queueConstruct = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                commands: [],
                connection: null,
                playing: true,
            }

            queue.set(message.guild.id, queueConstruct)
            
            queueConstruct.commands.push(command)

            try {
                var connection = await voiceChannel.join()
                queueConstruct.connection = connection
                this.play(message, queueConstruct.commands[0])
            } catch (err) {
                console.log(err)
                queue.delete(message.guild.id)
                return message.channel.send(err)
            }
        } else {
            serverQueue.commands.push(command)
        }
    },
    play(message, command) {
        const queue = message.client.queue
        const guild = message.guild
        const serverQueue = queue.get(message.guild.id)

        const file = fileRef.find(o => o.name === command)

        if (!file) {
            serverQueue.voiceChannel.leave()
            queue.delete(guild.id)
            return
        }

        if (command == 'spoopy') {
            embed(message, 'https://media1.tenor.com/images/a369655bae5b5f8e8de548e631e80d19/tenor.gif?itemid=14585469', 'Let\'s get spoopy ;)')
                .then(msg => { msg.delete(2200 * 60) })
                .catch(console.error)
        }

        const dispatcher = serverQueue.connection.playFile(file.path, {volume: file.vol})
            .on('end', () => {
                console.log(`dooted! (Played "${file.name}" in "${guild}/${message.channel.name}")`)
                serverQueue.commands.shift()
                this.play(message, serverQueue.commands[0])
            })
            .on('error', err => {
                console.error(err)
            })
    },
    findChannel(message) {
        message.guild.channels.forEach(channel => {
            if (channel.type == 'voice' && channel.members.size > 0 && !message.guild.voiceConnection) {
                return channel
            }
        })
    }
}