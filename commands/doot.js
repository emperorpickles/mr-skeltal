var servers = {}

module.exports = (message, file, vol) => {
    if (!servers[message.guild.id]) servers[message.guild.id] = {
        queue: []
    }
    var server = servers[message.guild.id]
    server.queue.push({file: file, vol: (vol || 1)})
    if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function (connection) {
        qPlay(connection, message)
    })
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