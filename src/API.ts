import FIIClient from "./classes/Client";
import Koa from "koa";
class Api {
  app: Koa;
  client: FIIClient;
  constructor(client: FIIClient) {
    this.client = client;
    this.app = new Koa();
    this.app.use(async (ctx, next) => {
      await next();
      if (ctx.path === "/api/commands") {
        let commands = new Array();
        this.client.handler.commands.forEach(c => {
            commands.push({
                name: c.infos.name,
                description: c.infos.description
            })
        })
        ctx.body = `${JSON.stringify(commands)}`;
      }
    });
    this.app.listen(3000);
  }
}
export { Api };
