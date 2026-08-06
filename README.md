<div align="center">

# 👋 CoopWelcome

### The all-in-one Discord welcome & verification bot with **63 slash commands** + **40 prefix commands**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org)
[![Discord.js](https://img.shields.io/badge/discord.js-14-blueviolet.svg)](https://discord.js.org)
[![Version](https://img.shields.io/badge/version-1.0.0-orange.svg)](#)

</div>

CoopWelcome makes your Discord server feel **inviting**. It sends beautiful welcome/leave messages, requires new members to verify with a button, auto-assigns roles, and lets you create custom rules that newcomers must accept before they can chat. Every feature works as a **slash command** or a **prefix command**.

---

## 📦 Features

- 👋 **Custom Welcome Embeds** — fully customizable messages with `{user}`, `{server}`, `{count}` placeholders
- 👋 **Leave Messages** — automatic goodbye messages when members leave
- 🔐 **Button Verification** — one-click verification with a custom verified role
- 🎭 **Auto Role Assignment** — automatically assign roles to new members
- 📜 **Custom Rules** — create rules with an "I Agree" button
- 📊 **Welcome Statistics** — track how many members you've welcomed
- 🎨 **Custom Embed Colors** — match your server's theme
- 🎉 **Fun Commands** — confetti, hugs, compliments, and more
- 📝 **Test Mode** — preview welcome/goodbye messages before going live

---

## 🚀 Installation

### Prerequisites
- [Node.js](https://nodejs.org) **v18 or higher**
- A Discord application with a bot token ([Discord Developer Portal](https://discord.com/developers/applications))

### Step 1 — Create the bot on Discord

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications) and click **New Application**.
2. Name it `CoopWelcome`.
3. Go to the **Bot** tab → click **Reset Token** → copy the token.
4. Enable these **Privileged Gateway Intents**:
   - ✅ **Server Members Intent**
   - ✅ **Message Content Intent**
5. Under **OAuth2 → URL Generator**:
   - Scopes: `bot`, `applications.commands`
   - Permissions: **Administrator** (or specific permissions)
   - Use the URL to invite the bot.

### Step 2 — Set up the project

```bash
git clone https://github.com/CoopFT/CoopWelcome.git
cd CoopWelcome
npm install
cp .env.example .env
```

### Step 3 — Configure `.env`

```env
TOKEN=YOUR_BOT_TOKEN_HERE
CLIENT_ID=YOUR_CLIENT_ID_HERE
DEV_GUILD_ID=
PREFIX=!
OWNER_IDS=
MEMBER_ROLE_ID=
VERIFIED_ROLE_ID=
WELCOME_CHANNEL_ID=
```

### Step 4 — Register commands & run

```bash
npm run register:guild   # or npm run deploy for global
npm start
```

You should see:
```
[OK] Loaded 63 slash commands.
[OK] Loaded 40 prefix commands.
[OK] Logged in as CoopWelcome#1234
```

---

## 🎮 Command Reference

### Slash Commands (`/`)

#### 👋 Welcome
| Command | Description |
|---------|-------------|
| `/welcome` | View welcome settings |
| `/setupwelcome #channel [@role]` | Auto-setup welcome system |
| `/setwelcomechannel #channel` | Set welcome channel |
| `/setleavechannel #channel` | Set leave channel |
| `/setgoodbyechannel #channel` | Set goodbye channel |
| `/setmemberrole @role` | Set auto-assign member role |
| `/setverifiedrole @role` | Set verification role |
| `/setwelcomeembed <message>` | Custom welcome message |
| `/setleaveembed <message>` | Custom leave message |
| `/setwelcomecolor <hex>` | Custom embed color |
| `/welcometest #channel` | Test welcome message |
| `/goodbyetest #channel` | Test goodbye message |
| `/welcomepreview` | Preview welcome message |
| `/welcomestats` | Welcome statistics |
| `/welcomelist` | Recent welcomes |
| `/welcomecount` | Total welcomed |
| `/enablewelcome` | Enable welcome messages |
| `/disablewelcome` | Disable welcome messages |

#### 🔐 Verification
| Command | Description |
|---------|-------------|
| `/setupverify #channel` | Post verification button |
| `/verifypanel #channel` | Post verification panel |
| `/verifytoggle [enabled]` | Toggle verification |
| `/forceverify @user` | Manually verify a user |
| `/unverify @user` | Remove verification |
| `/verifyinfo @user` | Check verification status |
| `/verifyrolelist` | List verified users |
| `/setverifychannel #channel` | Set verify channel |

#### 📜 Rules
| Command | Description |
|---------|-------------|
| `/rules` | Show server rules |
| `/setrules #channel` | Set rules channel |
| `/postrules #channel` | Post rules with agree button |
| `/addrule <rule>` | Add a rule |
| `/removerule <number>` | Remove a rule |
| `/ruleslist` | List all rules |

#### 🛠️ Utility
| Command | Description |
|---------|-------------|
| `/help` | Show all commands |
| `/ping` | Check latency |
| `/botinfo` | Bot info |
| `/avatar @user` | Get avatar |
| `/invite` | Invite link |
| `/serverinfo` | Server info |
| `/whois @user` | User info |
| `/membercount` | Member count |
| `/uptime` | Uptime |
| `/echo <text>` | Echo text |
| `/poll <question>` | Create poll |
| `/servericon` | Server icon |
| `/emoji :emoji:` | Enlarge emoji |

#### 🎉 Fun
| Command | Description |
|---------|-------------|
| `/confetti` | Confetti! |
| `/8ball <question>` | 8-ball |
| `/coinflip` | Coin flip |
| `/diceroll [sides]` | Roll die |
| `/greet @user` | Greet a user |
| `/joke` | Get a joke |
| `/dadjoke` | Dad joke |
| `/hug @user` | Hug a user |
| `/pat @user` | Pat a user |
| `/slap @user` | Slap a user |
| `/cat` | Cat fact |
| `/rate <thing>` | Rate something |
| `/compliment @user` | Compliment |
| `/welcomeparty @user` | Welcome party |
| `/waveto @user` | Wave to |
| `/highfive @user` | High-five |
| `/welcomeannounce @user` | Announce member |
| `/celebrate` | Celebrate! |

**Total: 63 slash commands** ✨

---

### Prefix Commands (`!`)

| Command | Description |
|---------|-------------|
| `!welcome` | View settings |
| `!setwelcome` | Set welcome channel |
| `!setmemberrole` | Set member role |
| `!setverifiedrole` | Set verified role |
| `!setwelcomeembed` | Custom welcome message |
| `!setupwelcome` | Auto-setup |
| `!welcometest` | Test welcome |
| `!setupverify` | Post verify button |
| `!verify` | Verify a user |
| `!verifyinfo` | Check verification |
| `!rules` | Show rules |
| `!addrule` | Add rule |
| `!removerule` | Remove rule |
| `!help` | Show help |
| `!ping` | Pong |
| `!botinfo` | Bot info |
| `!avatar` | Get avatar |
| `!serverinfo` | Server info |
| `!whois` | User info |
| `!invite` | Invite link |
| `!uptime` | Uptime |
| `!echo` | Echo |
| `!membercount` | Member count |
| `!8ball` | 8-ball |
| `!coin` | Coin flip |
| `!roll` | Roll die |
| `!joke` | Joke |
| `!hug` | Hug |
| `!greet` | Greet |
| `!compliment` | Compliment |
| `!welcomecount` | Welcome count |
| `!confetti` | Confetti |

**Total: 40 prefix commands** 🤖

---

## 📘 Tutorial — How to Use CoopWelcome

### 1. Quick Setup

1. **Invite the bot** to your server.
2. Run `/setupwelcome #welcome @Member` — this sets the welcome channel and auto-assign role in one step.
3. Run `/setupverify #rules` to post the verification button.

You're done! New members will now:
1. Get a warm welcome message.
2. Receive the **Member** role automatically.
3. Click **✅ Verify Me** to get the **Verified** role.

### 2. Customize the Welcome Message

```
/setwelcomeembed Welcome to {server}, {user}! We're so happy to have you. 🎉
```

Available placeholders:
- `{user}` — the new member (mention)
- `{server}` — your server name
- `{count}` — current member count

### 3. Set Up Rules

1. Run `/addrule Be respectful to everyone`.
2. Run `/addrule No NSFW content`.
3. Run `/postrules #rules` to post the rules with an **I Agree** button.

### 4. Manage Verification

- Check who's verified: `/verifyinfo @user`
- Manually verify: `/forceverify @user`
- Remove verification: `/unverify @user`
- Toggle the whole system: `/verifytoggle`

### 5. Track Welcome Stats

Run `/welcomestats` or `/welcomecount` to see how many members the bot has welcomed. Use `/welcomelist` to see recent joins.

---

## 🗂️ Project Structure

```
CoopWelcome/
├── index.js                 # Entry point
├── deploy-commands.js       # Registers slash commands
├── config.js                # Configuration
├── .env.example
├── commands/
│   ├── slash/               # 63 slash commands
│   │   ├── welcome/         # welcome commands
│   │   ├── util/            # utility + fun
│   │   └── extra/           # rules, verification, more
│   └── prefix/              # 40 prefix commands
├── handlers/                # Event handlers (incl. verify.js)
├── utils/                   # Helpers
└── package.json
```

---

## 🔧 Development

### Add a slash command
```js
const { SlashCommandBuilder } = require("discord.js");
module.exports = {
  category: "welcome",
  data: new SlashCommandBuilder().setName("hello").setDescription("Hello!"),
  async execute(interaction) { await interaction.reply("Hello!"); },
};
```

### Add a prefix command
```js
module.exports = {
  name: "hello",
  description: "Hello!",
  async execute(message) { await message.channel.send("Hello!"); },
};
```

---

## 📄 License

MIT License. Made with ❤️ by the CoopFT team. Find more bots on the [CoopFT Marketplace](https://coopft.com/marketplace).

</div>
