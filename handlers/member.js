const config = require("../config");
const logger = require("../utils/logger");
const store = require("../utils/store");
const { info } = require("../utils/embed");

async function welcomeMember(client, member) {
  try {
    const settings = store.getSettings(member.guild.id);

    // Auto-assign member role
    const memberRoleId = settings.memberRole || config.memberRoleId;
    if (memberRoleId) {
      const role = member.guild.roles.cache.get(memberRoleId);
      if (role) await member.roles.add(role).catch(() => {});
    }

    // Send welcome message
    const channelId = settings.welcomeChannel || config.welcomeChannelId;
    const channel = channelId ? member.guild.channels.cache.get(channelId) : null;
    if (channel) {
      const message = settings.welcomeMessage || "Welcome to **{server}**, {user}! 🎉 We now have **{count}** members.";
      const text = message
        .replace(/{user}/g, `${member}`)
        .replace(/{server}/g, member.guild.name)
        .replace(/{count}/g, String(member.guild.memberCount));
      await channel.send({ embeds: [info("Welcome!", text)] }).catch(() => {});
    }

    store.recordWelcome(member.guild.id, member.id);
  } catch (err) {
    logger.error("Welcome handler error:", err);
  }
}

async function handleGuildMemberAdd(client, member) {
  await welcomeMember(client, member);
}

async function handleGuildMemberRemove(client, member) {
  try {
    const settings = store.getSettings(member.guild.id);
    const channelId = settings.leaveChannel || config.welcomeChannelId;
    const channel = channelId ? member.guild.channels.cache.get(channelId) : null;
    if (channel) {
      await channel.send({ embeds: [info("Goodbye", `**${member.user.tag}** left the server. 😢 We now have **${member.guild.memberCount}** members.`)] }).catch(() => {});
    }
  } catch (err) {
    logger.error("Member remove error:", err);
  }
}

module.exports = { handleGuildMemberAdd, handleGuildMemberRemove, welcomeMember };
