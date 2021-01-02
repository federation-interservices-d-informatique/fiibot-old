import { config as envconfig } from "dotenv";
envconfig();
import { owners } from "./config";
import { mokaHandler, mokaMessage } from "discordjs-moka";
import Client from "./classes/Client";
import { GuildMember, Message, MessageEmbed, Role, TextChannel } from "discord.js";
import { fiiRole } from "./classes/Role";
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
  if(client.user.id === "794861870825078815") {
    client.fii.critLogChan = "794866866433556510" 
    // FIIBot test server for FIIBOT beta
  }
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
  if (msg.partial) await msg.fetch();
  if (msg.author.bot) return;
  if(!msg.guild) return;
  const spamchans: Array<string> = msg.guild.settings.get('ignorespam') || new Array(); 
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
  const idregex = /FII-(LPT|CLI|MIM|HUB|ADP)-[0-9]{6}-[0-9]{10}-FII/gmi
  if(idregex.test(msg.content)) return; //Ignore IDS
  if(msg.content.startsWith(`${client.moka.prefix}auth`)) return; // Don't log guild auths (prevent ID logging)
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
        }
      ]
    }
  })
});
client.on('messageUpdate', async (oldm: mokaMessage, newm: mokaMessage) => {

  if(!newm.guild) return;
  if(newm.partial) {
    try {
      await newm.fetch();
    } catch(e) {}
  }
  const idregex = /FII-(LPT|CLI|MIM|HUB|ADP)-[0-9]{6}-[0-9]{10}-FII/gmi
  if(newm.content === oldm.content) return;
  if(idregex.test(newm.content)) { 
    newm.delete().catch(e => {})
    return;
  };
  if(idregex.test(newm.content) || idregex.test(oldm.content)) return; // Don't log ids
  const chan = client.channels.resolve(newm.guild.settings.get('logchan')) as TextChannel;
  if(!chan) return;
  chan.send('', {
    embed: {
      description: `**Un message de ${newm.author} dans ${newm.channel} a été modifié**`,
      color: 'RED',
      footer: {
        icon_url: `${newm.guild.iconURL({dynamic: true})}`,
        text: `Logs de ${newm.guild.name}`
      },
      timestamp: new Date(),
      fields: [
        {
          name: 'Nouveau contenu:',
          value: `\`\`\`${newm.content} \`\`\``
        },
        {
          name: 'Ancien contenu:',
          value: `\`\`\`${oldm.content}\`\`\``
        }
      ]
    }
  })
});
client.on('message', async (msg) => {
  if(msg.partial) {
    try {
      await msg.fetch();
    } catch(e) {}
  }
  if(!msg.guild) return;
  const idregex = /FII-(LPT|CLI|MIM|HUB|ADP)-[0-9]{6}-[0-9]{10}-FII/gmi
  if(idregex.test(msg.content)) {
    let content = msg.content.replace(idregex, 'FII-SERVEUR-\\*\\*\\*\\*\\*\\*-\\*\\*\\*\\*\\*\\*\\*\\*\\*\\*-FII')
    content = content.replace(/@(here|everyone)/gmi, '`MENTION INTERDITE`');
    content = content.replace(/<@&[0-9]{18}>/gmi, '`Mention de rôle`');
    msg.channel.send(content)
    msg.delete();
  }
});
client.on('roleCreate', (role: fiiRole) => {
  const chan = client.channels.resolve(role.guild.settings.get('logchan')) as TextChannel;
  if(!chan) return;
  chan.send('', {
    embed: {
      title: `Un rôle a été créé!`,
      description: `Le role ${role.name} a été créé!`,
      fields: [
        {
          value: `\`\`\`${role.permissions.toArray()}\`\`\``,
          name: 'Permissions:'
        },
      ],
      color: role.hexColor,
      timestamp: new Date()
    }
  })
});
client.on('roleUpdate', async (old: fiiRole, now: fiiRole) => {
  const chan = client.channels.resolve(now.guild.settings.get('logchan')) as TextChannel;
  if(!chan) return;
  
  let fields = [];
  old.name != now.name ? 
  fields.push({ name: `Ancien nom:`, value: `\`${old.name}\`` }) : ""; 
  old.mentionable != now.mentionable ?
  fields.push({ name: `Le role ${old.mentionable ? "n'est plus mentionnable" : "est devenu mentionnable"}`, value: `** **`}) : ""
  old.hexColor != now.hexColor ? 
  fields.push({name: `Le role à changé de couleur!`, value: `Ancienne: \`${old.hexColor}\`\nNouvelle: \`${now.hexColor}\``}) : ""
  old.permissions != now.permissions ? 
  fields.push({name: 'Le role à changé de permissions!', value: `Anciennes: \`\`\`${old.permissions.toArray()}\`\`\`\nNouvelles: \`\`\`${now.permissions.toArray()}\`\`\``}) : ""
  chan.send('', {
    embed: {
      title: 'Un role a été modifié!',
      description: `Le role ${now.name} a été modifié!`,
      color: now.hexColor,
      timestamp: new Date(),
      fields: fields
    }
  }).catch(e => {});
});