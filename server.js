// server.js - Discord Role Checker API Bot

const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");
const config = require("./config.json");
const app = express();
const port = process.env.PORT || 3000;

// Discord bot setup
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

client.once("ready", () => {
  console.log(`Discord bot is online as ${client.user.tag}`);
});

// Health endpoint for uptime monitoring
app.get("/health", (req, res) => {
  res.send("OK");
});

// Main endpoint: /checkRole/:discordId
app.get("/checkRole/:discordId", async (req, res) => {
  const { discordId } = req.params;
  try {
    const guild = await client.guilds.fetch(config.guildId);
    const member = await guild.members.fetch(discordId);

    const roleIds = member.roles.cache.map((r) => r.id);
    const roleNames = member.roles.cache.map((r) => r.name);

    return res.status(200).json({
      discordId,
      tag: member.user.tag,
      nickname: member.nickname,
      roles: roleIds,
      roleNames: roleNames
    });
  } catch (err) {
    console.error("Error fetching member:", err);
    return res.status(404).json({ error: "User not found or bot not in guild." });
  }
});

// Start Express API after Discord bot is ready
client.login(config.token).then(() => {
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
  });
});
