const { Client, GatewayIntentBits, Collection, Events } = require("discord.js");
const config = require("./config");
const logger = require("./utils/logger");
const { loadSlashCommands } = require("./loaders");
const { handleInteraction } = require("./handlers/interaction");
const { handleGuildMemberAdd, handleGuildMemberRemove } = require("./handlers/member");
const { handleReady } = require("./handlers/ready");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.slashCommands = new Collection();
loadSlashCommands(client);

client.once(Events.ClientReady, (readyClient) => handleReady(client, readyClient));
client.on(Events.InteractionCreate, (interaction) => handleInteraction(client, interaction));
client.on(Events.GuildMemberAdd, (member) => handleGuildMemberAdd(client, member));
client.on(Events.GuildMemberRemove, (member) => handleGuildMemberRemove(client, member));

process.on("unhandledRejection", (error) => logger.error("Unhandled promise rejection:", error));
process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception:", error);
  process.exitCode = 1;
});

client.login(config.token).catch((error) => {
  logger.error("Discord login failed. Check TOKEN in the environment.", error);
  process.exit(1);
});
