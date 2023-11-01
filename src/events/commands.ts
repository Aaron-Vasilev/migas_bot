import { PrismaClient } from '@prisma/client'
import { Markup, type Telegraf } from 'telegraf'
import { Command } from '../utils/consts'

export async function connectCommands(bot: Telegraf, db: PrismaClient) {

  bot.command(Command.findPsycho, ctx => {
    ctx.reply('Выберите психолога', { 
      ...Markup.inlineKeyboard([
        [Markup.button.callback('Психологи', Command.psychologists)],
        [Markup.button.callback('Психотерапевты', Command.psychotherapists)],
        [Markup.button.callback('Супервизоры', Command.supervisors)],
      ])
    })
  })

}

