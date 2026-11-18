const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const config = require("../../../config");
const { success, error, info, warning } = require("../../../utils/embed");

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

module.exports = [
  {
    category: "utility",
    data: new SlashCommandBuilder().setName("help").setDescription("Show all commands."),
    async execute(interaction) {
      const commands = interaction.client.slashCommands;
      const cats = {};
      for (const [, c] of commands) { const cat = c.category || "other"; (cats[cat] = cats[cat] || []).push(`\`/${c.data.name}\` — ${c.data.description}`); }
      const embed = info(`CoopWelcome Help (${commands.size} commands)`, "Welcome & verification made easy.")
        .setThumbnail(interaction.client.user.displayAvatarURL());
      for (const [cat, list] of Object.entries(cats)) embed.addFields({ name: `📁 ${cat[0].toUpperCase() + cat.slice(1)}`, value: list.join("\n").slice(0, 1024) });
      await interaction.reply({ embeds: [embed] });
    },
  },
  {
    category: "utility",
    data: new SlashCommandBuilder().setName("ping").setDescription("Check latency."),
    async execute(interaction) {
      const sent = await interaction.reply({ embeds: [info("Pinging...")], fetchReply: true });
      const roundtrip = sent.createdTimestamp - interaction.createdTimestamp;
      await interaction.editReply({ embeds: [success("Pong!", `Latency: ${roundtrip}ms | API: ${Math.round(interaction.client.ws.ping)}ms`)] });
    },
  },
  {
    category: "utility",
    data: new SlashCommandBuilder().setName("botinfo").setDescription("Bot information."),
    async execute(interaction) {
      const embed = new EmbedBuilder().setTitle(interaction.client.user.tag).setColor(config.colors.primary).setThumbnail(interaction.client.user.displayAvatarURL())
        .addFields(
          { name: "Servers", value: String(interaction.client.guilds.cache.size), inline: true },
          { name: "Users", value: String(interaction.client.users.cache.size), inline: true },
          { name: "Slash", value: String(interaction.client.slashCommands.size), inline: true },
          { name: "Version", value: "1.0.0", inline: true },
        );
      await interaction.reply({ embeds: [embed] });
    },
  },
  {
    category: "utility",
    data: new SlashCommandBuilder().setName("avatar").setDescription("Get an avatar.").addUserOption((o) => o.setName("user").setDescription("The user")),
    async execute(interaction) {
      const user = interaction.options.getUser("user") || interaction.user;
      const embed = new EmbedBuilder().setTitle(`${user.tag}`).setColor(config.colors.primary).setImage(user.displayAvatarURL({ size: 1024 }));
      await interaction.reply({ embeds: [embed] });
    },
  },
  {
    category: "utility",
    data: new SlashCommandBuilder().setName("invite").setDescription("Bot invite link."),
    async execute(interaction) {
      const link = `https://discord.com/api/oauth2/authorize?client_id=${config.clientId}&permissions=8&scope=bot%20applications.commands`;
      await interaction.reply({ embeds: [success("Invite", `[Invite CoopWelcome](${link})`)] });
    },
  },
  {
    category: "utility",
    data: new SlashCommandBuilder().setName("serverinfo").setDescription("Server info."),
    async execute(interaction) {
      const owner = await interaction.guild.fetchOwner().catch(() => null);
      const embed = new EmbedBuilder().setTitle(`📊 ${interaction.guild.name}`).setColor(config.colors.primary).setThumbnail(interaction.guild.iconURL())
        .addFields(
          { name: "ID", value: interaction.guild.id, inline: true },
          { name: "Owner", value: owner ? owner.user.tag : "Unknown", inline: true },
          { name: "Members", value: String(interaction.guild.memberCount), inline: true },
          { name: "Channels", value: String(interaction.guild.channels.cache.size), inline: true },
          { name: "Roles", value: String(interaction.guild.roles.cache.size), inline: true },
          { name: "Boost", value: String(interaction.guild.premiumTier), inline: true },
        );
      await interaction.reply({ embeds: [embed] });
    },
  },
  {
    category: "utility",
    data: new SlashCommandBuilder().setName("whois").setDescription("User info.").addUserOption((o) => o.setName("user").setDescription("The user")),
    async execute(interaction) {
      const user = interaction.options.getUser("user") || interaction.user;
      const member = interaction.guild.members.cache.get(user.id);
      const embed = new EmbedBuilder().setTitle(user.tag).setColor(config.colors.primary).setThumbnail(user.displayAvatarURL())
        .addFields(
          { name: "ID", value: user.id, inline: true },
          { name: "Joined", value: member ? new Date(member.joinedAt).toLocaleDateString() : "N/A", inline: true },
          { name: "Created", value: new Date(user.createdAt).toLocaleDateString(), inline: true },
          { name: "Roles", value: member ? member.roles.cache.map((r) => r.name).join(", ") : "N/A" },
        );
      await interaction.reply({ embeds: [embed] });
    },
  },
  {
    category: "utility",
    data: new SlashCommandBuilder().setName("uptime").setDescription("Bot uptime."),
    async execute(interaction) {
      const s = Math.floor(interaction.client.uptime / 1000);
      await interaction.reply({ embeds: [success("Uptime", `${Math.floor(s / 86400)}d ${Math.floor((s % 86400) / 3600)}h ${Math.floor((s % 3600) / 60)}m ${s % 60}s`)] });
    },
  },
  {
    category: "utility",
    data: new SlashCommandBuilder().setName("echo").setDescription("Make the bot say something.").addStringOption((o) => o.setName("text").setDescription("Text").setRequired(true)),
    async execute(interaction) {
      await interaction.reply({ content: interaction.options.getString("text") });
    },
  },
  {
    category: "utility",
    data: new SlashCommandBuilder().setName("poll").setDescription("Create a poll.").addStringOption((o) => o.setName("question").setDescription("Question").setRequired(true)),
    async execute(interaction) {
      const q = interaction.options.getString("question");
      const msg = await interaction.reply({ embeds: [new EmbedBuilder().setTitle(`📊 ${q}`).setColor(config.colors.primary).setDescription("React below!")], fetchReply: true });
      await msg.react("👍");
      await msg.react("👎");
    },
  },
  {
    category: "utility",
    data: new SlashCommandBuilder().setName("servericon").setDescription("Get the server icon."),
    async execute(interaction) {
      const icon = interaction.guild.iconURL({ size: 1024 });
      if (!icon) return interaction.reply({ embeds: [error("No icon", "No server icon.")], ephemeral: true });
      await interaction.reply({ embeds: [new EmbedBuilder().setColor(config.colors.primary).setImage(icon)] });
    },
  },
  {
    category: "utility",
    data: new SlashCommandBuilder().setName("emoji").setDescription("Enlarge an emoji.").addStringOption((o) => o.setName("emoji").setDescription("Custom emoji").setRequired(true)),
    async execute(interaction) {
      const em = interaction.options.getString("emoji");
      const m = em.match(/<a?:\w+:(\d+)>/);
      if (!m) return interaction.reply({ embeds: [error("Invalid", "Provide a custom emoji.")], ephemeral: true });
      await interaction.reply({ content: `https://cdn.discordapp.com/emojis/${m[1]}.${em.startsWith("<a:") ? "gif" : "png"}?size=128` });
    },
  },
];

// Fun commands
module.exports.push(
  {
    category: "fun",
    data: new SlashCommandBuilder().setName("confetti").setDescription("Celebrate with confetti! 🎉"),
    async execute(interaction) {
      await interaction.reply({ embeds: [success("🎉🎊", "Congratulations! Confetti everywhere! 🎊🎉")] });
    },
  },
  {
    category: "fun",
    data: new SlashCommandBuilder().setName("8ball").setDescription("Ask the 8-ball.").addStringOption((o) => o.setName("question").setDescription("Question").setRequired(true)),
    async execute(interaction) {
      const answers = ["Yes", "No", "Maybe", "Definitely", "Ask again later", "Cannot predict now", "Without a doubt", "Don't count on it", "Outlook good", "Signs point to yes"];
      await interaction.reply({ embeds: [info("🎱", `**A:** ${rand(answers)}`)] });
    },
  },
  {
    category: "fun",
    data: new SlashCommandBuilder().setName("coinflip").setDescription("Flip a coin."),
    async execute(interaction) {
      await interaction.reply({ embeds: [success("🪙", `**${Math.random() < 0.5 ? "Heads" : "Tails"}**!`)] });
    },
  },
  {
    category: "fun",
    data: new SlashCommandBuilder().setName("diceroll").setDescription("Roll a die.").addIntegerOption((o) => o.setName("sides").setDescription("Sides")),
    async execute(interaction) {
      const sides = interaction.options.getInteger("sides") || 6;
      await interaction.reply({ embeds: [success(`🎲`, `d${sides}: **${Math.floor(Math.random() * sides) + 1}**`)] });
    },
  },
  {
    category: "fun",
    data: new SlashCommandBuilder().setName("greet").setDescription("Greet a user.").addUserOption((o) => o.setName("user").setDescription("The user").setRequired(true)),
    async execute(interaction) {
      const user = interaction.options.getUser("user");
      await interaction.reply({ embeds: [success("👋 Hello!", `Welcome to the party, ${user}! 🎉`)] });
    },
  },
  {
    category: "fun",
    data: new SlashCommandBuilder().setName("joke").setDescription("Get a joke."),
    async execute(interaction) {
      const jokes = ["Why don't scientists trust atoms? Because they make up everything!", "I told my wife she should embrace her mistakes. She hugged me.", "Why did the scarecrow win an award? Because he was outstanding in his field!"];
      await interaction.reply({ embeds: [success("😂", rand(jokes))] });
    },
  },
  {
    category: "fun",
    data: new SlashCommandBuilder().setName("hug").setDescription("Hug a user.").addUserOption((o) => o.setName("user").setDescription("The user").setRequired(true)),
    async execute(interaction) {
      const user = interaction.options.getUser("user");
      await interaction.reply({ embeds: [info("🤗", `**${interaction.user.tag}** hugs **${user.tag}**!`)] });
    },
  },
  {
    category: "fun",
    data: new SlashCommandBuilder().setName("welcomeannounce").setDescription("Announce a new member arrival.").addUserOption((o) => o.setName("user").setDescription("The member").setRequired(true)),
    async execute(interaction) {
      const user = interaction.options.getUser("user");
      await interaction.reply({ embeds: [success("🎉 New Member!", `Everyone welcome **${user}** to **${interaction.guild.name}**!`)] });
    },
  },
  {
    category: "fun",
    data: new SlashCommandBuilder().setName("pat").setDescription("Pat a user.").addUserOption((o) => o.setName("user").setDescription("The user").setRequired(true)),
    async execute(interaction) {
      const user = interaction.options.getUser("user");
      await interaction.reply({ embeds: [info("🐾", `**${interaction.user.tag}** pats **${user.tag}**!`)] });
    },
  },
  {
    category: "fun",
    data: new SlashCommandBuilder().setName("slap").setDescription("Slap a user.").addUserOption((o) => o.setName("user").setDescription("The user").setRequired(true)),
    async execute(interaction) {
      const user = interaction.options.getUser("user");
      await interaction.reply({ embeds: [info("💥", `**${interaction.user.tag}** slaps **${user.tag}** with a trout!`)] });
    },
  },
  {
    category: "fun",
    data: new SlashCommandBuilder().setName("cat").setDescription("Random cat fact."),
    async execute(interaction) {
      const facts = ["Cats sleep 70% of their lives.", "A cat's nose print is unique.", "A group of cats is called a clowder."];
      await interaction.reply({ embeds: [success("🐱", rand(facts))] });
    },
  },
  {
    category: "fun",
    data: new SlashCommandBuilder().setName("rate").setDescription("Rate something.").addStringOption((o) => o.setName("thing").setDescription("What to rate").setRequired(true)),
    async execute(interaction) {
      const score = Math.floor(Math.random() * 11);
      await interaction.reply({ embeds: [info("⭐", `**${interaction.options.getString("thing")}** is **${score}/10**.`)] });
    },
  },
);
