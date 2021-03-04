module.exports = {
  commands: ["setPrefix", "changePrefix"],
  expectedArgs: "<newPrefix>",
  permissionError: "You need admin permissions to run this command",
  minArgs: 1,
  maxArgs: 1,
  callback: (message, arguments, text) => {
    //TODO: build this
  },
  permissions: ["ADMINISTRATOR"],
};
