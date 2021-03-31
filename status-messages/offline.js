const { status } = require('../utils')
const { discordClient } = require('../clients')

const getModule = async function (user) {
  discordClient.user.setActivity('wait for Moonraker', { type: 'LISTENING' })

  const statusEmbed = status.getDefaultEmbed(user, 'Connection Lost!', '#c90000')

  return statusEmbed
}
module.exports = getModule
