const logSymbols = require('log-symbols')
const { SlashCommandBuilder } = require('@discordjs/builders');

const database = require('../../utils/databaseUtil')
const locale = require('../../utils/localeUtil')
const permission = require('../../utils/permissionUtil')

const messageLocale = locale.commands.admin
const syntaxLocale = locale.syntaxlocale.commands.admin

module.exports.command = () => {
    const command = new SlashCommandBuilder()
        .setName(syntaxLocale.command)
        .setDescription(messageLocale.description)
        .addSubcommand(subcommand =>
            subcommand.setName(syntaxLocale.options.role.name)
                .setDescription(messageLocale.options.role.description)
                .addRoleOption(roleOption =>
                    roleOption.setName(syntaxLocale.options.role.options.role.name)
                        .setDescription(messageLocale.options.role.options.role.description)
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName(syntaxLocale.options.user.name)
                .setDescription(messageLocale.options.user.description)
                .addUserOption(userOption =>
                    userOption.setName(syntaxLocale.options.user.options.user.name)
                        .setDescription(messageLocale.options.user.options.user.description)
                        .setRequired(true)))
    console.log(command.toJSON())
    return command.toJSON()
}

module.exports.reply = async (interaction) => {
    try {
        if (typeof (interaction.guildId) === 'undefined') {
            await interaction.reply(locale.getGuildOnlyError(interaction.user.username))
            return
        }
        
        if (!permission.hasController(interaction.user)) {
            await interaction.reply(locale.getControllerOnlyError(interaction.user.username))
            return
        }

        let isRole
        let adminid

        if (interaction.options.getSubcommand() === syntaxLocale.options.role.name) {
            isRole = true
            adminid = interaction.options.getRole(syntaxLocale.options.role.options.role.name)
        }

        if (interaction.options.getSubcommand() === syntaxLocale.options.user.name) {
            isRole = false
            adminid = interaction.options.getUser(syntaxLocale.options.user.options.user.name)
        }

        const result = await editAdmin(isRole, adminid, interaction.guildId)

        let answermention = `<@${adminid}>`

        if (isRole) {
            answermention = answermention.replace(/<@/g,'<@&')
        }

        if (result) {
            await interact.reply(messageLocale.answer.added
                .replace(/(\${username})/g, interaction.user.username)
                .replace(/(\${mention})/g, answermention))
        } 

        await interact.reply(messageLocale.answer.removed
            .replace(/(\${username})/g, interaction.user.username)
            .replace(/(\${mention})/g, answermention))
        
    } catch (error) {
        console.log(logSymbols.error, `Admin Command: ${error}`.error)
        await interaction.reply(locale.errors.command_failed)
    }
}