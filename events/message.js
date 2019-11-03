const doot = require('../commands/doot')
const embed = require('../commands/embed')

const talkedRecently = new Set()

module.exports = (client, message) => {
    const command = String(message.content).toLowerCase()

    if (message.author.bot) return
    // else if (!message.member.voiceChannel) {
    //     message.reply('You need to be in a voice channel :(')
    // }
	else if (command.includes('doot')) {
        return doot(message, './media/doot.mp3')
    }
    else if (command.includes('johnnyboi')) {
        if (talkedRecently.has(message.author.id)) {
            message.reply('No')
        } else {
            talkedRecently.add(message.author.id)
            setTimeout(() => {
                talkedRecently.delete(message.author.id)
            }, 1000 * 60 * 5)
            return doot(message, './media/dootcena.mp3')
        }
    }
    else if (command.includes('spoopy')) {
        embed(message, 'https://media1.tenor.com/images/a369655bae5b5f8e8de548e631e80d19/tenor.gif?itemid=14585469', 'Let\'s get spoopy ;)')
            .then(msg => { msg.delete(2200 * 60) })
        return doot(message, './media/spooky-scary-skullingtumpets.mp3', 0.2)
    }
}