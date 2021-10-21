import commandStructure from '../meta/command_structure.json'
import commandOptionsTypes from '../meta/command_option_types.json'
import {getEntry, setData} from "../utils/CacheUtil";
import {LocaleHelper} from "../helper/LocaleHelper";

export class DiscordCommandGenerator {
    protected localeHelper = new LocaleHelper()

    public getCommands() {
        const commandList = []
        const commandCache = {}

        for (const commandIndex in commandStructure) {
            const command = this.buildCommand(commandIndex)
            commandList.push(command)
            commandCache[commandIndex] = command
        }

        setData('commands', commandCache)
        return commandList
    }

    public getCommandId(command:string) {
        const commandCache = getEntry('commands')

        for(const commandId in commandCache) {
            const commandData = commandCache[commandId]

            if(commandData.name === command) { return commandId}
        }
    }

    protected buildCommand(command:string) {
        const messageLocale = this.localeHelper.getLocale().commands[command]
        const syntaxLocale = this.localeHelper.getSyntaxLocale().commands[command]

        const builder = {
            name: syntaxLocale.command,
            description: messageLocale.description,
            options: []
        }

        for(const index in commandStructure[command]) {
            this.buildCommandOption(
                builder,
                commandStructure[command],
                index,
                syntaxLocale,
                messageLocale)
        }

        return builder
    }

    protected buildCommandOption(builder:any, meta:any, option:any, syntaxMeta:any, messageMeta:any) {
        if (typeof(meta) === 'undefined') { return }

        const optionMeta = meta[option]

        if (typeof(optionMeta) === 'undefined') { return }
        if (Object.keys(optionMeta).length === 0) { return }

        const optionBuilder = {
            type: commandOptionsTypes[optionMeta.type],
            name: syntaxMeta.options[option].name,
            description: messageMeta.options[option].description,
            options: [],
            required: false,
            choices: []
        }

        optionBuilder.required = optionMeta.required

        if (typeof (optionMeta.choices) !== 'undefined') {
            if (optionMeta.choices === '${systemInfoChoices}') {
                optionBuilder.choices = this.localeHelper.getSystemComponents()
            } else {
                optionBuilder.choices = optionMeta.choices
            }
        }

        for(const index in meta[option].options) {
            this.buildCommandOption(
                optionBuilder,
                meta[option].options,
                index,
                syntaxMeta.options[option],
                messageMeta.options[option])
        }

        builder.options.push(optionBuilder)
    }
}