const validatePermissions = (permissions) => {
  const validPermissions = [
    "CREATE_INSTANT_INVITE",
    "KICK_MEMBERS",
    "BAN_MEMBERS",
    "ADMINISTRATOR",
    "MANAGE_CHANNELS",
    "MANAGE_GUILD",
    "ADD_REACTIONS",
    "VIEW_AUDIT_LOG",
    "PRIORITY_SPEAKER",
    "STREAM",
    "VIEW_CHANNEL",
    "SEND_MESSAGES",
    "SEND_TTS_MESSAGES",
    "MANAGE_MESSAGES",
    "EMBED_LINKS",
    "ATTACH_FILES",
    "READ_MESSAGE_HISTORY",
    "MENTION_EVERYONE",
    "USE_EXTERNAL_EMOJIS",
    "VIEW_GUILD_INSIGHTS",
    "CONNECT",
    "SPEAK",
    "MUTE_MEMBERS",
    "DEAFEN_MEMBERS",
    "MOVE_MEMBERS",
    "USE_VAD",
    "CHANGE_NICKNAME",
    "MANAGE_NICKNAMES",
    "MANAGE_ROLES",
    "MANAGE_WEBHOOKS",
    "MANAGE_EMOJIS",
  ];

  for (const permission of permissions) {
    if (!validPermissions.includes(permission)) {
      throw new Error(`Unknown permission node "${permission}"`);
    }
  }
};

const getPrefix = async (guild) => {
  const mongo = require("../mongo");
  const settingsSchema = require("../schemas/settings-schema");

  let result = "!";

  await mongo().then(async (mongoose) => {
    try {
      await settingsSchema.findOne({ _id: guild.id }).then((settings) => {
        if (settings != null) {
          result = settings.commandPrefix;
        }
      });
    } catch (e) {
      console.error(e);
    } finally {
      await mongoose.connection.close();
    }
  });

  return result;
};

module.exports = (client, commandOptions) => {
  let {
    commands,
    expectedArgs,
    permissionError = "you do not have permission to run this command",
    minArgs = 0,
    maxArgs = null,
    permissions = [],
    requiredRoles = [],
    callback,
  } = commandOptions;

  // Ensure the commands parameter is in the form of an array.
  if (typeof commands === "string") {
    commands = [commands];
  }

  // Ensure the permissions are in an array and valid.
  if (permissions.length) {
    if (typeof permissions === "string") {
      permissions = [permissions];
    }

    validatePermissions(permissions);
  }

  client.on("message", async (message) => {
    const { member, content, guild } = message;

    await getPrefix(guild).then((prefix) => {
      for (const alias of commands) {
        if (
          content.toLowerCase().startsWith(`${prefix}${alias.toLowerCase()}`)
        ) {
          // A command has been ran

          // Ensure the user has the required permission(s)
          for (const permission of permissions) {
            if (!member.hasPermission(permission)) {
              message.reply(permissionError);
              return;
            }
          }

          // Ensure the user has the required role(s)
          for (const requiredRole of requiredRoles) {
            const role = guild.roles.cache.find(
              (role) => role.name === requiredRole
            );

            if (!role || !member.roles.cache.has(role.id)) {
              message.reply(
                `You must have the "${requiredRole}" to use this command.`
              );
              return;
            }
          }

          const arguments = content.split(/[ ]+/);

          // Remove the first index as this is the command.
          arguments.shift();

          // Ensure we have the correct number of arguments
          if (
            arguments.length < minArgs ||
            (maxArgs !== null && arguments.length > maxArgs)
          ) {
            message.reply(
              `Incorrect syntax! Use ${prefix}${alias} ${expectedArgs}`
            );
            return;
          }

          // Handle the custom command code.
          callback(message, arguments, arguments.join(" "));
          return;
        }
      }
    });
  });
};
