import type { Telegraf } from 'telegraf'
import { Command } from '../utils/consts'

export async function connectMenu(bot: Telegraf) {
  bot.telegram.setMyCommands([
    {
      command: Command.findPsycho,
      description: 'Выбрать специалиста'
    },
    {
      command: Command.findTherapist,
      description: 'Aнкета для поиска психотерапевта'
    },
    {
      command: Command.therapistForm,
      description: 'Aнкета для терапевтов'
    },
  ])
}
