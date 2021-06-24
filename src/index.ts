import { ID_REGEX, INVITATION_REGEX } from "./Constants/Constants"
import { config as envconfig } from "dotenv";
envconfig();
import { owners } from "./config";
import { mokaGuild, mokaHandler, mokaMessage } from "discordjs-moka";
import Client from "./classes/Client";
import {
  GuildMember,
  TextChannel,
} from "discord.js";
import { fiiRole } from "./classes/Role";
import { fiiGuildEmoji } from "./classes/GuildEmoji";
import { fiiGuildMember } from "./classes/GuildMember";
const client = new Client(
  {
    partials: ["MESSAGE"],
  },
  {
    token: process.env.TOKEN,
    prefix: process.env.PREFIX,
    owner: owners,
    dburl: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWD}@${process.env.DB_HOST ?? 'localhost'}/${process.env.DB_NAME}`
  },
  {
    owners: owners,
    critLogChan: "705372306481872963",
    idlogs: "802228798807605298",
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
  client.user.setActivity(`gérer la FII | Préfixe: ${client.moka.prefix}`);
  client.msgcache = new Map();
  if (client.user.id === "794861870825078815") {
    client.fii.critLogChan = "794866866433556510";
    // FIIBot test server for FIIBOT beta
  }
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
  if (!msg.guild) return;
  const spamchans: Array<string> =
    await msg.guild.settings.get("ignorespam") || new Array();
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
    let cstring = "";
    dupe.forEach(async (m) => {
      try {
        await m.fetch();
        cstring = `${cstring}${cstring == "" ? "" : "\n"}**${m.author.tag} (${m.author.id})**: ${m.content}`
        if (!m.deleted) m.delete();
      } catch (e) { }
    });
    let chan = await client.channels.fetch(client.fii.critLogChan.toString(), true, true) as TextChannel;
    if (chan) {
      chan.send(`Log de spam sur ${msg.guild.name}.\n${cstring}`)
    }
  }
});
client.on('message', async (msg: mokaMessage) => {
  if (msg.partial) {
    try {
      await msg.fetch()
    } catch (e) {
      return;
    }
  }
  if (!msg.guild) return;
  if (msg.guild.settings.get('autoriseinvites')) return;
  const autoris: Array<string> = await msg.guild.settings.get('autorisedinviteschans') || new Array();
  if (autoris.includes(msg.channel.id)) return;
  if (msg.member.hasPermission('ADMINISTRATOR')) return;
  if (client.isOwner(msg.author)) return;
  if (INVITATION_REGEX.test(msg.content)) {
    const autoriseRegex = /(https:\/\/|http:\/\/|)?(www)?discord.(com\/invite|gg)\/(yHhkjZhzBX|BKRuPP2|wNcrRpD|sXEH7cB|8KDQzwP)/gim
    if (autoriseRegex.test(msg.content)) return // Skip FII invites
    let content = msg.content.replace(/(https:\/\/|http:\/\/|)?(www)?discord.(com\/invite|gg)\/[0-Z]{1,20}/gim, '{Invitation censurée}');
    content = content.replace(/@(here|everyone)/gim, "`MENTION INTERDITE`");
    content = content.replace(/<@&[0-9]{18}>/gim, "`Mention de rôle`");
    if (!msg.deleted) msg.delete();
    if (msg.channel.type === 'text') {
      const hooks = await msg.channel.fetchWebhooks();
      let hook = hooks.first();
      if (!hook) {
        hook = await msg.channel.createWebhook('FIIBOT');
      }
      hook.send(content, {
        username: msg.author.username,
        avatarURL: msg.author.avatarURL()
      })
    }
  }
});
if (process.env.DEBUG == "true") {
  client.on("debug", console.log);
}
client.on("messageDelete", async (msg: mokaMessage) => {
  if (!msg.guild) return;
  if (msg.partial) {
    try {
      await msg.fetch(true);
    } catch (e) {
      return
    }
  }
  if (msg.author.id == client.user.id) return
  const idregex = /FII-(LPT|CLI|MIM|HUB|ADP)-[0-9]{6}-[0-9]{10}-FII/gim;
  if (idregex.test(msg.content)) return; //Ignore IDS
  if (msg.content.startsWith(`${client.moka.prefix}auth`)) return; // Don't log guild auths (prevent ID logging)
  const chan = client.channels.resolve(
    await msg.guild.settings.get("logchan")
  ) as TextChannel;
  if (!chan) return;
  chan.send("", {
    embed: {
      description: `**Un message de ${msg.author} dans ${msg.channel} a été supprimé**`,
      color: "RED",
      footer: {
        icon_url: `${msg.guild.iconURL({ dynamic: true })}`,
        text: `Logs de ${msg.guild.name}`,
      },
      timestamp: new Date(),
      fields: [
        {
          name: "Contenu",
          value: `\`\`\`${msg.content} \`\`\``,
        },
      ],
    },
  });
});
client.on("messageUpdate", async (oldm: mokaMessage, newm: mokaMessage) => {
  if (!newm.guild) return;
  if (newm.partial) {
    try {
      await newm.fetch();
    } catch (e) { }
  }
  if (newm.content === oldm.content) return;
  if (ID_REGEX.test(newm.content)) {
    newm.delete().catch((e) => { });
    return;
  }
  if (ID_REGEX.test(newm.content) || ID_REGEX.test(oldm.content)) return; // Don't log ids
  const chan = client.channels.resolve(
    await newm.guild.settings.get("logchan")
  ) as TextChannel;
  if (!chan) return;
  chan.send("", {
    embed: {
      description: `**Un message de ${newm.author} dans ${newm.channel} a été modifié**`,
      color: "RED",
      footer: {
        icon_url: `${newm.guild.iconURL({ dynamic: true })}`,
        text: `Logs de ${newm.guild.name}`,
      },
      timestamp: new Date(),
      fields: [
        {
          name: "Nouveau contenu:",
          value: `\`\`\`${newm.content} \`\`\``,
        },
        {
          name: "Ancien contenu:",
          value: `\`\`\`${oldm.content}\`\`\``,
        },
      ],
    },
  });
});
client.on("message", async (msg) => {
  if (msg.partial) {
    try {
      await msg.fetch();
    } catch (e) { }
  }
  if (!msg.guild) return;
  if (ID_REGEX.test(msg.content)) {
    let content = msg.content.replace(
      ID_REGEX,
      "FII-SERVEUR-\\*\\*\\*\\*\\*\\*-\\*\\*\\*\\*\\*\\*\\*\\*\\*\\*-FII"
    );
    content = content.replace(/@(here|everyone)/gim, "`MENTION INTERDITE`");
    content = content.replace(/<@&[0-9]{18}>/gim, "`Mention de rôle`");
    msg.channel.send(content);
    msg.delete();
  }
});
client.on("roleCreate", async (role: fiiRole) => {
  const chan = client.channels.resolve(
    await role.guild.settings.get("logchan")
  ) as TextChannel;
  if (!chan) return;
  chan.send("", {
    embed: {
      title: `Un rôle a été créé!`,
      description: `Le role ${role.name} a été créé!`,
      fields: [
        {
          value: `\`\`\`${role.permissions.toArray()}\`\`\``,
          name: "Permissions:",
        },
      ],
      color: role.hexColor,
      timestamp: new Date(),
    },
  });
});
client.on("roleUpdate", async (old: fiiRole, now: fiiRole) => {
  const chan = client.channels.resolve(
    await now.guild.settings.get("logchan")
  ) as TextChannel;
  if (!chan) return;

  let fields = [];
  old.name != now.name
    ? fields.push({ name: `Ancien nom:`, value: `\`${old.name}\`` })
    : "";
  old.mentionable != now.mentionable
    ? fields.push({
      name: `Le role ${old.mentionable
          ? "n'est plus mentionnable"
          : "est devenu mentionnable"
        }`,
      value: `** **`,
    })
    : "";
  old.hexColor != now.hexColor
    ? fields.push({
      name: `Le role à changé de couleur!`,
      value: `Ancienne: \`${old.hexColor}\`\nNouvelle: \`${now.hexColor}\``,
    })
    : "";
  old.permissions != now.permissions
    ? fields.push({
      name: "Le role à changé de permissions!",
      value: `Anciennes:${old.permissions.toArray().length == 0 ? "Aucune" : old.permissions.toArray().map(p => `\`${p}\``).toString()}\nNouvelles: ${now.permissions.toArray().length == 0 ? "Aucune" : now.permissions.toArray().map(p => `\`${p}\``).toString()}`,
    })
    : "";
  chan
    .send("", {
      embed: {
        title: "Un role a été modifié!",
        description: `Le role ${now.name} a été modifié!`,
        color: now.hexColor,
        timestamp: new Date(),
        fields: fields,
      },
    })
    .catch((e) => { });
});
client.on("roleDelete", async (role: fiiRole) => {
  const chan = client.channels.resolve(
    await role.guild.settings.get("logchan")
  ) as TextChannel;
  if (!chan) return;
  chan.send("", {
    embed: {
      title: `Un role a été supprimé`,
      timestamp: new Date(),
      description: `Le role ${role.name} a été supprimé.`,
      color: role.hexColor,
    },
  });
});
client.on("emojiCreate", async (emj: fiiGuildEmoji) => {
  const chan = client.channels.resolve(
    await emj.guild.settings.get("logchan")
  ) as TextChannel;
  if (!chan) return;
  chan.send("", {
    embed: {
      title: "Un émoji a été créé!",
      description: `L'émoji ${emj.name}(${emj.toString()}) a été créé!`,
      color: "RANDOM",
      timestamp: new Date(),
    },
  });
});
client.on("emojiUpdate", async (old: fiiGuildEmoji, now: fiiGuildEmoji) => {
  const chan = client.channels.resolve(
    await now.guild.settings.get("logchan")
  ) as TextChannel;
  if (!chan) return;
  let fields = [];
  now.name != old.name
    ? fields.push({ name: "Ancien nom: ", value: `\`${old.name}\`` })
    : "";
  chan
    .send("", {
      embed: {
        title: "Un émoji a été modifié!",
        description: `L'émoji ${now.name}(${now}) a été modifié!`,
        color: "RANDOM",
        timestamp: new Date(),
        fields: fields,
      },
    })
    .catch((e) => { });
});
client.on("emojiDelete", async (emj: fiiGuildEmoji) => {
  const chan = client.channels.resolve(
    await emj.guild.settings.get("logchan")
  ) as TextChannel;
  if (!chan) return;
  chan.send("", {
    embed: {
      title: `Un émoji a été supprimé`,
      timestamp: new Date(),
      description: `L'émoji ${emj.name} a été supprimé.`,
      color: "RANDOM",
    },
  });
});
client.on("guildBanAdd", async (guild: mokaGuild, user) => {
  const chan = client.channels.resolve(
    await guild.settings.get("logchan")
  ) as TextChannel;
  if (!chan) return;
  const log = await guild.fetchAuditLogs({
    type: `MEMBER_BAN_ADD`,
    limit: 1
  });
  const event = log.entries.first();

  chan.send("", {
    embed: {
      timestamp: new Date(),
      title: "Un(e) utilisateur/trice a été banni(e)!",
      description: `L'utilisateur/trice ${user.tag}(${user.id}) a été banni(e)!`,
      fields: [
        {
          value: `\`${event.executor.tag} (${event.executor.id})\``,
          name: 'Bannir par:'
        },
        {
          value: `\`${event.reason ?? "Aucune raison fournie"}\``,
          name: `Raison:`
        }
      ],
      color: 'RANDOM'
    },
  });
});
client.on('guildMemberAdd', async (member: fiiGuildMember) => {
  const chan = client.channels.resolve(
    await member.guild.settings.get("logchan")
  ) as TextChannel;
  if (!chan) return;
  chan.send("", {
    embed: {
      title: 'Un(e) utilisateur/trice a rejoint le serveur!',
      description: `${member.user.username} a rejoint le serveur`,
      color: 'GREEN',
      fields: [
        {
          name: 'Date de création de son compte:',
          value: member.user.createdAt
        },
        {
          name: 'ID',
          value: member.user.id
        }
      ],
      author: {
        iconURL: member.user.avatarURL(),
        name: member.user.username
      },
    },
  });
});
client.on('guildMemberRemove', async (m: fiiGuildMember) => {
  const chan = client.channels.resolve(
    await m.guild.settings.get("logchan")
  ) as TextChannel;
  if (!chan) return;
  chan.send('', {
    embed: {
      title: `Ohh... ${m.user.username} vient de quitter le serveur...`,
      color: 'RED',
      author: {
        iconURL: m.user.avatarURL(),
        name: m.user.username
      },
      fields: [
        {
          name: 'Création du compte',
          value: m.user.createdAt
        },
        {
          name: 'ID',
          value: m.user.id
        }
      ]
    }
  })
});
