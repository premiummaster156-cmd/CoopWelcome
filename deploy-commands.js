const { REST, Routes, Collection } = require("discord.js");
const config = require("./config");
const logger = require("./utils/logger");
const { loadSlashCommands } = require("./loaders");

function validateOptionOrder(options = [], context = "command") {
  let optionalSeen = false;
  if (options.length > 25) throw new Error(context + " exceeds Discord's 25-option limit.");
  for (const option of options) {
    if (option.type === 1 || option.type === 2) {
      validateOptionOrder(option.options || [], context + "/" + option.name);
      continue;
    }
    if (option.required === false) optionalSeen = true;
    else if (option.required === true && optionalSeen) {
      throw new Error(context + " places required option '" + option.name + "' after an optional option.");
    }
  }
}

function buildPayload() {
  const client = { slashCommands: new Collection() };
  const count = loadSlashCommands(client);
  const commands = [...client.slashCommands.values()].map((command) => command.data.toJSON());
  const names = new Set();

  for (const command of commands) {
    if (names.has(command.name)) throw new Error("Duplicate application command: /" + command.name);
    names.add(command.name);
    validateOptionOrder(command.options || [], "/" + command.name);
  }
  if (commands.length > 100) throw new Error("Discord supports at most 100 global/guild application commands.");
  logger.success("Validated " + count + " slash commands and their option ordering.");
  return commands;
}

async function main() {
  try {
    const args = new Set(process.argv.slice(2));
    if (args.has("--guild") && args.has("--global")) {
      throw new Error("Choose either --guild or --global, not both.");
    }

    const commands = buildPayload();
    if (args.has("--check")) {
      logger.success("Command validation completed. No Discord API registration was requested.");
      return;
    }

    if (!config.token || !config.clientId) {
      throw new Error("TOKEN and CLIENT_ID must be configured before registering commands.");
    }

    const rest = new REST({ version: "10" }).setToken(config.token);
    if (args.has("--guild")) {
      if (!config.devGuildId) throw new Error("Set DEV_GUILD_ID before running npm run register:guild.");
      await rest.put(
        Routes.applicationGuildCommands(config.clientId, config.devGuildId),
        { body: commands }
      );
      logger.success("Registered " + commands.length + " slash commands to guild " + config.devGuildId + ".");
      return;
    }

    await rest.put(Routes.applicationCommands(config.clientId), { body: commands });
    logger.success("Registered " + commands.length + " global slash commands.");
  } catch (error) {
    logger.error("Command registration/validation failed:", error);
    process.exitCode = 1;
  }
}

main();
