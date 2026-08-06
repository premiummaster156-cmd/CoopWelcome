const logger = require("../utils/logger");
const { error } = require("../utils/embed");

async function handleInteraction(client, interaction) {
  try {
    if (interaction.isChatInputCommand()) {
      const cmd = client.slashCommands.get(interaction.commandName);
      if (!cmd) return interaction.reply({ embeds: [error("Unknown", "Command not registered.")], ephemeral: true });
      try {
        await cmd.execute(interaction, client);
      } catch (err) {
        logger.error(`Error in /${interaction.commandName}:`, err);
        const reply = { embeds: [error("Error", "Something went wrong.\n```\n" + (err.message || "") + "\n```")], ephemeral: true };
        if (interaction.replied || interaction.deferred) await interaction.editReply(reply).catch(() => {});
        else await interaction.reply(reply).catch(() => {});
      }
      return;
    }
    if (interaction.isButton()) {
      const handler = client.slashCommands.get(interaction.message.interaction?.commandName);
      if (handler && handler.button) return handler.button(interaction, client);
      // Handle verification button by customId
      if (interaction.customId === "verify_btn") {
        const { handleVerify } = require("./verify");
        return handleVerify(interaction, client);
      }
      return interaction.reply({ content: "No handler.", ephemeral: true });
    }
    if (interaction.isStringSelectMenu()) {
      const handler = client.slashCommands.get(interaction.message.interaction?.commandName);
      if (handler && handler.select) return handler.select(interaction, client);
      return interaction.reply({ content: "No handler.", ephemeral: true });
    }
    if (interaction.isModalSubmit()) {
      const handler = client.slashCommands.get(interaction.customId.split(":")[0]);
      if (handler && handler.modal) return handler.modal(interaction, client);
      return interaction.reply({ content: "No handler.", ephemeral: true });
    }
  } catch (err) {
    logger.error("Interaction error:", err);
  }
}

module.exports = { handleInteraction };
