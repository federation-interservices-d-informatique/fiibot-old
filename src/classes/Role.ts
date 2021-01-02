import { Role, Structures } from "discord.js";
import { mokaGuild } from "discordjs-moka";
class fiiRole extends Role implements Role {
  guild: mokaGuild
}
Structures.extend("Role", () => {
  return fiiRole;
});
export { fiiRole };
