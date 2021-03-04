const mongo = require("./mongo");
const settingSchema = require("./schemas/settings-schema");

getCommandPrefix = async (guildID) => {
  await mongo().then(async (mongoose) => {
    try {
      const prefix = await settingSchema.findOne({ _id: guildID })
        .commandPrefix;
      if (prefix) {
        return prefix;
      } else return "!";
    } finally {
      await mongoose.connection.close();
    }
  });
};

module.exports = (client, aliases, callback) => {
  if (typeof aliases === "string") {
    aliases = [aliases];
  }

  client.on("message", (message) => {
    const { content, guild } = message;

    aliases.forEach((alias) => {
      const command = getCommandPrefix(guild.id) + alias;

      if (content.startsWith(`${command} `) || content === command) {
        console.log(`Running the command ${command}`);
        callback(message);
      }
    });
  });
};
