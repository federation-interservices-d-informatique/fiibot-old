import { mokaMessage } from "discordjs-moka";
import FIIClient from "../../classes/Client";
import fiiCommand from "../../classes/Command";

module.exports = class extends fiiCommand {
  constructor(client: FIIClient) {
    super(client, {
      name: "embed",
      description: "Envoyer un embed",
      userPermissions: ["ADMINISTRATOR"],
      clientPermissions: ["EMBED_LINKS"],
    });
  }
  async run(message: mokaMessage, args: string[]) {
    const desc = args.slice(1).join(" ");
    message.channel.send("", {
      embed: {
        title: `${args[0] ?? ``}`,
        description: `${desc ?? ``}`,
        color: "RANDOM",
      },
    });
  }
};
