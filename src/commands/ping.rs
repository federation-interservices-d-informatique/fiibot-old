use serenity::client::Context;
use serenity::framework::standard::{macros::command, CommandResult};
use serenity::model::channel::Message;
use serenity::utils::Colour;
use std::time::Instant;

#[command]
async fn ping(ctx: &Context, msg: &Message) -> CommandResult {
    let dur = Instant::now();
    let mut botmsg = msg.reply(ctx, "Calcul...").await?;
    botmsg
        .edit(ctx, |m| {
            m.content("Pong!");
            m.embed(|e| {
                e.title("Ping du bot: ");
                e.description(format!(
                    "{} ms ({} µs)",
                    dur.elapsed().as_millis(),
                    dur.elapsed().as_micros()
                ));
                e.colour(Colour::DARK_GREEN);
                e
            })
        })
        .await?;
    Ok(())
}

