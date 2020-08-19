class Command {
    constructor(client, info) {
        
        this.client = client;
        this.name = info.name;
        this.description = info.description || 'Non définie';
        this.aliases = info.aliases || [];
        this.usage = info.usage || 'Non défini';
        this.guildOnly = Boolean(info.guildOnly);
        this.ownerOnly = Boolean(info.ownerOnly);
        this.category = info.category;
        this.ssaOnly = Boolean(info.ssaOnly);
        this.fiiOnly = Boolean(info.fiiOnly);
        this.hidden = Boolean(info.hidden);
    
    }
    hasPermission(message){
        if (!this.fiiOnly && !this.ssaOnly && !this.ownerOnly && !this.permissions) return true;
        if (this.client.isOwner(message.author)) return true;
        if(this.ownerOnly && !this.client.isOwner(message.author)) return false;
        if(this.fiiOnly && !this.client.options.fiim.includes(message.author.id)) return false;
        if (message.channel.type === 'text' && this.permissions) {
            const missing = message.channel.permissionsFor(message.author).missing(this.permissions);
            if (missing.length > 0) {
                
                return false;
            }
        }
        return true;
    }
    
}
module.exports = Command; 