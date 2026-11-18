require("dotenv").config();

module.exports = {
  token: process.env.TOKEN,
  clientId: process.env.CLIENT_ID,
  devGuildId: process.env.DEV_GUILD_ID || null,
  ownerIds: (process.env.OWNER_IDS || "").split(",").map((s) => s.trim()).filter(Boolean),
  logChannelId: process.env.LOG_CHANNEL_ID || null,
  memberRoleId: process.env.MEMBER_ROLE_ID || null,
  verifiedRoleId: process.env.VERIFIED_ROLE_ID || null,
  welcomeChannelId: process.env.WELCOME_CHANNEL_ID || null,
  rulesChannelId: process.env.RULES_CHANNEL_ID || null,
  databaseUrl: process.env.DATABASE_URL || null,
  colors: {
    primary: 0x22c55e,
    success: 0x22c55e,
    warning: 0xf59e0b,
    danger: 0xef4444,
    info: 0x3b82f6,
    neutral: 0x64748b,
  },
};
