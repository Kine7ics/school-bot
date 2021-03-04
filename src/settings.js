const mongo = require("./mongo");
const command = require("./command");
const settingsSchema = require("./schemas/settings-schema");

checkAdmin = (member, channel) => {
  if (!member.hasPermission("ADMINISTRATOR")) {
    channel.send("``You do not have permission to run this command.``");
    return true;
  }
  return false;
};

module.exports = (client) => {
  command(client, "settings", async (message) => {
    const { author, member, channel, guild } = message;

    if (!checkAdmin(member, channel)) return;

    author.createDM().then(async (dm) => {
      await mongo().then(async (mongoose) => {
        try {
          const settings = await settingsSchema.findOne({ _id: guild.id });
          await dm.send(JSON.stringify(settings));
        } finally {
          await mongoose.connection.close();
        }
      });
    });
  });

  command(client, "setPrefix", async (message) => {
    const { member, channel, guild } = message;

    if (!checkAdmin(member, channel)) return;

    await mongo().then(async (mongoose) => {
      try {
        await settingsSchema.findOneAndUpdate(
          { _id: guild.id },
          {
            _id: guild.id,
            commandPrefix: "!",
          },
          {
            upsert: true,
          }
        );
      } finally {
        await mongoose.connection.close();
      }
    });
  });
};
