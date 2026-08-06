const config = require("../config");
const store = require("../utils/store");
const { success, error } = require("../utils/embed");

async function handleVerify(interaction, client) {
  try {
    const settings = store.getSettings(interaction.guild.id);
    const verifiedRoleId = settings.verifiedRole || config.verifiedRoleId;
    if (!verifiedRoleId) {
      return interaction.reply({ embeds: [error("Not configured", "The verified role is not set. Ask an admin to run /setverifiedrole.")], ephemeral: true });
    }
    const role = interaction.guild.roles.cache.get(verifiedRoleId);
    if (!role) {
      return interaction.reply({ embeds: [error("Not found", "The verified role no longer exists.")], ephemeral: true });
    }
    if (interaction.member.roles.cache.has(role.id)) {
      return interaction.reply({ embeds: [success("Already verified", "You are already verified. ✅")], ephemeral: true });
    }
    await interaction.member.roles.add(role);
    store.addVerified(interaction.guild.id, interaction.user.id);
    await interaction.reply({ embeds: [success("Verified!", `You have been verified. Welcome to **${interaction.guild.name}**! 🎉`)], ephemeral: true });
  } catch (err) {
    await interaction.reply({ embeds: [error("Error", "Could not verify you. Please contact staff.")], ephemeral: true });
  }
}

module.exports = { handleVerify };
