const addChannel = require("./addchannel")
const config = require('../config.json')

var executeCommands = (function(command,channel,user,discordClient,discordDataBase,prefix){
    if(command.toLowerCase().startsWith(addChannel.getCommand())){
        if(!isAdmin(user)){
            channel.send("<@"+user.id+"> You are not allowed to execute the following Command! \n> "+prefix+addChannel.getCommand())
            return;
        }
        channel.send("<@"+user.id+"> WIP Command! \n> "+prefix+addChannel.getCommand())
        return;
    }
    channel.send("<@"+user.id+"> The following Command couldn´t be found! \n> "+prefix+addChannel.getCommand()+"\n use "+prefix+"help")
})
module.exports = executeCommands;

function isAdmin(user){
    if(user.id==config.masterid){
        return true
    }

    return false
}