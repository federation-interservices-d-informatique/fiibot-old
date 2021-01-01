import { mokaMessage } from "discordjs-moka";
import FIIClient from "../classes/Client";
import fiiCommand from "../classes/Command";
import Enmap from "enmap"
import { servers } from "../config";
import { chknum } from "../Util/numbers";
module.exports = class IDCommand extends fiiCommand {
    constructor(client: FIIClient) {
        super(client, {
            name: 'id',
            description: 'Générer un id fii',
            aliases: ['idgen', 'genid']
        })
    }
    async run(message: mokaMessage, args: string[]) {
        if(!args[0]) {
            message.channel.send('', {
                embed: {
                    title: 'Veuillez préciser un nom d\'utilisateur!',
                    color: 'RED'
                }
            })
            return;
        }
        const idb = new Enmap({
            name: 'ids',
            dataDir: `${__dirname}/../../ids/`
        });
        
        await idb.defer;
        const currentMax = parseInt(idb.get('maxnum')) || 1;
        idb.set('maxnum', (currentMax+ 1));
        /**
         * Sample ID:
         * FII-LPT-00005-8428605967-FII
         * FII-SERV-6NUM-10RAND-FII
         */
        const random = Math.floor(Math.random() * (9999999999 - 1000000000) + 1000000000 );
        const numb = chknum(currentMax.toString());
        const id = `FII-${servers.get(message.guild.id) || "HUB"}-${numb}-${random}-FII`
        message.channel.send(id);
    }
}
