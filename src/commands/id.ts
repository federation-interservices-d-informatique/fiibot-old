import { mokaMessage } from "discordjs-moka";
import FIIClient from "../classes/Client";
import fiiCommand from "../classes/Command";
import Enmap from "enmap";
import { servers } from "../config";
import { chknum } from "../Util/numbers";
import { argon2i } from "argon2-ffi";
import { promisify } from "util";
import { randomBytes } from "crypto";
module.exports = class IDCommand extends (
  fiiCommand
) {
  constructor(client: FIIClient) {
    super(client, {
      name: "id",
      description: "Générer un id fii",
      aliases: ["idgen", "genid"],
      guildOnly: true,
    });
  }
  async run(message: mokaMessage, args: string[]) {
    if (!args[0]) {
      message.channel.send("", {
        embed: {
          title: "Veuillez préciser un nom d'utilisateur!",
          color: "RED",
        },
      });
      return;
    }
    const idb = new Enmap({
      name: "ids",
      dataDir: `${__dirname}/../../ids/`,
    });

    await idb.defer;
    if (args[0] == "maxnum") {
      message.channel.send(
        `Le nom d'utilisateur ${args[0]} est protégé! Car il s'agit d'une variable utilisée par le bot!`
      );
      return;
    }
    if (idb.has(args[0])) {
      message.channel.send("", {
        embed: {
          description: `Le nom d'utilisateur ${args[0]} existe déjà dans la base de données, veuillez en choisir un autre!`,
          color: "RED",
        },
      });
      return;
    }
    const currentMax = parseInt(idb.get("maxnum")) || 1;
    idb.set("maxnum", currentMax + 1);
    /**
     * Sample ID:
     * FII-LPT-00005-8428605967-FII
     * FII-SERV-6NUM-10RAND-FII
     */
    const random = Math.floor(
      Math.random() * (9999999999 - 1000000000) + 1000000000
    );
    const numb = chknum(currentMax.toString());
    const id = `FII-${
      servers.get(message.guild.id) || "HUB"
    }-${numb}-${random}-FII`;
    message.author.send("", {
      embed: {
        title: "Votre ID FII",
        description: `Bonjour ${message.author.username}, voici votre ID FII: \n\n\`\`\`${id}\`\`\`\n\nCelui-ci ne doit **pas** être partagé, même avec un membre du C.A de la FII. Il est conseillé de le conserver au chaud, il pourrait vous être utile pour vous identifier dans le futur.`,
        color: "RANDOM",
        footer: {
          icon_url: this.client.user.avatarURL(),
          text:
            "Service proposé par la FII - Fédération des interservices d'informatique",
        },
      },
    });
    const rndBytes = promisify(randomBytes);
    const salt = await rndBytes(32);
    const hashID = await argon2i.hash(id, salt);
    idb.set(args[0], hashID);
    message.channel.send("ID enregistré!");
  }
};
