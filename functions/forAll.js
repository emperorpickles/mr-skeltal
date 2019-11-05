const ffmpeg = require('fluent-ffmpeg')

module.exports = {
    dootAll: function (client, file) {
		console.log('Dooting All')
        let timer = 500
        ffmpeg.ffprobe(file, function(err, metadata) {
            const time = metadata.format.duration * 1000
    
            var visted = new Array()
            client.channels.forEach(async (channel) => {
                if (channel.type == 'voice' && channel.members.size > 0 && visted.includes(channel.id) == false) {
                    setTimeout(async function() {
                        await channel.join().then(async (connection) => {
                            console.log('Joining ' + channel.name + ' & Playing ' + file)
                            let dispatcher = await connection.playFile(file)
                            await dispatcher.on('end', function() {
                                channel.leave()
                            })
                        })
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
