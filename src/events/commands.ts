import { type Client } from 'pg'
import { Markup, type Telegraf } from 'telegraf'
import { Command } from '../utils/consts'

export async function connectCommands(bot: Telegraf, db: Client) {

  bot.command(Command.findPsycho, ctx => {
    ctx.reply('Выберите категорию', { 
      ...Markup.inlineKeyboard([
        [Markup.button.callback('Психологи', Command.psychologists)],
        [Markup.button.callback('Психотерапевты', Command.psychologists)],
        [Markup.button.callback('Супервизоры', Command.psychologists)],
      ])
    })
  })

}

