import { mokaMessage } from "discordjs-moka";
import FIIClient from "../classes/Client";
import fiiCommand from "../classes/Command";
import Enmap from "enmap"
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
    }
}