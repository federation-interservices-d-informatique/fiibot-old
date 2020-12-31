import { ClientOptions } from "discord.js";
import { mokaClient, mokaClientOptions, mokaMessage } from "discordjs-moka";
import { FiiConfiguration } from "../typings";
export default class FIIClient extends mokaClient {
  raidmode: boolean;
  msgcache: Map<string, Array<mokaMessage>>;
  fii: FiiConfiguration;
  constructor(djsOpts: ClientOptions, mokaOpts: mokaClientOptions, fiiOpts: FiiConfiguration) {
    super(djsOpts, mokaOpts);
    if(!fiiOpts.critLogChan) {
      throw new Error(`Please add a valid channel for critical logs!`)
    }
    this.fii = {
      owners: fiiOpts.owners ?? fiiOpts.owners,
      critLogChan: fiiOpts.critLogChan    
    };
  }
}