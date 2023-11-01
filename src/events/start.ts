import { PrismaClient } from '@prisma/client'
import type { Telegraf } from 'telegraf'

export async function connectStart(bot: Telegraf, db: PrismaClient) {
  bot.start(async ctx => {
    try {
      const { id, username, first_name, last_name } = ctx.from
      const fullname = (first_name ? `${first_name}` : '') +
                       (first_name && last_name ? ' ' : '') +
                       (last_name ? `${last_name}` : '')
      const user = { id, fullname, username }

      await db.user.upsert({
        where: { id },
        update: { fullname, username },
        create: user
      }) 
      ctx.reply("Hi a new user!")
    } catch (e) {
      console.log('† line 8 e', e)
    }
  })
}
