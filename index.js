const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder, ActivityType } = require('discord.js');

// Define commands
const commands = [
  {
    name: 'badge',
    description: 'Shows the badge and latency of the bot'
  }
];

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

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('ready', () => {
  client.user.setPresence({
    activities: [{ name: 'magic', type: ActivityType.Streaming, url: 'https://www.twitch.tv/streamer' }],
    status: 'online',
  });
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'badge') {
    const ping = Date.now() - interaction.createdTimestamp;
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);

    const embed = new EmbedBuilder()
      .setTitle(`Success - Generated in ${ping}ms`)
      .setDescription('Check https://discord.com/developers/active-developer in 24 hours and claim your badge!\n\nThe Application now shut down itself.')
      .setColor(`#${randomColor}`)
      .setFooter({
        text: `${interaction.user.id} - ${new Date().toLocaleString()}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      });

    await interaction.reply({ embeds: [embed] });
    process.exit(0);
  }
});

// Main function to start the bot
(async () => {
  try {
    const [chalk, fetch] = await Promise.all([
      import('chalk'),
      import('node-fetch')
    ]);

    const ratelimitTest = await fetch.default(`https://discord.com/api/v9/invites/discord-developers`);
    if (!ratelimitTest.ok) {
      console.error('Node is being blocked by Discord. Please try again later.');
      process.exit(1);
    }

    await client.login(token);
    const rest = new REST({ version: '10' }).setToken(token);

    // Register commands
    const registeredCommands = await rest.put(Routes.applicationCommands(client.user.id), { body: commands });

    const badgeCommand = registeredCommands.find(cmd => cmd.name === 'badge');
    if (!badgeCommand) {
      console.error(chalk.default.red('Failed to register /badge command'));
      process.exit(1);
    }

    console.log(chalk.default.green('DONE | Application/Bot is up and running. DO NOT CLOSE THIS TAB UNLESS YOU ARE FINISHED USING THE BOT, IT WILL PUT THE BOT OFFLINE.'));

  } catch (error) {
    console.error('Error starting the bot:', error);
    process.exit(1);
  }
})();
