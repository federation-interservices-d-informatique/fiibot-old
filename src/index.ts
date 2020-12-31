import { config as envconfig } from "dotenv";
envconfig();
import { owners, spamchans } from "./config";
import { mokaHandler, mokaMessage } from "discordjs-moka";
import Client from "./classes/Client";
import { GuildMember, TextChannel } from "discord.js";
const client = new Client(
  {
    partials: ['MESSAGE']
  },
  {
    token: process.env.TOKEN,
    prefix: process.env.PREFIX,
    owner: owners,
  },
  {
    owners: owners,
    critLogChan: "705372306481872963",
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
  // Reset for preventing performance issues
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

client.on("message", async (msg: mokaMessage) => {
  if(msg.partial) await msg.fetch();
  if (msg.author.bot) return;
  if (spamchans.includes(msg.channel.id)) return;
  if (msg.member.hasPermission("ADMINISTRATOR") || client.isOwner(msg.author)) {
    return; // Ignore admins
  }
  if (!client.msgcache.get(msg.author.id)) {
    client.msgcache.set(msg.author.id, new Array());
  }
  let msgs = client.msgcache.get(msg.author.id);
  msgs.push(msg);
  client.msgcache.set(msg.author.id, msgs);
  const dupe = client.msgcache.get(msg.author.id).filter((m) => {
    if (m.createdTimestamp > msg.createdTimestamp - 7000) {
      return true;
    }
    return false;
  });
  if (dupe.length >= 7) {
    msg.author.send(`Vous avez été éjecté(e) de ${msg.guild.name} pour spam!`);
    msg.channel.send(`${msg.author} a été kick pour spam!`);
    msg.member.kick(`Spam dans ${msg.channel}`);
    dupe.forEach(async (m) => {
      try {
        await m.fetch();
        if (!m.deleted) m.delete();
      } catch (e) {}
    });
  }
});
if (process.env.DEBUG == "true") {
  client.on("debug", console.log);
}
client.on("messageDelete", async (msg: mokaMessage) => {
  if(!msg.guild) return;
  if(msg.partial) {
    try {
      await msg.fetch(true);
    } catch(e) {}
  }
  const auditLogs = await msg.guild.fetchAuditLogs({
		limit: 1,
		type: 'MESSAGE_DELETE',
  });
  const lg = auditLogs.entries.first();
  const chan = client.channels.resolve(msg.guild.settings.get('logchan')) as TextChannel;
  if(!chan) return;
  chan.send('', {
    embed: {
      description: `**Un message de ${msg.author} dans ${msg.channel} a été supprimé**`,
      color: 'RED',
      footer: {
        icon_url: `${msg.guild.iconURL({dynamic: true})}`,
        text: `Logs de ${msg.guild.name}`
      },
      timestamp: new Date(),
      fields: [
        {
          name: 'Contenu',
          value: `\`\`\`${msg.content} \`\`\``
        },
        {
          name: 'Supprimé par',
          value: `\`\`\`${lg.executor.username ?? "Iconnu" }\`\`\``
        }
      ]
    }
  })
});
