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
            // Clear the current command queue and leave active voice channel
            try {
                if (serverQueue) {
                    serverQueue.commands = []
                    serverQueue.connection.dispatcher.end()
                    console.log(`Asked to leave "${message.guild}/${message.channel.name}"`)
                }
            } catch (err) { console.error(err) }

            // Delete any messages from bot and then say goodbye
            try {
                await message.channel.fetchMessages().then(messages => {
                    const selfMessages = messages.filter(msg => msg.author.bot && msg.author.username.includes('Mr. Skeltal'))
                    message.channel.bulkDelete(selfMessages)
                }).catch(console.error)
                await message.reply('Your loss, friendo')
                    .then(msg => { msg.delete(2500) })
                    .catch(console.error)
            } catch (err) {
                console.error(err)
                message.channel.send('I don\'t have permission to delete some messages!')
            }
        }
        else return
    }
}