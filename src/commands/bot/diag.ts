import FIIClient from "../../classes/Client";
import Command from "../../classes/Command";
import { mokaMessage } from "discordjs-moka"
module.exports = class diag extends (
  Command
) {
  constructor(client: FIIClient) {
    super(client, {
      name: "diag",
      description: "Diagnostic de l'état du Bot",
      aliases: ["diagno"],
    });
  }
  async run(message: mokaMessage) {
    this.client.idb.get("maxnum")
    .then((v) => {
      message.channel.send("", {
        embed: {
          title: `Diagnostic de ${this.client.user.username}`,
          footer: {
            icon_url: this.client.user.avatarURL({
              format: "png",
            }),
            text: `Diagnostic de ${this.client.user.username}`,
          },
          color: "GREEN",
          fields: [
            {
              name: "BDD",
              value: "ON"
            }
          ],
        },
    })
    })
    .catch((e) => {
      message.channel.send("", {
        embed: {
          title: `Diagnostic de ${this.client.user.username}`,
          footer: {
            icon_url: this.client.user.avatarURL({
              format: "png",
            }),
            text: `Diagnostic de ${this.client.user.username}`,
          },
          color: "RED",
          fields: [
            {
              name: "BDD",
              value: "OFF"
            }
          ],
        },
      });
    })
  }
};
