module.exports = (message, url, title) => {
    message.channel.send({ embed: {
        image: { url: url },
        title: title
    }})
}