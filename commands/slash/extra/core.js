const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const store = require("../../../utils/store");
const config = require("../../../config");
const { success, error, info, warning } = require("../../../utils/embed");

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

module.exports = [
  {
    category: "welcome",
    data: new SlashCommandBuilder().setName("setleaveembed").setDescription("Set a custom goodbye message.").addStringOption((o) => o.setName("message").setDescription("Message").setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const message = interaction.options.getString("message");
      store.setSetting(interaction.guild.id, "leaveMessage", message);
      await interaction.reply({ embeds: [success("Leave Message", "Custom goodbye message saved!")] });
    },
  },
  {
    category: "welcome",
    data: new SlashCommandBuilder().setName("welcomelist").setDescription("List recent welcomed members."),
    async execute(interaction) {
      const recent = store.getRecentWelcomes(interaction.guild.id, 25);
      if (recent.length === 0) return interaction.reply({ embeds: [error("None", "No welcomes recorded yet.")] });
      const text = recent.map((r, i) => `**${i + 1}.** <@${r.userId}> — ${new Date(r.ts).toLocaleDateString()}`).join("\n");
      await interaction.reply({ embeds: [info("Recent Welcomes", text)] });
    },
  },
  {
    category: "welcome",
    data: new SlashCommandBuilder().setName("disablewelcome").setDescription("Disable welcome messages.").setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      store.setSetting(interaction.guild.id, "welcomeEnabled", false);
      await interaction.reply({ embeds: [success("Welcome Disabled", "Welcome messages are now disabled.")] });
    },
  },
  {
    category: "welcome",
    data: new SlashCommandBuilder().setName("enablewelcome").setDescription("Enable welcome messages.").setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      store.setSetting(interaction.guild.id, "welcomeEnabled", true);
      await interaction.reply({ embeds: [success("Welcome Enabled", "Welcome messages are now enabled.")] });
    },
  },
  {
    category: "welcome",
    data: new SlashCommandBuilder().setName("setwelcomecolor").setDescription("Set the welcome embed color.").addStringOption((o) => o.setName("color").setDescription("Hex color, e.g. #22c55e").setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const color = interaction.options.getString("color");
      store.setSetting(interaction.guild.id, "welcomeColor", color);
      await interaction.reply({ embeds: [success("Color Set", `Welcome embed color set to **${color}**.`)] });
    },
  },
  {
    category: "welcome",
    data: new SlashCommandBuilder().setName("setgoodbyechannel").setDescription("Set the goodbye channel.").addChannelOption((o) => o.setName("channel").setDescription("Channel").setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const channel = interaction.options.getChannel("channel");
      store.setSetting(interaction.guild.id, "leaveChannel", channel.id);
      await interaction.reply({ embeds: [success("Goodbye Channel", `Goodbye messages will go to ${channel}.`)] });
    },
  },
  {
    category: "welcome",
    data: new SlashCommandBuilder().setName("welcomecount").setDescription("Total members welcomed by the bot."),
    async execute(interaction) {
      await interaction.reply({ embeds: [success("Total Welcomed", `**${store.getWelcomeCount(interaction.guild.id)}** members welcomed!`)] });
    },
  },
  {
    category: "verification",
    data: new SlashCommandBuilder().setName("setverifychannel").setDescription("Set the channel for verification messages.").addChannelOption((o) => o.setName("channel").setDescription("Channel").setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const channel = interaction.options.getChannel("channel");
      store.setSetting(interaction.guild.id, "verifyChannel", channel.id);
      await interaction.reply({ embeds: [success("Verify Channel", `Verification channel set to ${channel}.`)] });
    },
  },
  {
    category: "verification",
    data: new SlashCommandBuilder().setName("unverify").setDescription("Remove verified role from a user.").addUserOption((o) => o.setName("user").setDescription("The user").setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const user = interaction.options.getUser("user");
      const s = store.getSettings(interaction.guild.id);
      const roleId = s.verifiedRole || config.verifiedRoleId;
      const member = interaction.guild.members.cache.get(user.id);
      if (!roleId || !member) return interaction.reply({ embeds: [error("Failed", "Role not set or user not found.")], ephemeral: true });
      await member.roles.remove(roleId).catch(() => {});
      await interaction.reply({ embeds: [success("Unverified", `**${user.tag}** unverified.`)] });
    },
  },
  {
    category: "verification",
    data: new SlashCommandBuilder().setName("verifypanel").setDescription("Post a verification panel embed.").addChannelOption((o) => o.setName("channel").setDescription("Channel").setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const channel = interaction.options.getChannel("channel");
      const embed = new EmbedBuilder().setTitle("🔐 Verify").setDescription("To gain access, please press the button below.").setColor(config.colors.primary);
      await channel.send({ embeds: [embed] });
      await interaction.reply({ embeds: [success("Panel Posted", "Verification panel sent.")], ephemeral: true });
    },
  },
  {
    category: "verification",
    data: new SlashCommandBuilder().setName("verifyrolelist").setDescription("List all verified users.").setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const s = store.getSettings(interaction.guild.id);
      const users = s.verifiedUsers || [];
      if (users.length === 0) return interaction.reply({ embeds: [error("None", "No verified users yet.")] });
      const text = users.map((u) => `<@${u}>`).join(", ").slice(0, 2000);
      await interaction.reply({ embeds: [info(`Verified Users (${users.length})`, text)] });
    },
  },
  {
    category: "rules",
    data: new SlashCommandBuilder().setName("addrule").setDescription("Add a rule.").addStringOption((o) => o.setName("rule").setDescription("The rule").setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const rule = interaction.options.getString("rule");
      const s = store.getSettings(interaction.guild.id);
      const rules = s.rules || [];
      rules.push(rule);
      store.setSetting(interaction.guild.id, "rules", rules);
      await interaction.reply({ embeds: [success("Rule Added", `Rule ${rules.length}: ${rule}`)] });
    },
  },
  {
    category: "rules",
    data: new SlashCommandBuilder().setName("removerule").setDescription("Remove a rule by number.").addIntegerOption((o) => o.setName("number").setDescription("Rule number").setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const num = interaction.options.getInteger("number");
      const s = store.getSettings(interaction.guild.id);
      const rules = s.rules || [];
      if (num < 1 || num > rules.length) return interaction.reply({ embeds: [error("Invalid", "Rule number out of range.")], ephemeral: true });
      rules.splice(num - 1, 1);
      store.setSetting(interaction.guild.id, "rules", rules);
      await interaction.reply({ embeds: [success("Rule Removed", `Rule ${num} removed.`)] });
    },
  },
  {
    category: "rules",
    data: new SlashCommandBuilder().setName("ruleslist").setDescription("List all rules."),
    async execute(interaction) {
      const s = store.getSettings(interaction.guild.id);
      const rules = s.rules || [];
      if (rules.length === 0) return interaction.reply({ embeds: [error("None", "No rules set.")] });
      const text = rules.map((r, i) => `**${i + 1}.** ${r}`).join("\n");
      await interaction.reply({ embeds: [info("📜 Rules", text)] });
    },
  },
  {
    category: "utility",
    data: new SlashCommandBuilder().setName("membercount").setDescription("Current member count."),
    async execute(interaction) {
      await interaction.reply({ embeds: [success("Members", `**${interaction.guild.memberCount}** members in ${interaction.guild.name}.`)] });
    },
  },
  {
    category: "utility",
    data: new SlashCommandBuilder().setName("welcomepreview").setDescription("Preview the welcome message.").setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const s = store.getSettings(interaction.guild.id);
      const message = s.welcomeMessage || "Welcome to **{server}**, {user}! 🎉";
      const text = message.replace(/{user}/g, interaction.user.username).replace(/{server}/g, interaction.guild.name).replace(/{count}/g, String(interaction.guild.memberCount));
      await interaction.reply({ embeds: [info("Welcome Preview", text)] });
    },
  },
  {
    category: "fun",
    data: new SlashCommandBuilder().setName("compliment").setDescription("Give a compliment.").addUserOption((o) => o.setName("user").setDescription("The user").setRequired(true)),
    async execute(interaction) {
      const user = interaction.options.getUser("user");
      const comps = ["You're amazing!", "You have a great smile!", "You're incredibly smart!", "You make the server better!", "You're a legend!"];
      await interaction.reply({ embeds: [info("💖 Compliment", `${user}, ${rand(comps)}`)] });
    },
  },
  {
    category: "fun",
    data: new SlashCommandBuilder().setName("dadjoke").setDescription("Get a dad joke."),
    async execute(interaction) {
      const jokes = ["I'm reading a book on anti-gravity. It's impossible to put down!", "What do you call a bear with no teeth? A gummy bear!", "Why can't your nose be 12 inches long? Because then it would be a foot!"];
      await interaction.reply({ embeds: [success("😂", rand(jokes))] });
    },
  },
  {
    category: "fun",
    data: new SlashCommandBuilder().setName("welcomeparty").setDescription("Throw a welcome party! 🎉").addUserOption((o) => o.setName("user").setDescription("The guest").setRequired(true)),
    async execute(interaction) {
      const user = interaction.options.getUser("user");
      await interaction.reply({ embeds: [success("🎉🎊", `Welcome party for ${user}! Confetti, cake, and good vibes! 🎂🎉`)] });
    },
  },
  {
    category: "fun",
    data: new SlashCommandBuilder().setName("waveto").setDescription("Wave to a user.").addUserOption((o) => o.setName("user").setDescription("The user").setRequired(true)),
    async execute(interaction) {
      const user = interaction.options.getUser("user");
      await interaction.reply({ embeds: [info("👋", `**${interaction.user.tag}** waves to **${user.tag}**!`)] });
    },
  },
  {
    category: "fun",
    data: new SlashCommandBuilder().setName("highfive").setDescription("High-five a user.").addUserOption((o) => o.setName("user").setDescription("The user").setRequired(true)),
    async execute(interaction) {
      const user = interaction.options.getUser("user");
      await interaction.reply({ embeds: [info("🙌", `**${interaction.user.tag}** high-fives **${user.tag}**!`)] });
    },
  },
  {
    category: "fun",
    data: new SlashCommandBuilder().setName("celebrate").setDescription("Celebrate something!"),
    async execute(interaction) {
      await interaction.reply({ embeds: [success("🎉", "Celebrating for no reason! Yay! 🎊")] });
    },
  },
];
