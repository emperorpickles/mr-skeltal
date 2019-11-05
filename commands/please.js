module.exports = {
    name: 'please',
    description: 'Handles stopping queue and leaving channels',
    async execute(message) {
        const args = message.content.split(' ')
        const serverQueue = message.client.queue.get(message.guild.id)
        
        if (!message.member.voiceChannel) {
            return message.reply('You have to be in a voice channel')
        }
        else if (args[1] === 'leave') {
            try {
                serverQueue.commands = []
                serverQueue.connection.dispatcher.end()
            } catch (err) { console.error(err) }

            try {
                await message.channel.fetchMessages().then(messages => {
                    const selfMessages = messages.filter(msg => msg.author.bot && msg.author.username.includes('Mr. Skeltal'))
                    message.channel.bulkDelete(selfMessages)
                })
                await message.reply('Your loss, friendo')
                    .then(msg => { msg.delete(2500) })
            } catch (err) {
                console.error(err)
                message.channel.send('I don\'t have permission to delete some messages!')
            }
        }
    }
}