const { SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const store = require("../../../utils/store");
const config = require("../../../config");
const { success, error, info } = require("../../../utils/embed");

module.exports = [
  {
    category: "welcome",
    data: new SlashCommandBuilder()
      .setName("welcome")
      .setDescription("View current welcome settings."),
    async execute(interaction) {
      const s = store.getSettings(interaction.guild.id);
      const embed = info("Welcome Settings", "Current welcome configuration")
        .addFields(
          { name: "Welcome Channel", value: s.welcomeChannel ? `<#${s.welcomeChannel}>` : "Not set", inline: true },
          { name: "Leave Channel", value: s.leaveChannel ? `<#${s.leaveChannel}>` : "Not set", inline: true },
          { name: "Member Role", value: s.memberRole ? `<@&${s.memberRole}>` : "Not set", inline: true },
          { name: "Verified Role", value: s.verifiedRole ? `<@&${s.verifiedRole}>` : "Not set", inline: true },
          { name: "Total Welcomed", value: String(store.getWelcomeCount(interaction.guild.id)), inline: true },
        );
      await interaction.reply({ embeds: [embed] });
    },
  },
  {
    category: "welcome",
    data: new SlashCommandBuilder()
      .setName("setwelcomechannel")
      .setDescription("Set the welcome channel.")
      .addChannelOption((o) => o.setName("channel").setDescription("The channel").setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const channel = interaction.options.getChannel("channel");
      store.setSetting(interaction.guild.id, "welcomeChannel", channel.id);
      await interaction.reply({ embeds: [success("Welcome Channel", `Welcome messages will go to ${channel}.`)] });
    },
  },
  {
    category: "welcome",
    data: new SlashCommandBuilder()
      .setName("setleavechannel")
      .setDescription("Set the leave channel.")
      .addChannelOption((o) => o.setName("channel").setDescription("The channel").setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const channel = interaction.options.getChannel("channel");
      store.setSetting(interaction.guild.id, "leaveChannel", channel.id);
      await interaction.reply({ embeds: [success("Leave Channel", `Leave messages will go to ${channel}.`)] });
    },
  },
  {
    category: "welcome",
    data: new SlashCommandBuilder()
      .setName("setmemberrole")
      .setDescription("Set the role auto-assigned to new members.")
      .addRoleOption((o) => o.setName("role").setDescription("The role").setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const role = interaction.options.getRole("role");
      store.setSetting(interaction.guild.id, "memberRole", role.id);
      await interaction.reply({ embeds: [success("Member Role", `New members will receive **${role.name}**.`)] });
    },
  },
  {
    category: "welcome",
    data: new SlashCommandBuilder()
      .setName("setverifiedrole")
      .setDescription("Set the role given after verification.")
      .addRoleOption((o) => o.setName("role").setDescription("The role").setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const role = interaction.options.getRole("role");
      store.setSetting(interaction.guild.id, "verifiedRole", role.id);
      await interaction.reply({ embeds: [success("Verified Role", `Verified users will get **${role.name}**.`)] });
    },
  },
  {
    category: "welcome",
    data: new SlashCommandBuilder()
      .setName("setwelcomeembed")
      .setDescription("Set a custom welcome message.")
      .addStringOption((o) => o.setName("message").setDescription("Use {user}, {server}, {count}").setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const message = interaction.options.getString("message");
      store.setSetting(interaction.guild.id, "welcomeMessage", message);
      await interaction.reply({ embeds: [success("Welcome Message", "Custom welcome message saved!\nPreview:\n" + message.replace(/{user}/g, interaction.user.username).replace(/{server}/g, interaction.guild.name).replace(/{count}/g, String(interaction.guild.memberCount)))] });
    },
  },
  {
    category: "welcome",
    data: new SlashCommandBuilder()
      .setName("setupwelcome")
      .setDescription("Automatically set up the welcome system.")
      .addChannelOption((o) => o.setName("channel").setDescription("Welcome channel").setRequired(true))
      .addRoleOption((o) => o.setName("memberrole").setDescription("Member role"))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const channel = interaction.options.getChannel("channel");
      const role = interaction.options.getRole("memberrole");
      store.setSetting(interaction.guild.id, "welcomeChannel", channel.id);
      if (role) store.setSetting(interaction.guild.id, "memberRole", role.id);
      await interaction.reply({ embeds: [success("Welcome Setup Complete", `Welcome channel: ${channel}\nMember role: ${role ? role.name : "Not set"}\n\nWelcome system is now active! 🎉`)] });
    },
  },
  {
    category: "welcome",
    data: new SlashCommandBuilder()
      .setName("welcometest")
      .setDescription("Send a test welcome message.")
      .addChannelOption((o) => o.setName("channel").setDescription("Channel to send to"))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const channel = interaction.options.getChannel("channel") || interaction.channel;
      const settings = store.getSettings(interaction.guild.id);
      const message = settings.welcomeMessage || "Welcome to **{server}**, {user}! 🎉 We now have **{count}** members.";
      const text = message.replace(/{user}/g, `${interaction.user}`).replace(/{server}/g, interaction.guild.name).replace(/{count}/g, String(interaction.guild.memberCount));
      await channel.send({ embeds: [info("Welcome!", text)] });
      await interaction.reply({ embeds: [success("Test Sent", "Test welcome message sent!")], ephemeral: true });
    },
  },
  {
    category: "welcome",
    data: new SlashCommandBuilder()
      .setName("goodbyetest")
      .setDescription("Send a test goodbye message.")
      .addChannelOption((o) => o.setName("channel").setDescription("Channel to send to"))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const channel = interaction.options.getChannel("channel") || interaction.channel;
      await channel.send({ embeds: [info("Goodbye", `**${interaction.user.tag}** left the server. 😢 We now have **${interaction.guild.memberCount}** members.`)] });
      await interaction.reply({ embeds: [success("Test Sent", "Test goodbye message sent!")], ephemeral: true });
    },
  },
  {
    category: "welcome",
    data: new SlashCommandBuilder()
      .setName("welcomestats")
      .setDescription("Show welcome statistics."),
    async execute(interaction) {
      const count = store.getWelcomeCount(interaction.guild.id);
      const recent = store.getRecentWelcomes(interaction.guild.id, 10);
      const embed = info("Welcome Stats", `Total members welcomed: **${count}**`)
        .addFields(recent.length ? recent.map((r, i) => ({ name: `#${count - i}`, value: `<@${r.userId}> — ${new Date(r.ts).toLocaleDateString()}`, inline: true })) : [{ name: "No records", value: "No welcomes recorded yet." }]);
      await interaction.reply({ embeds: [embed] });
    },
  },
  {
    category: "verification",
    data: new SlashCommandBuilder()
      .setName("setupverify")
      .setDescription("Post a verification button for new members.")
      .addChannelOption((o) => o.setName("channel").setDescription("Channel to post the verify button").setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const channel = interaction.options.getChannel("channel");
      const button = new ButtonBuilder()
        .setCustomId("verify_btn")
        .setLabel("✅ Verify Me")
        .setStyle(ButtonStyle.Success);
      const row = new ActionRowBuilder().addComponents(button);
      const embed = new EmbedBuilder()
        .setTitle("Verification")
        .setDescription("Click the button below to verify yourself and gain access to the server!")
        .setColor(config.colors.primary);
      await channel.send({ embeds: [embed], components: [row] });
      await interaction.reply({ embeds: [success("Verification Posted", `Verification button sent to ${channel}.`)], ephemeral: true });
    },
  },
  {
    category: "verification",
    data: new SlashCommandBuilder()
      .setName("verifytoggle")
      .setDescription("Enable/disable verification requirement.")
      .addBooleanOption((o) => o.setName("enabled").setDescription("Enabled?").setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const enabled = interaction.options.getBoolean("enabled");
      store.setSetting(interaction.guild.id, "verificationEnabled", enabled);
      await interaction.reply({ embeds: [success("Verification", `Verification is now **${enabled ? "enabled" : "disabled"}**.`)] });
    },
  },
  {
    category: "verification",
    data: new SlashCommandBuilder()
      .setName("verifyinfo")
      .setDescription("Check if a user is verified.")
      .addUserOption((o) => o.setName("user").setDescription("The user")),
    async execute(interaction) {
      const user = interaction.options.getUser("user") || interaction.user;
      const verified = store.isVerified(interaction.guild.id, user.id);
      await interaction.reply({ embeds: [info("Verification", `**${user.tag}** is ${verified ? "**verified** ✅" : "**not verified** ❌"}.`)] });
    },
  },
  {
    category: "verification",
    data: new SlashCommandBuilder()
      .setName("forceverify")
      .setDescription("Manually verify a user.")
      .addUserOption((o) => o.setName("user").setDescription("The user").setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const user = interaction.options.getUser("user");
      const settings = store.getSettings(interaction.guild.id);
      const roleId = settings.verifiedRole || config.verifiedRoleId;
      const member = interaction.guild.members.cache.get(user.id);
      if (!roleId || !member) return interaction.reply({ embeds: [error("Failed", "Verified role not set or user not found.")], ephemeral: true });
      const role = interaction.guild.roles.cache.get(roleId);
      if (!role) return interaction.reply({ embeds: [error("Failed", "Verified role not found.")], ephemeral: true });
      await member.roles.add(role);
      store.addVerified(interaction.guild.id, user.id);
      await interaction.reply({ embeds: [success("Verified", `**${user.tag}** was manually verified.`)] });
    },
  },
  {
    category: "rules",
    data: new SlashCommandBuilder()
      .setName("setrules")
      .setDescription("Set the rules channel.")
      .addChannelOption((o) => o.setName("channel").setDescription("The rules channel").setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const channel = interaction.options.getChannel("channel");
      store.setSetting(interaction.guild.id, "rulesChannel", channel.id);
      await interaction.reply({ embeds: [success("Rules Channel", `Rules channel set to ${channel}.`)] });
    },
  },
  {
    category: "rules",
    data: new SlashCommandBuilder()
      .setName("postrules")
      .setDescription("Post a rules embed with an agree button.")
      .addChannelOption((o) => o.setName("channel").setDescription("Channel to post rules").setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const channel = interaction.options.getChannel("channel");
      const button = new ButtonBuilder().setCustomId("agree_rules").setLabel("I Agree").setStyle(ButtonStyle.Primary);
      const row = new ActionRowBuilder().addComponents(button);
      const embed = new EmbedBuilder()
        .setTitle("📜 Server Rules")
        .setDescription("1. Be respectful\n2. No spam\n3. No NSFW\n4. Follow Discord ToS\n5. Listen to staff\n\nClick **I Agree** to accept the rules.")
        .setColor(config.colors.primary);
      await channel.send({ embeds: [embed], components: [row] });
      await interaction.reply({ embeds: [success("Rules Posted", `Rules posted to ${channel}.`)], ephemeral: true });
    },
  },
  {
    category: "rules",
    data: new SlashCommandBuilder()
      .setName("rules")
      .setDescription("Show the server rules."),
    async execute(interaction) {
      const embed = new EmbedBuilder()
        .setTitle("📜 Server Rules")
        .setDescription("1. Be respectful\n2. No spam\n3. No NSFW\n4. Follow Discord ToS\n5. Listen to staff")
        .setColor(config.colors.primary);
      await interaction.reply({ embeds: [embed] });
    },
  },
];
