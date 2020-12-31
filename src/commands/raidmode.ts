import Client from "../classes/Client";
import Command from "../classes/Command";
import { mokaMessage } from "discordjs-moka";
import { TextChannel } from "discord.js";
module.exports = class extends (
  Command
) {
  constructor(client: Client) {
    super(client, {
      name: "raidmode",
      description: "Lancer le raidmode",
      aliases: ["raid"],
      ownerOnly: true,
      usage: "raidmode",
    });
  }
  async run(message: mokaMessage) {
    if (this.client.raidmode) {
      message.channel.send("", {
        embed: {
          title: "Raidmode",
          description: "Raidmode Désactivé!",
          color: "RED",
        },
      });
      this.client.raidmode = false;
      let chan = await this.client.channels.fetch(this.client.fii.critLogChan, true, true) as TextChannel;
      if (chan) {
        chan.send("", {
          embed: {
            title: "Raidmode",
            description: `Le raidmode a été désactivé par ${message.author.tag} sur ${message.guild.name}`,
            color: "RED",
          },
        });
      }
      this.client.user.setActivity("gérer la FII");
    } else {
      message.channel.send("", {
        embed: {
          title: "Raidmode",
          description: "Raidmode Activé!",
          color: "RED",
        },
      });
      this.client.raidmode = true;
      let chan = await this.client.channels.fetch(this.client.fii.critLogChan.toString(), true, true) as TextChannel;
      if (chan) {
        chan.send("", {
          embed: {
            title: "Raidmode",
            description: `Le raidmode a été activé par ${message.author.tag} sur ${message.guild.name}`,
            color: "RED",
          },
        });
        this.client.user.setActivity("protéger la FII");
      }
    }
  }
};
