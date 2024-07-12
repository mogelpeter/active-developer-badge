
# Discord Bot Setup for Active Developer Badge

## Introduction

This guide will walk you through setting up a Discord bot to earn the Active Developer Badge. Follow the steps carefully to ensure your bot is set up correctly and eligible for the badge.

## Instructions

### Step 1: Create a New Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications).
2. Click the **New Application** button.
3. Give your application a name and create it.

### Step 2: Create a Bot Account

1. Navigate to the **Bot** tab.
2. Click **Add Bot** and confirm.
3. Click **Reset Token** to generate a new token. If you have 2FA enabled, you'll need your code.
4. Copy the generated token.

### Step 3: Clone the Repository and Set Up the Bot

1. Clone this repository to your local machine or use Replit https://replit.com/badge/github/hackermondev/discord-active-developer-badge
2. Create a `config.json` file in the root of the project with the following content:
   ```json
   {
     "token": "YOUR_DISCORD_BOT_TOKEN_HERE"
   }
   ```
3. Replace `YOUR_DISCORD_BOT_TOKEN_HERE` with the token you copied earlier.

### Step 4: Run the Bot

1. Open a terminal and navigate to the project directory.
2. Run `npm install` to install the necessary dependencies.
3. Start the bot with `npm start`.
4. Wait for it to print 'DONE | Application/Bot is up and running. DO NOT CLOSE THIS TAB UNLESS YOU ARE FINISHED USING THE BOT, IT WILL PUT THE BOT OFFLINE.' in the console.

### Step 5: Add the Bot to Your Server

1. Go back to the application page, go to the **General Information** tab, scroll down and copy the **Application ID**.
2. Create a new Discord server (you can delete it at the end).
3. Enable community on the server (you only need to do this if you don't own any other Discord server with community enabled).
4. Return back to [Discord Developer Portal](https://discord.com/developers/applications).
5. Copy the application ID.
6. Use this invite link to add the application to the server: (replace `{applicationid}` with the copied ID) https://discord.com/oauth2/authorize?client_id={applicationid}&scope=bot%20applications.commands&permissions=105227086912

### Step 6: Test the Bot

1. In the server, go to a channel and use the `/badge` command on the bot.

### Step 7: Claim Your Badge

1. Go to the [Discord Active Developer Page](https://discord.com/developers/active-developer) and register everything.
2. If it says you're not eligible, it might be because you're not registered in their system yet. You might have to wait up to 24 hours.
3. Congrats on that shiny new badge!

**NOTE**: Make sure you have the **"Use data to improve Discord"** setting enabled under User Settings > Privacy & Safety, otherwise you won't be able to be marked as eligible.
