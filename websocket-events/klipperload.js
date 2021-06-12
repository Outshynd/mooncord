const variables = require('../utils/variablesUtil')

const dcClient = require('../clients/discordclient')

const event = (message, connection, discordClient) => {
  if (message.type === 'utf8') {
    const messageJson = JSON.parse(message.utf8Data)
    if (typeof (messageJson.result) === 'undefined') { return }
    if (typeof (messageJson.result.status) === 'undefined') { return }

    const statusmessage = messageJson.result.status

    if (typeof (statusmessage.configfile) !== 'undefined') {
      loadMCUList(statusmessage.configfile.config)
      return
    }
    if(JSON.stringify(statusmessage).match(/(mcu)/g)) { retrieveMCUStatus(statusmessage) }
  }
}

function loadMCUList(config) {
  variables.clearMCUList()
  Object.keys(config).forEach(key => {
    const mcuconfig = config[key]
    if (key.match(/(mcu)/g) &&
      mcuconfig.serial !== '/tmp/klipper_host_mcu') {
      variables.addToMCUList(key)
    }
  })
  console.log(dcClient)
}

function retrieveMCUStatus(message) {
  variables.clearMCUList()
  Object.keys(message).forEach(key => {
    variables.updateMCUStatus(key, message[key])
  })
}

module.exports = event
