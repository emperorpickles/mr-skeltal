const ffmpeg = require('fluent-ffmpeg')

module.exports = {
    dootAll: function (client, file) {
		console.log('Dooting All')
        let timer = 500
        // Get length of media file
        ffmpeg.ffprobe(file, function(err, metadata) {
            const time = metadata.format.duration * 1000
            var visted = new Array()

            client.channels.forEach((channel) => {
                if (channel.type == 'voice' && channel.members.size > 0 && visted.includes(channel.id) == false) {
                    setTimeout(function() {
                        channel.join().then((connection) => {
                            console.log(`Joining "${channel.guild}/${channel.name}" & Playing "${file}"`)
                            let dispatcher = connection.playFile(file)
                            dispatcher.on('end', function() {
                                channel.leave()
                            })
                        }).catch(console.error)
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
