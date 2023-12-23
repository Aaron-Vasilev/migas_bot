import dotenv from 'dotenv'
import pg, { Client } from 'pg'
import { Telegraf } from 'telegraf'
import { connectMenu } from './events/menu'
import { connectCommands } from './events/commands'
import { connectStart } from './events/start'
import { connectActions } from './events/actions'
import { connectScenes } from './events/scenes'

dotenv.config()
pg.types.setTypeParser(1082, (val) => val)

const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'development' ? false : {
    rejectUnauthorized: false
  }
})
db.connect()

const bot = new Telegraf(String(process.env.TOKEN))

connectMenu(bot)
connectCommands(bot, db)
connectActions(bot, db)
connectStart(bot, db)
connectScenes(bot, db)

bot.launch()
  .catch(async (e) => {
    console.log('† line 26 e', e)
    process.exit(1)
  })
console.log('Launch!')
