const doot = require('../commands/doot')
const embed = require('../commands/embed')

module.exports = (client, message) => {
    if (message.author.bot) return

	const command = String(message.content).toLowerCase()

	if (command.includes('doot')) {
        return doot(message, './media/doot.mp3')
    }
    else if (command.includes('johnnyboi')) {
        return doot(message, './media/dootcena.mp3')
    }
    else if (command.includes('spoopy')) {
        embed(message, 'https://media1.tenor.com/images/a369655bae5b5f8e8de548e631e80d19/tenor.gif?itemid=14585469', 'Let\'s get spoopy ;)')
        return doot(message, './media/spooky-scary-skullingtumpets.mp3', 0.2)
    }
}