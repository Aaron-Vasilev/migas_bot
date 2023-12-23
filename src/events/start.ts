import { type Client } from 'pg'
import type { Telegraf } from 'telegraf'

export async function connectStart(bot: Telegraf, db: Client) {
  bot.start(async ctx => {
    try {
      const { id, username, first_name, last_name } = ctx.from
      const fullName = (first_name ? `${first_name}` : '') +
                       (first_name && last_name ? ' ' : '') +
                       (last_name ? `${last_name}` : '')

      await db.query(`INSERT INTO migas.user (id, username, fullname)
                      VALUES ($1, $2, $3) ON CONFLICT (id) DO
                      UPDATE SET username=$2, fullname=$3;`, [id, username, fullName])

      ctx.reply("Hi a new user!")
    } catch (e) {
      console.log('† line 8 e', e)
    }
  })
}
