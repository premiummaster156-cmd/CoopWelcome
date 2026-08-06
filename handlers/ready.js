const logger = require("../utils/logger");

async function handleReady(client, c) {
  logger.success(`Logged in as ${c.user.tag} (${c.user.id})`);
  logger.info(`Servers: ${client.guilds.cache.size}`);
  logger.info(`Slash commands: ${client.slashCommands.size}`);
  logger.info(`Prefix commands: ${client.prefixCommands.size}`);
  try {
    await c.user.setPresence({ activities: [{ name: "/help · CoopWelcome", type: 3 }], status: "online" });
  } catch (err) {}
}

module.exports = { handleReady };
