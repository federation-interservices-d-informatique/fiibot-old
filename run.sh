pm2 stop fiibot
rm -rf node_modules
npm install --production
pm2 start --name fiibot index.js
echo "Ok"
