// Load environment variables from .env file
require('dotenv').config();

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

// Check if .env exists, if not create a sample one
const envPath = path.resolve(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, 'DISCORD_BOT_TOKEN=YOUR_DISCORD_BOT_TOKEN_HERE', 'utf8');
  console.log('.env file has been created. Please add your Discord bot token.');
  process.exit(1);
}

// Get token from environment variables (prioritize Replit Secrets)
const token = process.env.DISCORD_BOT_TOKEN;

// Check if token exists and is valid
if (!token || token === "YOUR_DISCORD_BOT_TOKEN_HERE") {
  console.error('No valid Discord bot token found. Please set it in the .env file.');
  process.exit(1);
}

// Create Discord client with required intents
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent
  ] 
});

// Bot ready event handler
client.on('ready', () => {
  console.log(`Bot is online as ${client.user.tag}`);
  client.user.setPresence({
    activities: [{ 
      name: 'magic', 
      type: ActivityType.Streaming, 
      url: 'https://www.twitch.tv/streamer' 
    }],
    status: 'online',
  });
});

// Bot interaction handler
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'badge') {
    // Calculate ping
    const ping = Date.now() - interaction.createdTimestamp;
    
    // Generate random color for embed
    let randomColor = Math.floor(Math.random() * 16777215).toString(16);
    randomColor = randomColor.padStart(6, '0');

    // Create embed response
    const embed = new EmbedBuilder()
      .setTitle(`Success - Generated in ${ping}ms`)
      .setDescription('Check https://discord.com/developers/active-developer in 24 hours and claim your badge!\n\nThe Application now shut down itself.')
      .setColor(`#${randomColor}`)
      .setFooter({
        text: `${interaction.user.id} - ${new Date().toLocaleString()}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      });

    await interaction.reply({ embeds: [embed] });

    // Change status and shut down bot
    console.log('Badge command executed. Shutting down...');
    client.user.setStatus('invisible');
    setTimeout(() => process.exit(0), 1000);
  }
});

// Main function to start the bot
(async () => {
  try {
    // Import modules using dynamic import for ESM compatibility
    const chalk = await import('chalk');
    const fetch = await import('node-fetch');

    // Check if Discord API is available
    console.log('Checking Discord API availability...');
    const ratelimitTest = await fetch.default('https://discord.com/api/v9/invites/discord-developers');
    if (!ratelimitTest.ok) {
      console.error('Node is being blocked by Discord. Please try again later.');
      process.exit(1);
    }

    // Login to Discord
    console.log('Logging in to Discord...');
    await client.login(token);
    
    // Initialize REST API
    const rest = new REST({ version: '10' }).setToken(token);

    // Register commands
    console.log('Registering slash commands...');
    const registeredCommands = await rest.put(
      Routes.applicationCommands(client.user.id), 
      { body: commands }
    );

    // Verify badge command was registered
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