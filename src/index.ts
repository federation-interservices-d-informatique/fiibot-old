import { config as envconfig } from "dotenv";
envconfig();
import { owners } from "./config";
import { mokaHandler, mokaMessage } from "discordjs-moka";
import Client from "./classes/Client";
import { GuildMember } from "discord.js";
import { notEqual } from "assert";
import { POINT_CONVERSION_COMPRESSED } from "constants";
import { setImmediate } from "timers";
import { setMaxListeners } from "process";
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
  client.msgcache = new Map();
});
client.on("guildMemberAdd", async (member: GuildMember) => {
  if (client.raidmode) {
    member.user.send("", {
      embed: {
        title: "Vous avez été expulsé(e)!",
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
client.on('message', (msg: mokaMessage) => {
  if(msg.author.bot) return;
  if(!client.msgcache.get(msg.author.id)) {
    client.msgcache.set(msg.author.id, new Array());
  }
  let msgs = client.msgcache.get(msg.author.id);
  msgs.push(msg);
  client.msgcache.set(msg.author.id, msgs);
  let dupe = client.msgcache.get(msg.author.id).filter(m => {
    if ((m.createdTimestamp > (msg.createdTimestamp - 7000)) ) {
      return true
    }
    return false
  })
  if(dupe.length >= 5) {
    client.msgcache.set(msg.author.id, null);
    msg.channel.send('SPAM')
  }
});