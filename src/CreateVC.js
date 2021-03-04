const mongo = require("./mongo");
const settingsSchema = require("./schemas/settings-schema");

module.exports = (client) => {
  client.on("voiceStateUpdate", async (oldState, newState) => {
    const { guild } = newState;

    let vcBuildingChannelID;

    await mongo().then(async (mongoose) => {
      try {
        await settingsSchema.findOne({ _id: guild.id }).then((settings) => {
          vcBuildingChannelID = settings.joinForVC_ID();
        });
      } finally {
        await mongoose.connection.close();
      }
    });
  });
};
