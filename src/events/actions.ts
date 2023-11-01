import { PrismaClient } from '@prisma/client'
import { type Telegraf } from 'telegraf'
import { Command } from '../utils/consts'

export async function connectActions(bot: Telegraf, db: PrismaClient) {

  bot.action(Command.psychologists, ctx => {
    ctx.reply('LOll')
  })
}
