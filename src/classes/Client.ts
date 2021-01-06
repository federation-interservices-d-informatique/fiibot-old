import { ClientOptions } from "discord.js";
import { mokaClient, mokaClientOptions, mokaMessage } from "discordjs-moka";
import { FiiConfiguration } from "../typings";
import Keyv from "keyv";
export default class FIIClient extends mokaClient {
  raidmode: boolean;
  msgcache: Map<string, Array<mokaMessage>>;
  fii: FiiConfiguration;
  idb: Keyv;
  constructor(djsOpts: ClientOptions, mokaOpts: mokaClientOptions, fiiOpts: FiiConfiguration) {
    super(djsOpts, mokaOpts);
    if(!fiiOpts.critLogChan) {
      throw new Error(`Please add a valid channel for critical logs!`)
    }
    this.fii = {
      owners: fiiOpts.owners ?? fiiOpts.owners,
      critLogChan: fiiOpts.critLogChan    
    };
    this.idb = new Keyv(`postgresql://${process.env.IDB_USER}:${process.env.IDB_PASSWD}@${process.env.DB_HOST ?? 'localhost'}:${process.env.DB_PORT ?? 5432}/${process.env.IDB_NAME}`)
  }
}