# CoopWelcome

**CoopWelcome** is CoopFT's Discord welcome, leave-message, role-assignment and verification bot. All user-facing commands use Discord application commands.

## Features

- Custom welcome and goodbye messages with placeholders
- Automatic member-role assignment
- Button-based member verification
- Custom rules and agreement panels
- Welcome previews, tests, statistics and role configuration
- Utility and community commands

## Requirements

- Node.js 22 or newer
- A Discord application and bot token
- The `bot` and `applications.commands` OAuth2 scopes

Enable the **Server Members Intent** in the Discord Developer Portal. Message Content Intent is not required.

## Setup

```bash
npm install
cp .env.example .env
```

Configure your environment:

```env
TOKEN=YOUR_BOT_TOKEN
CLIENT_ID=YOUR_APPLICATION_ID
DEV_GUILD_ID=
OWNER_IDS=
LOG_CHANNEL_ID=
MEMBER_ROLE_ID=
VERIFIED_ROLE_ID=
WELCOME_CHANNEL_ID=
RULES_CHANNEL_ID=
DATABASE_URL=
```

## Register slash commands

For immediate testing in one server, set `DEV_GUILD_ID`:

```bash
npm run check:commands
npm run register:guild
```

For global registration:

```bash
npm run deploy
```

Start the bot:

```bash
npm start
```

## Example commands

`/setupwelcome`, `/setwelcomechannel`, `/setleavechannel`, `/setmemberrole`, `/setupverify`, `/verifypanel`, `/postrules`, and `/welcomestats`.

Use `/help` in Discord for the live command list.

## Project structure

- `commands/slash/` — slash-command modules
- `handlers/` — interaction, verification, member and ready handlers
- `utils/` — settings, persistence, formatting and logging helpers
- `deploy-commands.js` — command schema validation and registration

## Notes

- Never commit your bot token or other secrets.
- Check that the bot can view the welcome/rules channels and assign the configured roles.
- Place the bot's role above any role it must assign.
