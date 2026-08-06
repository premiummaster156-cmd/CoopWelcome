const fs = require("fs");
const path = require("path");
const logger = require("./utils/logger");

function walk(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walk(full));
    else if (entry.name.endsWith(".js")) results.push(full);
  }
  return results;
}

function registerSlash(client, cmd) {
  if (!cmd || !cmd.data || !cmd.execute) return 0;
  client.slashCommands.set(cmd.data.name, cmd);
  return 1;
}

function registerPrefix(client, cmd) {
  if (!cmd || !cmd.name || !cmd.execute) return 0;
  client.prefixCommands.set(cmd.name, cmd);
  if (cmd.aliases) {
    for (const alias of cmd.aliases) client.prefixAliases.set(alias, cmd.name);
  }
  return 1;
}

function loadSlashCommands(client) {
  const dir = path.join(__dirname, "commands", "slash");
  const files = walk(dir);
  let count = 0;
  for (const file of files) {
    try {
      const loaded = require(file);
      const list = Array.isArray(loaded) ? loaded : [loaded];
      for (const cmd of list) count += registerSlash(client, cmd);
    } catch (err) {
      logger.error(`Failed to load slash command ${file}:`, err.message);
    }
  }
  logger.success(`Loaded ${count} slash commands.`);
}

function loadPrefixCommands(client) {
  const dir = path.join(__dirname, "commands", "prefix");
  const files = walk(dir);
  let count = 0;
  for (const file of files) {
    try {
      const loaded = require(file);
      const list = Array.isArray(loaded) ? loaded : [loaded];
      for (const cmd of list) count += registerPrefix(client, cmd);
    } catch (err) {
      logger.error(`Failed to load prefix command ${file}:`, err.message);
    }
  }
  logger.success(`Loaded ${count} prefix commands.`);
}

module.exports = { loadSlashCommands, loadPrefixCommands, walk };
