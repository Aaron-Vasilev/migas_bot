//@ts-nocheck
import { type Client } from 'pg'
import { Scenes, Markup } from 'telegraf'
import { Message } from '../../utils/consts'
import { therapistFormKeyboardScale, validateNumber } from '../../utils'

export const THERAPIST_FORM = 'therapistForm'

export const therapistForm = (db: Client) => (new Scenes.WizardScene(THERAPIST_FORM,
  ctx => {
    ctx.reply('Отправьте сообщением стоимость вашей терапии (50 минут)')

    return ctx.wizard.next()
  },
  async ctx => {
    const price = ctx.message.text
    
    if (!validateNumber(price)) return ctx.reply("Сообщение должно быть цифрой")

    ctx.wizard.state.price = price
    await ctx.reply("Оцените свои возможности по каждому из пунктов:")
    ctx.reply("Карьера", therapistFormKeyboardScale())

    return ctx.wizard.next()
  },
  ctx => {
    if (!ctx.update.callback_query) return ctx.reply(Message.notButton)
    
    ctx.wizard.state.career = ctx.update.callback_query.data
    ctx.reply("Семейная терапия", therapistFormKeyboardScale())

    return ctx.wizard.next()
  },
  ctx => {
    if (!ctx.update.callback_query) return ctx.reply(Message.notButton)
    
    ctx.wizard.state.family = ctx.update.callback_query.data
    ctx.reply("Терапия для подростка", therapistFormKeyboardScale())

    return ctx.wizard.next()
  },
  ctx => {
    if (!ctx.update.callback_query) return ctx.reply(Message.notButton)
    
    ctx.wizard.state.teen = ctx.update.callback_query.data
    ctx.reply("Поиск себя", therapistFormKeyboardScale())

    return ctx.wizard.next()
  },
  ctx => {
    if (!ctx.update.callback_query) return ctx.reply(Message.notButton)
    
    ctx.wizard.state.self = ctx.update.callback_query.data
    ctx.reply("Взаимоотношения с окружающими", therapistFormKeyboardScale())

    return ctx.wizard.next()
  },
  ctx => {
    if (!ctx.update.callback_query) return ctx.reply(Message.notButton)
    
    ctx.wizard.state.relations = ctx.update.callback_query.data
    ctx.reply("Психосоматика", therapistFormKeyboardScale())

    return ctx.wizard.next()
  },
  ctx => {
    if (!ctx.update.callback_query) return ctx.reply(Message.notButton)
    
    ctx.wizard.state.psychosomatic = ctx.update.callback_query.data
    ctx.reply("Без четкого запроса", therapistFormKeyboardScale())

    return ctx.wizard.next()
  },
  ctx => {
    if (!ctx.update.callback_query) return ctx.reply(Message.notButton)
    
    ctx.wizard.state.doubt = ctx.update.callback_query.data
    ctx.reply("Какую терапию вы ведёте?", {
    ...Markup.inlineKeyboard([
        [Markup.button.callback('Долгосрочную', '1')],
        [Markup.button.callback('Короткосрочную (до 10 сеансов)', '2')],
        [Markup.button.callback('Любую', '0')],
      ])
    })

    return ctx.wizard.next()
  },
  ctx => {
    if (!ctx.update.callback_query) return ctx.reply(Message.notButton)

    ctx.wizard.state.duration = ctx.update.callback_query.data
    ctx.reply("В каком формате работаете?", {
      ...Markup.inlineKeyboard([
        [Markup.button.callback('Очно в Москве', '1')],
        [Markup.button.callback('', '2')],
        [Markup.button.callback('Любом', '0')],
      ])
    })
    
    return ctx.wizard.next()
  },
  ctx => {
    if (!ctx.update.callback_query) return ctx.reply(Message.notButton)

    ctx.wizard.state.format = ctx.update.callback_query.data
    ctx.replyWithHTML("<b>Опишите себя как терапевта в 2-3 предложениях:</b>\n(расскажите о себе, про свой опыт, опишите свои ключевые профессиональные качества)")
    
    return ctx.wizard.next()
  },
  ctx => {
    if (ctx.message.text.length === 0) return ctx.reply("Пожалуйста введите текст")

    ctx.wizard.state.description = ctx.message.text
    ctx.replyWithHTML("<b>Загрузите вашу фотографию 📸</b>\n(в хорошем качестве, приличной одежде, формат - портрет🧑💼, ❌не селфи🤳, в форме квадрата)")
    
    return ctx.wizard.next()
  },
  async ctx => {
    const url = await ctx.telegram.getFileLink(ctx.message.photo.at(-1).file_id)
    const { price, career, family, teen, 
            self, relations, psychosomatic, 
            doubt, format, description } = ctx.wizard.state

    await db.query(`INSERT INTO migas.specialist (id, price, career, family, teen, self, 
                    relations, psychosomatic, doubt, format, description, photo)
                    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) `, 
                   [ctx.message.from.id, price, career, family, teen, self, relations, 
                    psychosomatic, doubt, format, description, url.href])
    
    return ctx.scene.leave()
  }
))
