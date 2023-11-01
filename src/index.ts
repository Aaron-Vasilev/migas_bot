import dotenv from 'dotenv'
import { Telegraf } from 'telegraf'
import { PrismaClient } from '@prisma/client'
import { connectMenu } from './events/menu'
import { connectCommands } from './events/commands'
import { connectStart } from './events/start'
import { connectActions } from './events/actions'

dotenv.config()
//pg.types.setTypeParser(1082, (val) => val)

export const prisma = new PrismaClient()
//const db = new Client({
//  connectionString: process.env.DATABASE_URL,
//  ssl: process.env.NODE_ENV === 'dev' ? false : {
//    rejectUnauthorized: false
//  }
//})
//db.connect()

const bot = new Telegraf(String(process.env.TOKEN))

connectMenu(bot)
connectCommands(bot, prisma)
connectActions(bot, prisma)
connectStart(bot, prisma)

bot.launch()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.log('† line 26 e', e)
    await prisma.$disconnect()
    process.exit(1)
  })
console.log('Launch!')
