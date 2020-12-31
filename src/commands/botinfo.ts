import FIIClient from "../classes/Client";
import Command from "../classes/Command";

module.exports = class botinfo extends (
  Command
) {
  constructor(client: FIIClient) {
    super(client, {
      name: "botinfo",
      description: "Obtenir les infos du Bot",
      aliases: ["infobot"],
    });
  }
  run(message) {
    message.channel.send("", {
      embed: {
        title: `Informations de ${this.client.user.username}`,
        footer: {
          icon_url: this.client.user.avatarURL({
            format: "png",
          }),
          text: `Informations de ${this.client.user.username}`,
        },
        color: "RANDOM",
        fields: [
          {
            name: "Mon préfixe:",
            value: this.client.moka.prefix,
          },
          {
            name: "<:octocat:793998492787802142> Sources:",
            value:
              "[GitHub](https://github.com/federation-interservices-d-informatique/bot)",
          },
          {
            name: "<:fii:793998547594117182> FII - Hub central Discord:",
            value: "[Invitation](https://discord.com/invite/KNUsJgG)",
          },
        ],
      },
    });
  }
};
