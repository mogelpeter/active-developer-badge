const fs = require('fs');
const path = require('path');
const { createInterface } = require('node:readline');
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');

const commandNames = ['badge'];
const configPath = path.resolve(__dirname, 'config.json');

// Check if config.json exists, if not create it
if (!fs.existsSync(configPath)) {
  const defaultConfig = {
    token: "YOUR_DISCORD_BOT_TOKEN_HERE"
  };
  fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), 'utf8');
  console.log('config.json has been created. Please add your Discord bot token.');
  process.exit(1);
}

// Read the config.json
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const token = config.token;

if (!token || token === "YOUR_DISCORD_BOT_TOKEN_HERE") {
  console.error('Invalid token in config.json. Please set your Discord bot token.');
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rl = createInterface({ input: process.stdin, output: process.stdout });

(async () => {
  try {
    await client.login(token);
    const rest = new REST({ version: '10' }).setToken(token);
    const commands = await rest.get(Routes.applicationCommands(client.user.id));
    const toBeRemoved = commands.filter((c) => commandNames.includes(c.name));

    console.log('Removing commands:', toBeRemoved);

    for (const command of toBeRemoved) {
      await rest.delete(Routes.applicationCommand(client.user.id, command.id));
      console.log('Removed:', command.id, command.name);
    }

    console.log('Done');
  } catch (error) {
    console.error('Error removing commands:', error);
  } finally {
    rl.close();
    process.exit();
  }
})();
