module.exports = {
  commands: ["ping"],
  callback: (message) => {
    message.reply("Pong!");
  },
  description: "Pong!",
};
