const ffmpeg = require('fluent-ffmpeg')

module.exports = (client, message) => {
    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    console.log(`Logged in as ${client.user.tag}!`)
	var handle = setInterval(function() {
		var rand = getRandom(1, 4)
		console.log(rand)
		if (rand == 4) {
			dootAll('./media/doot.mp3', 1)
		}
    }, 1000 * 60 * 15)

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
}