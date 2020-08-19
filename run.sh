pm2 stop fiiboot
rm -rf node_modules
npm install --production
pm2 start --name fiibot index.js
echo "Ok"