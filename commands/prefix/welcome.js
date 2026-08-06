const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const store = require("../../../utils/store");
const config = require("../../../config");
const { success, error, info } = require("../../../utils/embed");

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

module.exports = [
  {
    name: "welcome",
    aliases: ["wlc"],
    description: "View welcome settings (prefix).",
    async execute(message) {
      const s = store.getSettings(message.guild.id);
      const text = `Welcome channel: ${s.welcomeChannel ? `<#${s.welcomeChannel}>` : "Not set"}\nMember role: ${s.memberRole ? `<@&${s.memberRole}>` : "Not set"}\nVerified role: ${s.verifiedRole ? `<@&${s.verifiedRole}>` : "Not set"}\nWelcomed: ${store.getWelcomeCount(message.guild.id)}`;
      await message.channel.send({ embeds: [info("Welcome Settings", text)] });
    },
  },
  {
    name: "setwelcome",
    description: "Set welcome channel (prefix). Usage: -*-prefix*-setwelcome #channel",
    async execute(message, args) {
      if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) return message.reply({ embeds: [error("No permission", "Need Manage Server.")] });
      const channel = message.mentions.channels.first();
      if (!channel) return message.reply({ embeds: [error("Usage", "Mention a channel.")] });
      store.setSetting(message.guild.id, "welcomeChannel", channel.id);
      await message.channel.send({ embeds: [success("Welcome", `Welcome channel set to ${channel}.`)] });
    },
  },
  {
    name: "setmemberrole",
    description: "Set member role (prefix). Usage: -*-prefix*-setmemberrole @role",
    async execute(message, args) {
      if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) return message.reply({ embeds: [error("No permission", "Need Manage Server.")] });
      const role = message.mentions.roles.first();
      if (!role) return message.reply({ embeds: [error("Usage", "Mention a role.")] });
      store.setSetting(message.guild.id, "memberRole", role.id);
      await message.channel.send({ embeds: [success("Member Role", `New members get **${role.name}**.`)] });
    },
  },
  {
    name: "setverifiedrole",
    description: "Set verified role (prefix). Usage: -*-prefix*-setverifiedrole @role",
    async execute(message, args) {
      if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) return message.reply({ embeds: [error("No permission", "Need Manage Server.")] });
      const role = message.mentions.roles.first();
      if (!role) return message.reply({ embeds: [error("Usage", "Mention a role.")] });
      store.setSetting(message.guild.id, "verifiedRole", role.id);
      await message.channel.send({ embeds: [success("Verified Role", `Verified users get **${role.name}**.`)] });
    },
  },
  {
    name: "setwelcomeembed",
    aliases: ["setwmsg"],
    description: "Set welcome message (prefix). Usage: -*-prefix*-setwelcomeembed <message>",
    async execute(message, args) {
      if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) return message.reply({ embeds: [error("No permission", "Need Manage Server.")] });
      if (args.length === 0) return message.reply({ embeds: [error("Usage", "Provide a message.")] });
      store.setSetting(message.guild.id, "welcomeMessage", args.join(" "));
      await message.channel.send({ embeds: [success("Welcome Message", "Saved!")] });
    },
  },
  {
    name: "setupwelcome",
    description: "Auto-setup welcome (prefix). Usage: -*-prefix*-setupwelcome #channel [@role]",
    async execute(message, args) {
      if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) return message.reply({ embeds: [error("No permission", "Need Manage Server.")] });
      const channel = message.mentions.channels.first();
      const role = message.mentions.roles.first();
      if (!channel) return message.reply({ embeds: [error("Usage", "Mention a channel.")] });
      store.setSetting(message.guild.id, "welcomeChannel", channel.id);
      if (role) store.setSetting(message.guild.id, "memberRole", role.id);
      await message.channel.send({ embeds: [success("Setup Complete", `Welcome channel: ${channel}\nRole: ${role ? role.name : "Not set"}`)] });
    },
  },
  {
    name: "welcometest",
    description: "Test welcome message (prefix).",
    async execute(message) {
      const settings = store.getSettings(message.guild.id);
      const msg = settings.welcomeMessage || "Welcome to **{server}**, {user}! 🎉";
      const text = msg.replace(/{user}/g, `${message.author}`).replace(/{server}/g, message.guild.name).replace(/{count}/g, String(message.guild.memberCount));
      await message.channel.send({ embeds: [info("Welcome!", text)] });
    },
  },
  {
    name: "setupverify",
    description: "Post verify button (prefix). Usage: -*-prefix*-setupverify #channel",
    async execute(message, args) {
      if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) return message.reply({ embeds: [error("No permission", "Need Manage Server.")] });
      const channel = message.mentions.channels.first() || message.channel;
      const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require("discord.js");
      const button = new ButtonBuilder().setCustomId("verify_btn").setLabel("✅ Verify Me").setStyle(ButtonStyle.Success);
      const row = new ActionRowBuilder().addComponents(button);
      const embed = new EmbedBuilder().setTitle("Verification").setDescription("Click to verify!").setColor(config.colors.primary);
      await channel.send({ embeds: [embed], components: [row] });
      await message.channel.send({ embeds: [success("Posted", "Verification button posted.")] });
    },
  },
  {
    name: "verify",
    description: "Verify a user (prefix). Usage: -*-prefix*-verify @user",
    async execute(message, args) {
      if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) return message.reply({ embeds: [error("No permission", "Need Manage Server.")] });
      const target = message.mentions.members.first();
      if (!target) return message.reply({ embeds: [error("Usage", "Mention a user.")] });
      const s = store.getSettings(message.guild.id);
      const roleId = s.verifiedRole || config.verifiedRoleId;
      if (!roleId) return message.reply({ embeds: [error("Not configured", "Set a verified role first.")] });
      await target.roles.add(roleId).catch(() => {});
      store.addVerified(message.guild.id, target.id);
      await message.channel.send({ embeds: [success("Verified", `${target.user.tag} verified!`)] });
    },
  },
  {
    name: "verifyinfo",
    description: "Check verification (prefix). Usage: -*-prefix*-verifyinfo [@user]",
    async execute(message, args) {
      const target = message.mentions.members.first() || message.member;
      const verified = store.isVerified(message.guild.id, target.id);
      await message.channel.send({ embeds: [info("Verification", `${target.user.tag} is ${verified ? "verified ✅" : "not verified ❌"}.`)] });
    },
  },
  {
    name: "rules",
    description: "Show rules (prefix).",
    async execute(message) {
      const s = store.getSettings(message.guild.id);
      const rules = s.rules || [{ text: "Be respectful" }, { text: "No spam" }, { text: "No NSFW" }];
      await message.channel.send({ embeds: [info("📜 Rules", rules.map((r, i) => `**${i + 1}.** ${r.text || r}`).join("\n"))] });
    },
  },
  {
    name: "addrule",
    description: "Add a rule (prefix). Usage: -*-prefix*-addrule <rule>",
    async execute(message, args) {
      if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) return message.reply({ embeds: [error("No permission", "Need Manage Server.")] });
      if (args.length === 0) return message.reply({ embeds: [error("Usage", "Provide a rule.")] });
      const s = store.getSettings(message.guild.id);
      const rules = s.rules || [];
      rules.push(args.join(" "));
      store.setSetting(message.guild.id, "rules", rules);
      await message.channel.send({ embeds: [success("Rule Added", `Rule ${rules.length}: ${args.join(" ")}`)] });
    },
  },
  {
    name: "removerule",
    description: "Remove a rule (prefix). Usage: -*-prefix*-removerule <number>",
    async execute(message, args) {
      if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) return message.reply({ embeds: [error("No permission", "Need Manage Server.")] });
      const num = parseInt(args[0], 10);
      const s = store.getSettings(message.guild.id);
      const rules = s.rules || [];
      if (!num || num < 1 || num > rules.length) return message.reply({ embeds: [error("Invalid", "Provide a valid rule number.")] });
      rules.splice(num - 1, 1);
      store.setSetting(message.guild.id, "rules", rules);
      await message.channel.send({ embeds: [success("Removed", `Rule ${num} removed.`)] });
    },
  },
  {
    name: "help",
    aliases: ["h"],
    description: "Show help (prefix).",
    async execute(message) {
      const commands = message.client.prefixCommands;
      const text = commands.map((c) => `\`${config.prefix}${c.name}\` — ${c.description.replace(/\*-prefix-\*/g, config.prefix)}`).slice(0, 40).join("\n");
      await message.channel.send({ embeds: [info("CoopWelcome Prefix Help", text.slice(0, 4000))] });
    },
  },
  {
    name: "ping",
    description: "Pong! (prefix).",
    async execute(message) {
      const now = Date.now();
      const m = await message.channel.send({ embeds: [info("Pinging...")] });
      await m.edit({ embeds: [success("Pong!", `Latency: ${Date.now() - now}ms`)] });
    },
  },
  {
    name: "botinfo",
    description: "Bot info (prefix).",
    async execute(message) {
      await message.channel.send({ embeds: [info("🤖 CoopWelcome", `Servers: ${message.client.guilds.cache.size}\nSlash: ${message.client.slashCommands.size}\nPrefix: ${message.client.prefixCommands.size}`)] });
    },
  },
  {
    name: "avatar",
    aliases: ["av"],
    description: "Get avatar (prefix). Usage: -*-prefix*-avatar [@user]",
    async execute(message, args) {
      const user = message.mentions.users.first() || message.author;
      await message.channel.send({ embeds: [new EmbedBuilder().setTitle(user.tag).setColor(config.colors.primary).setImage(user.displayAvatarURL({ size: 1024 }))] });
    },
  },
  {
    name: "serverinfo",
    description: "Server info (prefix).",
    async execute(message) {
      const g = message.guild;
      await message.channel.send({ embeds: [new EmbedBuilder().setTitle(`📊 ${g.name}`).setColor(config.colors.primary).addFields(
        { name: "ID", value: g.id, inline: true },
        { name: "Members", value: String(g.memberCount), inline: true },
        { name: "Owner", value: g.ownerId, inline: true },
        { name: "Channels", value: String(g.channels.cache.size), inline: true },
      )] });
    },
  },
  {
    name: "whois",
    description: "User info (prefix). Usage: -*-prefix*-whois [@user]",
    async execute(message, args) {
      const target = message.mentions.members.first() || message.member;
      await message.channel.send({ embeds: [new EmbedBuilder().setTitle(target.user.tag).setColor(config.colors.primary).setThumbnail(target.user.displayAvatarURL()).addFields(
        { name: "ID", value: target.id, inline: true },
        { name: "Joined", value: new Date(target.joinedAt).toLocaleDateString(), inline: true },
      )] });
    },
  },
  {
    name: "invite",
    description: "Invite link (prefix).",
    async execute(message) {
      await message.channel.send({ embeds: [success("Invite", `Invite: https://discord.com/api/oauth2/authorize?client_id=${config.clientId}&permissions=8&scope=bot%20applications.commands`)] });
    },
  },
  {
    name: "uptime",
    description: "Uptime (prefix).",
    async execute(message) {
      const s = Math.floor(message.client.uptime / 1000);
      await message.channel.send({ embeds: [success("Uptime", `${Math.floor(s / 86400)}d ${Math.floor((s % 86400) / 3600)}h ${Math.floor((s % 3600) / 60)}m ${s % 60}s`)] });
    },
  },
  {
    name: "echo",
    description: "Echo (prefix). Usage: -*-prefix*-echo <text>",
    async execute(message, args) {
      if (args.length === 0) return message.reply({ embeds: [error("Usage", "Provide text.")] });
      await message.channel.send(args.join(" "));
    },
  },
  {
    name: "membercount",
    description: "Member count (prefix).",
    async execute(message) {
      await message.channel.send({ embeds: [success("Members", `**${message.guild.memberCount}** members.`)] });
    },
  },
  {
    name: "8ball",
    description: "Ask 8-ball (prefix).",
    async execute(message, args) {
      const answers = ["Yes", "No", "Maybe", "Definitely", "Ask again later", "Signs point to yes"];
      await message.channel.send({ embeds: [info("🎱", `**A:** ${rand(answers)}`)] });
    },
  },
  {
    name: "coin",
    description: "Coin flip (prefix).",
    async execute(message) {
      await message.channel.send({ embeds: [success("🪙", `**${Math.random() < 0.5 ? "Heads" : "Tails"}**!`)] });
    },
  },
  {
    name: "roll",
    description: "Roll die (prefix). Usage: -*-prefix*-roll [sides]",
    async execute(message, args) {
      const sides = parseInt(args[0] || "6", 10);
      await message.channel.send({ embeds: [success("🎲", `d${sides}: **${Math.floor(Math.random() * sides) + 1}**`)] });
    },
  },
  {
    name: "joke",
    description: "Joke (prefix).",
    async execute(message) {
      const jokes = ["Why don't scientists trust atoms? Because they make up everything!", "I told my wife she should embrace her mistakes. She hugged me.", "Why did the scarecrow win an award? Because he was outstanding in his field!"];
      await message.channel.send({ embeds: [success("😂", rand(jokes))] });
    },
  },
  {
    name: "hug",
    description: "Hug (prefix). Usage: -*-prefix*-hug @user",
    async execute(message) {
      const user = message.mentions.users.first();
      if (!user) return message.reply({ embeds: [error("Usage", "Mention a user.")] });
      await message.channel.send({ embeds: [info("🤗", `${message.author} hugs ${user}!`)] });
    },
  },
  {
    name: "greet",
    description: "Greet (prefix). Usage: -*-prefix*-greet @user",
    async execute(message) {
      const user = message.mentions.users.first();
      if (!user) return message.reply({ embeds: [error("Usage", "Mention a user.")] });
      await message.channel.send({ embeds: [success("👋", `Welcome to the party, ${user}! 🎉`)] });
    },
  },
  {
    name: "compliment",
    description: "Compliment (prefix). Usage: -*-prefix*-compliment @user",
    async execute(message) {
      const user = message.mentions.users.first();
      if (!user) return message.reply({ embeds: [error("Usage", "Mention a user.")] });
      const comps = ["You're amazing!", "You have a great smile!", "You're a legend!"];
      await message.channel.send({ embeds: [info("💖", `${user}, ${rand(comps)}`)] });
    },
  },
  {
    name: "welcomecount",
    description: "Welcome count (prefix).",
    async execute(message) {
      await message.channel.send({ embeds: [success("Total Welcomed", `**${store.getWelcomeCount(message.guild.id)}** members!`)] });
    },
  },
  {
    name: "confetti",
    description: "Confetti (prefix).",
    async execute(message) {
      await message.channel.send({ embeds: [success("🎉🎊", "Confetti everywhere! 🎊🎉")] });
    },
  },
];
