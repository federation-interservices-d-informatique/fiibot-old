import { GuildMember, Structures } from "discord.js";
import { mokaGuild } from "discordjs-moka";
class fiiGuildMember extends GuildMember implements GuildMember {
  guild: mokaGuild
}
Structures.extend("GuildMember", () => {
  return fiiGuildMember;
});
export { fiiGuildMember };
