var servers = {}

module.exports = (message, file, vol) => {
    if (!servers[message.guild.id]) servers[message.guild.id] = {
        queue: []
    }
    var server = servers[message.guild.id]
    if (!message.guild.voiceConnection && message.member.voiceChannel) {
        console.log(`Joining \"${message.guild.name}/${message.member.voiceChannel.name}\" & Playing \"${file}\"`)
        server.queue.push({file: file, vol: (vol || 1)})
        message.member.voiceChannel.join().then(function (connection) {
            qPlay(connection, message)
        })
    }
    else {
        message.guild.channels.forEach(channel => {
            if (channel.type == 'voice' && channel.members.size > 0 && !message.guild.voiceConnection) {
                console.log(`Joining \"${message.guild.name}/${channel.name}\" & Playing \"${file}\"`)
                server.queue.push({file: file, vol: (vol || 1)})
                channel.join().then(function (connection) {
                    qPlay(connection, message)
                })
            }
        })
    }
}

function qPlay(connection, message) {
    var server = servers[message.guild.id]

    server.dispatcher = connection.playFile(server.queue[0].file, {volume: server.queue[0].vol})
    server.queue.shift()

    server.dispatcher.on('end', function() {
        if (server.queue[0]) qPlay(connection, message)
        else connection.disconnect()
    })
}