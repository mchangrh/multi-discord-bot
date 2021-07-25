const discord = require("discord.js");
const client = new discord.Client();
const { readdirSync } = require("fs");

/**
 * Check validity of commands and return command name and parameters
 * @param {Snowflake} message 
 * @returns {[String]} Array of arguments
 */
function commandParser(message) {
  const prefix = process.env.PREFIX
  // skip bot or DM
  if (message.channel.type === "dm" || message.author.bot) return;
  // ignore messages without prefix or mention
  if (!message.content.startsWith(prefix) && !message.mentions.has(client.user.id)) return;
  // parse command and arguments
  let args = message.content.slice(prefix.length).trim().split(" ");
  // if mentioned return shift once to remove mention
  if (message.mentions.has(client.user.id)) args.shift();
  // return false if no args
  return args ? args : false; // return empty array if no args
}

// command setup
client.commands = new discord.Collection();
const commandFiles = readdirSync("./commands").filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

// client listeners
client.login(process.env.TOKEN);

client.on("ready", () => {
  console.log("Bot is logged in.");
});

client.on("message", (message) => {
  // extract command from command parser
  let args = commandParser(message);
  // if no args return
  if (!args) return;
  const cmd = args.shift().toLowerCase;
  args = args ? args : []; // return empty array if no args

  // run command
  const command = client.commands.get(cmd)
		|| client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(cmd));

  // command not found
  if (!command) return;
  // args required
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;
    if (command.usage) {
      reply += `\nThe proper usage would be: \`${process.env.PREFIX}${command.name} ${command.usage}\``;
    }
    return message.channel.send(reply);
  }
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.channel.send("there was an error trying to execute that command!");
  }
});
