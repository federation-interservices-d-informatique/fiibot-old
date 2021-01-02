import { mokaMessage } from "discordjs-moka";
import fiiCommand from "../../classes/Command";

module.exports = class extends (
  fiiCommand
) {
  constructor(client) {
    super(client, {
      name: "logs",
      description: "Configurer les logs",
      aliases: ["logchan"],
      clientPermissions: ["ADMINISTRATOR"],
      userPermissions: ["ADMINISTRATOR"],
      guildOnly: true
    });
  }
  async run(message: mokaMessage, args: string[]) {
    if (!args[0]) {
      message.channel.send("", {
        embed: {
          description: `Le salon de logs est actuellement <#${message.guild.settings.get(
            "logchan"
          )}>`,
          color: "RANDOM",
        },
      });
      return;
    }
    const chan =
      message.mentions.channels.first() ||
      this.client.channels.resolve(args[0]);
    if (!chan) {
      message.channel.send("", {
        embed: {
          title: "Merci de préciser un salon valide!",
          color: "RED",
        },
      });
      return;
    }
    message.guild.settings.set("logchan", chan.id);
    message.channel.send("", {
      embed: {
        description: `Le salon ${chan} a bien été défini comme salon de logs.`,
        color: "GREEN",
      },
    });
  }
};
