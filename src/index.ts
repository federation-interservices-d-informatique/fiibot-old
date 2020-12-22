import { config as envconfig } from "dotenv";
envconfig();
import { owners } from "./config";
import { mokaHandler } from "discordjs-moka";
import Client from "./classes/Client";
import { GuildMember } from "discord.js";
const client = new Client(
  {},
  {
    token: process.env.TOKEN,
    prefix: process.env.PREFIX,
    owner: owners,
  }
);
client.setHandler(
  new mokaHandler(client, {
    loadDefault: true,
    commandPath: [`${__dirname}/commands`],
  })
);
client.handler.init();
client.on("ready", () => {
  client.user.setActivity("gérer la FII");
});
client.on("guildMemberAdd", (member: GuildMember) => {
  if (client.raidmode) {
    member.user.send("", {
      embed: {
        title: "Vous avez été expulsé!",
        description: `Le serveur ${member.guild.name} est actuellement en Raidmode, revenez plus tard!`,
        footer: {
          text: "RaidMode de FIIBOT",
          iconURL: client.user.avatarURL({
            format: "png",
          }),
        },
        color: "RED",
      },
    });
    member.kick("RAIDMODE");
  }
});
