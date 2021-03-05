require("dotenv").config();

const path = require("path");
const fs = require("fs");

const Discord = require("discord.js");
const client = new Discord.Client();

const createVC = require("./createVC");
const { createHelpDescription } = require("./createHelpDescriptions");

client.on("ready", async () => {
  console.log(`${client.user.tag} is ready!`);

  const baseFile = "command-base.js";
  const commandBase = require(`./commands/${baseFile}`);

  const readCommands = (dir) => {
    const files = fs.readdirSync(path.join(__dirname, dir));
    for (const file of files) {
      const stat = fs.lstatSync(path.join(__dirname, dir, file));
      if (stat.isDirectory()) {
        readCommands(path.join(dir, file));
      } else if (file !== baseFile) {
        const option = require(path.join(__dirname, dir, file));
        let helpInfo = commandBase(client, option);
        createHelpDescription(option, helpInfo);
      }
    }
  };

  readCommands("commands");

  // Activate all features.
  createVC(client); // Activates join for VC feature.
});

client.login(process.env.DISCORD_TOKEN).then(() => {
  console.log(`Logged in as ${client.user.tag}`);
});
