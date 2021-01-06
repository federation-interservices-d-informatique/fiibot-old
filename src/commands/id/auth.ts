import { mokaMessage } from "discordjs-moka";
import { TextChannel } from "discord.js";
import FIIClient from "../../classes/Client";
import fiiCommand from "../../classes/Command";
import { argon2i } from "argon2-ffi";
module.exports = class Auth extends (
  fiiCommand
) {
  constructor(client: FIIClient) {
    super(client, {
      name: "auth",
      description: "S'authetifier avec son nom d'utilisateur et son ID FII",
      usage: `auth {username} {id}`
    });
  }
  async run(message: mokaMessage, args: string[]) {
    if (!args[0] || !args[1]) {
      message.channel.send("Veuillez indiquer un nom d'utilisateur et un ID!");
      return;
    }
    if (message.channel.type != "dm") {
      message.channel.send(
        "Cette commande ne peut que être exécutée en message privés!"
      );
      message.delete(); // Supress ID
      return;
    }
    if (!(await this.client.idb.get(args[0]))) {
      message.channel.send("", {
        embed: {
          description: `Le nom d'utilisateur ${args[0]} n'existe pas!`,
          color: "RED",
        },
      });
      return;
    }
    const hashedID = await this.client.idb.get(args[0]);
    const res = await argon2i.verify(hashedID, args[1]).catch((e) => {});
    if (!res) {
      message.channel.send("", {
        embed: {
          description: `ID incorrect!`,
          color: "RED",
        },
      });
    }
    if (res == true) {
      message.channel.send("", {
        embed: {
          description:
            "Authentification réussie!\nLe C.A de la FII a reçu cette information, vous êtes maintenant validé(e)!",
          color: "GREEN",
        },
      });
      const chan = (await this.client.channels.fetch(
        this.client.fii.critLogChan,
        true,
        true
      )) as TextChannel;
      if (chan) {
        chan.send("", {
          embed: {
            description: `${message.author.username} à réussi à se connecter avec le nom d'utilisateur ${args[0]}`,
            color: "GREEN",
            timestamp: new Date(),
          },
        });
      }
    }
  }
};
