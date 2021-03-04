module.exports = {
  commands: ["settings", "getSettings"],
  expectedArgs: "",
  maxArgs: 0,
  permissionError: "You need admin permissions to run this command",
  callback: async (message) => {
    const mongo = require("../../mongo"),
      settingSchema = require("../../schemas/settings-schema");

    const { author, guild } = message;

    await mongo().then(async (mongoose) => {
      try {
        await settingSchema
          .findOne({ _id: guild.id })
          .then(async (settings) => {
            let channel = author.dmChannel;
            if (!channel) {
              channel = await author.createDM();
            }

            await channel
              .send(JSON.stringify(settings))
              .then(() => {
                message.reply("Sending the server's settings");
              })
              .catch(console.error);
          });
      } catch (e) {
        message.reply("There was an error in sending the settings");
        console.error(e);
      } finally {
        await mongoose.connection.close();
      }
    });
  },
  permissions: ["ADMINISTRATOR"],
};
