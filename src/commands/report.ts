import { TextChannel } from "discord.js";
import { mokaMessage } from "discordjs-moka";
import FIIClient from "../classes/Client";
import Command from "../classes/Command";
module.exports = class Report extends (
  Command
) {
  constructor(client: FIIClient) {
    super(client, {
      name: "report",
      description: "Signaler un utilisateur",
      aliases: ["iléméchan"],
    });
  }
  async run(message: mokaMessage, args: string[]) {
    if (!args[0] || !args[1]) {
      message.channel.send(
        `${message.author}! Veuillez préciser qui signaler! et pourquoi!`
      );
      return;
    }
    let user = message.mentions.users.first() || (await this.client.users.fetch(args[0]));
    if (!user) {
      return message.channel.send("Impossible de trouver l'utilisateur!");
    }
    const reason = args.slice(1).join(" ");
    const chan = await this.client.channels.fetch(
      this.client.fii.critLogChan,
      true,
      true
    ) as TextChannel;
    if (chan) {
      chan.send("", {
        embed: {
          title: `Report de ${user.username}`,
          fields: [
            {
              name: "Raison:",
              value: `${reason}`,
            },
            {
              name: 'Lien du dernier message:', 
              value: `[Lien](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.channel.lastMessageID})`
            }
          ],
          timestamp: new Date(),
          thumbnail: {
            url: `${user.avatarURL({ format: "png" })}`,
          },
          footer: {
            text: `Report par ${message.author.username} depuis ${message.guild.name}`,
            icon_url: `${message.author.avatarURL({ format: "png" })}`,
          },
          color: "RANDOM",
        },
      });
      message.channel.send('', {embed: {
        title: 'Merci de votre signalement',
        description: 'Votre signalement a bien été envoyé!',
        color: 'GREEN'
      }})
    } else {
      message.channel.send(
        "Oups! On dirait que il n'existe plus de salon ou je puisse envoyer les reports!"
      );
    }
  }
};
