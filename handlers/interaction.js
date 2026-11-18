const { MessageFlags } = require("discord.js");
const logger = require("../utils/logger");
const { error } = require("../utils/embed");

function sourceCommandName(interaction) {
  return interaction.message?.interaction?.commandName ||
    interaction.message?.interactionMetadata?.name ||
    null;
}

async function replyPrivately(interaction, content) {
  const payload = { content, flags: MessageFlags.Ephemeral };
  if (interaction.deferred || interaction.replied) return interaction.followUp(payload).catch(() => {});
  return interaction.reply(payload).catch(() => {});
}

async function handleInteraction(client, interaction) {
  try {
    if (interaction.isChatInputCommand()) {
      const command = client.slashCommands.get(interaction.commandName);
      if (!command) {
        return interaction.reply({
          embeds: [error("Unknown command", "This slash command is not registered.")],
          flags: MessageFlags.Ephemeral,
        });
      }
      try {
        await command.execute(interaction, client);
      } catch (commandError) {
        logger.error("Error in /" + interaction.commandName + ":", commandError);
        const payload = {
          embeds: [error("Command Error", String(commandError.message || "Unknown error").slice(0, 900))],
          flags: MessageFlags.Ephemeral,
        };
        if (interaction.replied || interaction.deferred) await interaction.editReply(payload).catch(() => {});
        else await interaction.reply(payload).catch(() => {});
      }
      return;
    }

    if (interaction.isButton()) {
      if (interaction.customId === "verify_btn") {
        const { handleVerify } = require("./verify");
        return handleVerify(interaction, client);
      }
      const command = client.slashCommands.get(sourceCommandName(interaction));
      if (command?.button) return command.button(interaction, client);
      return replyPrivately(interaction, "This button is no longer active.");
    }

    if (interaction.isStringSelectMenu()) {
      const command = client.slashCommands.get(sourceCommandName(interaction));
      if (command?.select) return command.select(interaction, client);
      return replyPrivately(interaction, "This selection menu is no longer active.");
    }

    if (interaction.isModalSubmit()) {
      const commandName = String(interaction.customId || "").split(":")[0];
      const command = client.slashCommands.get(commandName);
      if (command?.modal) return command.modal(interaction, client);
      return replyPrivately(interaction, "This form is no longer active.");
    }
  } catch (interactionError) {
    logger.error("Interaction routing error:", interactionError);
    await replyPrivately(interaction, "The interaction could not be completed. Please try again.");
  }
}

module.exports = { handleInteraction };
