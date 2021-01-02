import { GuildEmoji, Structures } from "discord.js";
import { mokaGuild } from "discordjs-moka";
class fiiGuildEmoji extends GuildEmoji implements GuildEmoji {
  guild: mokaGuild
}
Structures.extend("GuildEmoji", () => {
  return fiiGuildEmoji;
});
export { fiiGuildEmoji };
