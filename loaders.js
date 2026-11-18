const fs = require("node:fs");
const path = require("node:path");
const logger = require("./utils/logger");

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(absolutePath));
    else if (entry.isFile() && entry.name.endsWith(".js")) files.push(absolutePath);
  }
  return files.sort((a, b) => a.localeCompare(b));
}

function registerSlash(client, command, sourceFile = "unknown file") {
  if (!command?.data || typeof command.data.toJSON !== "function" || typeof command.execute !== "function") {
    throw new TypeError("Invalid slash command export in " + sourceFile);
  }
  const definition = command.data.toJSON();
  if (!definition.name || !definition.description) {
    throw new TypeError("Slash command in " + sourceFile + " is missing its name or description");
  }
  if (client.slashCommands.has(definition.name)) {
    throw new Error("Duplicate slash command /" + definition.name + " found in " + sourceFile);
  }
  client.slashCommands.set(definition.name, command);
  return 1;
}

function loadSlashCommands(client) {
  if (!client?.slashCommands || typeof client.slashCommands.set !== "function") {
    throw new TypeError("The client must provide a Discord.js Collection named slashCommands");
  }
  const directory = path.join(__dirname, "commands", "slash");
  const files = walk(directory);
  if (files.length === 0) throw new Error("No slash-command modules were found in commands/slash.");

  let count = 0;
  for (const file of files) {
    let exported;
    try {
      exported = require(file);
    } catch (error) {
      logger.error("Unable to import slash command file " + file, error);
      throw error;
    }
    const commands = Array.isArray(exported) ? exported : [exported];
    for (const command of commands) count += registerSlash(client, command, path.relative(__dirname, file));
  }

  if (count === 0) throw new Error("No valid slash commands were registered.");
  logger.success("Loaded " + count + " slash commands.");
  return count;
}

module.exports = { walk, registerSlash, loadSlashCommands };
