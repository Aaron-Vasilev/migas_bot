import type { Telegraf } from 'telegraf'
import { Command } from '../utils/consts'

export async function connectMenu(bot: Telegraf) {
  bot.telegram.setMyCommands([
    {
      command: Command.findPsycho,
      description: 'Найти психолога'
    },
  ])
}
