use std::env::var as get_env_var;
mod util;
mod commands;
use commands::ping::*;

pub use util::errors::{error, Error,Result};
use serenity::async_trait;
use serenity::client::{Client, Context as SerenityContext, EventHandler};
use serenity::framework::standard::{macros::group, StandardFramework};
use serenity::model::gateway::Ready;

#[group]
#[commands(ping)]
struct General;

struct Handler;
#[async_trait]
impl EventHandler for Handler {
    async fn ready(&self, _: SerenityContext, user: Ready) {
        println!("Logged in as {} ({})", user.user.tag(), user.user.id);
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    let token = get_env_var("TOKEN").unwrap_or_else(|_| String::from("TOKEN_NOT_FOUND"));
    if !serenity::client::validate_token(&token).is_ok() {
        return Err(error("Invalid token!"));
    }

    let fw = StandardFramework::new()
        .configure(|c| c.prefix("&"))
        .group(&GENERAL_GROUP);
    let mut client = Client::builder(&token)
        .event_handler(Handler)
        .framework(fw)
        .await?;
    if let Err(err) = client.start().await {
        println!("Erreur lors de l'exécution du client: {:?}", err);
    }
    Ok(())
}
