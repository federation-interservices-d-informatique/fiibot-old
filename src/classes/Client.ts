import { mokaClient, mokaMessage } from "discordjs-moka";
export default class FIIClient extends mokaClient {
  raidmode: boolean;
  msgcache: Map<string, Array<mokaMessage>>;
}