const mongo = require("./mongo");
const settingsSchema = require("./schemas/settings-schema");

module.exports = (client) => {
  let customChannels = [];

  client.on("voiceStateUpdate", async (oldState, newState) => {
    const { guild, channelID, channel, member } = newState;

    await mongo().then(async (mongoose) => {
      try {
        await settingsSchema
          .findOne({ _id: guild.id })
          .then(async (settings) => {
            if (settings.joinForVC_ID === channelID) {
              await guild.channels
                .create(`${member.displayName}'s channel`, {
                  parent: channel.parent,
                  type: "voice",
                })
                .then((createdChannel) => {
                  member.edit({ channel: createdChannel });
                  customChannels.push(createdChannel.id);
                });
            }
          });
      } finally {
        await mongoose.connection.close();
      }
    });
  });

  client.on("voiceStateUpdate", (oldState) => {
    customChannels.forEach((channel) => {
      if (
        channel === oldState.channelID &&
        oldState.channel.members.array().length === 0
      ) {
        oldState.channel.delete();
        customChannels.splice(customChannels.indexOf(channel));
      }
    });
  });
};
