const { status, thumbnail, variables } = require('../utils')
const { discordClient } = require('../clients')

const getModule = async function (user) {
  discordClient.user.setActivity(`start: ${variables.getCurrentFile()}`, { type: 'LISTENING' })

  const thumbnailpic = await thumbnail.retrieveThumbnail()

  const statusEmbed = status.getDefaultEmbed(user, 'Print started', '#25db00')
  statusEmbed
    .setAuthor(variables.getCurrentFile())
    .addField('Print Time', variables.getFormatedPrintTime(), true)
    .attachFiles([thumbnailpic])
    .setThumbnail(`attachment://${thumbnailpic.name}`)
  
  return statusEmbed
}
module.exports = getModule
