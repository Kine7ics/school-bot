exports.commandDescriptions = commandDescriptions = [];

exports.createHelpDescription = (commandBase, helpInfo) => {
  let { description } = commandBase;
  let { requiredRoles, commands, requiredPermissions, expectedArgs } = helpInfo;
  commandDescriptions.push({
    commands,
    requiredPermissions,
    requiredRoles,
    expectedArgs,
    description,
  });
};
