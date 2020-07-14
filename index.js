require('dotenv').config();
const Client = require('./classes/client'); 
const bot = new Client({
    
});
bot.logger.info('Starting...', 'Bot');
bot.on('ready', () => {
    bot.logger.ok('Connected to Discord', 'bot'); 
    bot.user.setActivity('la FII', {
        type: 'WATCHING'
    }).then((pres) => {
        bot.logger.info(`Presence set to  ${pres.activities}`, bot.user.username);
    });
}); 
bot.login(process.env.TOKEN); 
