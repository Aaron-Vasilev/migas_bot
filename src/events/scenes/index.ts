//@ts-nocheck
import { type Client } from 'pg'
import { Scenes, session, type Telegraf } from 'telegraf'
import { Command } from '../../utils/consts'
import { FIND_THERAPIST, findTherapist } from './findTherapist'
import { THERAPIST_FORM, therapistForm } from './therapistForm'


export async function connectScenes(bot: Telegraf, db: Client) {

  const stage = new Scenes.Stage([
    findTherapist(db).command(Command.cancel, ctx => ctx.scene.leave()), 
    therapistForm(db).command(Command.cancel, ctx => ctx.scene.leave()),
  ])

  bot.use(session())
  bot.use(stage.middleware())

  bot.command(Command.findTherapist, async ctx => await ctx.scene.enter(FIND_THERAPIST))
  bot.command(Command.therapistForm, async ctx => await ctx.scene.enter(THERAPIST_FORM))
}
