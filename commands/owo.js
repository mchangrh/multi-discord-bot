// source https://github.com/mchangrh/owo-discord

module.exports = {
  name: "owo",
  usage: "{message}",
  args: true,
  execute(message, args) {
    const text = args.join(" ");
    message.channel.send(owoify(text));
  }
};

const owoify = (text) => 
  text.replace(/(?:r|l)/g, 'w')
    .replace(/(?:R|L)/g, 'W')
    // n[aeiou] with ny[aeiou]
    .replace(/n([aeiou])/g, 'ny$1')
    .replace(/N([aeiou])/g, 'Ny$1')
    .replace(/N([AEIOU])/g, 'Ny$1')
    // ove with uv
    .replace(/ove/g, 'uv')