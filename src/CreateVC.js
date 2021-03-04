const mongo = require("./mongo");
const settingsSchema = require("./schemas/settings-schema");

module.exports = (client) => {
  client.on("voiceStateUpdate", async (oldState, newState) => {
    const { guild, channelID, channel, member } = newState;

    await mongo().then(async (mongoose) => {
      try {
        await settingsSchema.findOne({ _id: guild.id }).then((settings) => {
          if (settings.joinForVC_ID() === channelID) {
            guild.channels.create(member.displayName, {
              parent: channel.parent,
              position: channel.position + 1,
            });
          }
        });
      } finally {
        await mongoose.connection.close();
      }
    });
  });
};
