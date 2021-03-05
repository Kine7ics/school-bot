module.exports = {
  commands: ["setPrefix", "changePrefix"],
  expectedArgs: "<newPrefix>",
  permissionError: "You need admin permissions to run this command",
  minArgs: 1,
  maxArgs: 1,
  callback: async (message, arguments) => {
    const mongo = require("../../mongo"),
      settingSchema = require("../../schemas/settings-schema");

    const { guild } = message;
    const newPrefix = arguments[0];

    await mongo().then(async (mongoose) => {
      try {
        await settingSchema
          .findOneAndUpdate(
            { _id: guild.id },
            { _id: guild.id, commandPrefix: newPrefix },
            { upsert: true }
          )
          .then(() => {
            message.reply(
              `the command prefix has been changed to: "${newPrefix}"`
            );
          });
      } finally {
        await mongoose.connection.close();
      }
    });
  },
  permissions: ["ADMINISTRATOR"],
  description: "changes the command prefix.",
};
