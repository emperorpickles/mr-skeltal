module.exports = (message, url, title) => {
    return message.channel.send({ embed: {
        image: { url: url },
        title: title
    }})
}