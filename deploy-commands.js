const { REST, Routes } = require("discord.js");
const config = require("./config");
const logger = require("./utils/logger");
const { walk } = require("./loaders");
const path = require("path");

const commands = [];
const dir = path.join(__dirname, "commands", "slash");
for (const file of walk(dir)) {
  const loaded = require(file);
  const list = Array.isArray(loaded) ? loaded : [loaded];
  for (const cmd of list) if (cmd.data) commands.push(cmd.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(config.token);
(async () => {
  try {
    logger.info(`Registering ${commands.length} slash commands...`);
    if (config.devGuildId) {
      await rest.put(Routes.applicationGuildCommands(config.clientId, config.devGuildId), { body: commands });
      logger.success(`Registered to guild ${config.devGuildId}`);
    } else {
      await rest.put(Routes.applicationCommands(config.clientId), { body: commands });
      logger.success(`Registered ${commands.length} global commands`);
    }
  } catch (err) {
    logger.error("Failed to register:", err);
  }
})();
