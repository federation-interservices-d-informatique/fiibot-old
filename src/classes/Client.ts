import { ClientOptions } from "discord.js";
import { mokaClient, mokaClientOptions, mokaMessage } from "discordjs-moka";
import { FiiConfiguration } from "../typings";
import Enmap from "enmap";
import { existsSync, mkdirSync } from "fs"
export default class FIIClient extends mokaClient {
  raidmode: boolean;
  msgcache: Map<string, Array<mokaMessage>>;
  fii: FiiConfiguration;
  idb: Enmap;
  constructor(djsOpts: ClientOptions, mokaOpts: mokaClientOptions, fiiOpts: FiiConfiguration) {
    super(djsOpts, mokaOpts);
    if(!fiiOpts.critLogChan) {
      throw new Error(`Please add a valid channel for critical logs!`)
    }
    this.fii = {
      owners: fiiOpts.owners ?? fiiOpts.owners,
      critLogChan: fiiOpts.critLogChan    
    };
    if(!existsSync(`${__dirname}/../../ids`)) {
      try {
        mkdirSync(`${__dirname}/../../ids`);
      } catch(e) {
        this.logger.error(`Unable to initialize: ${e.message}`, '[DB]')
      }
    }
    this.idb = new Enmap({
      name: "ids",
      dataDir: `${__dirname}/../../ids/`,
    }); 
    (async () => {
      await this.idb.defer;
    });
  }
}