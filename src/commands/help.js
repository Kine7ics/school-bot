const { commandDescriptions } = require("../createHelpDescriptions");

async function listAllCommands(message) {
  let { permissions, roles } = message.member;

  let commandList = "";

  for (const command of commandDescriptions) {
    let { commands, requiredRoles, requiredPermissions, description } = command;

    if (!requiredRoles.every((role) => roles.cache.has(role))) continue;
    if (!(await permissions.has(requiredPermissions))) continue;

    commandList += `\n[${commands}]: ${description}`;
  }
  message.reply(`Your available commands are:${commandList}`);
}

async function describeCommand(message, argument) {
  let { permissions, roles } = message.member;

  const command = commandDescriptions.find((command) =>
    command.commands.includes(argument)
  );

  if (command) {
    let {
      requiredRoles,
      requiredPermissions,
      expectedArgs,
      description,
    } = command;

    if (
      requiredRoles.every((role) => roles.cache.has(role)) &&
      (await permissions.has(requiredPermissions))
    ) {
      message.reply(`Usage: ${argument} ${expectedArgs} (${description})`);
      return;
    }

    message.reply("You don't have access to that command.");
    return;
  }

  message.reply("That isn't a command");
}

module.exports = {
  commands: ["help", "commandList"],
  maxArgs: 1,
  expectedArgs: "?<command>",
  callback: (message, arguments) => {
    if (arguments.length !== 0) {
      describeCommand(message, arguments[0]);
      return;
    }
    listAllCommands(message);
  },
  description:
    "prints list of your available commands, if you pass in another command it prints that command's usage",
};
