const { commandDescriptions } = require("../createHelpDescriptions");

async function listAllCommands(message) {
  let { permissions, roles } = message.member;

  let commandList = "";

  for (const command of commandDescriptions) {
    let {
      commands,
      requiredRoles,
      requiredPermissions,
      expectedArgs,
      description,
    } = command;

    console.log(permissions);
    console.log(requiredPermissions);
    console.log(permissions.any(requiredPermissions));

    if (!requiredRoles.every((role) => roles.cache.has(role))) continue;
    if (!(await permissions.has(requiredPermissions))) continue;

    commandList += `\n[${commands}] ${expectedArgs}: ${description}`;
  }
  message.reply(`Your available commands are:${commandList}`);
}

function describeCommand(message, argument) {}

module.exports = {
  commands: ["help", "commandList"],
  maxArgs: 1,
  callback: (message, arguments) => {
    if (arguments.length !== 0) {
      describeCommand(message, arguments[0]);
      return;
    }
    listAllCommands(message);
  },
  description: "",
};
