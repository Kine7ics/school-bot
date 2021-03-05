module.exports = {
  commands: ["setVCBuilderChannel", "setVCBuilder"],
  expectedArgs: "<newChannel>",
  permissionError: "You need admin permissions to run this command",
  minArgs: 1,
  maxArgs: 1,
  callback: async (message, arguments) => {
    const mongo = require("../../mongo"),
      settingSchema = require("../../schemas/settings-schema");

    const { guild } = message;
    const { id, name } = guild.channels.cache.find(
      (channel) => channel.name === arguments[0]
    );

    await mongo().then(async (mongoose) => {
      try {
        await settingSchema
          .findOneAndUpdate(
            { _id: guild.id },
            {
              _id: guild.id,
              joinForVC_ID: id,
            },
            { upsert: true }
          )
          .then(() => {
            message.reply(`The new Build a VC channel is: ${name}`);
          });
      } finally {
        await mongoose.connection.close();
      }
    });
  },
  permissions: ["ADMINISTRATOR"],
  description: "sets the Build a VC channel",
};
