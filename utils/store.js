const fs = require("fs");
const path = require("path");
const DATA_DIR = path.join(__dirname, "..", "data");
const FILE = path.join(DATA_DIR, "store.json");
let memory = { settings: {}, welcomeRecords: {} };

function load() {
  try {
    if (fs.existsSync(FILE)) memory = { ...memory, ...JSON.parse(fs.readFileSync(FILE, "utf8")) };
  } catch (err) {}
}
function save() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(memory, null, 2));
  } catch (err) {}
}
load();

module.exports = {
  getSettings(guildId) { return memory.settings[guildId] || {}; },
  setSetting(guildId, key, value) {
    if (!memory.settings[guildId]) memory.settings[guildId] = {};
    memory.settings[guildId][key] = value;
    save();
  },
  recordWelcome(guildId, userId) {
    if (!memory.welcomeRecords[guildId]) memory.welcomeRecords[guildId] = [];
    memory.welcomeRecords[guildId].push({ userId, ts: new Date().toISOString() });
    save();
  },
  getWelcomeCount(guildId) { return (memory.welcomeRecords[guildId] || []).length; },
  getRecentWelcomes(guildId, limit = 10) {
    return (memory.welcomeRecords[guildId] || []).slice(-limit).reverse();
  },
  addVerified(guildId, userId) {
    if (!memory.settings[guildId]) memory.settings[guildId] = {};
    if (!memory.settings[guildId].verifiedUsers) memory.settings[guildId].verifiedUsers = [];
    memory.settings[guildId].verifiedUsers.push(userId);
    save();
  },
  isVerified(guildId, userId) {
    return (memory.settings[guildId]?.verifiedUsers || []).includes(userId);
  },
};
