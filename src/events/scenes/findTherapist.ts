//@ts-nocheck
import { type Client } from 'pg'
import { Markup, Scenes } from 'telegraf'
import { Category, Message } from '../../utils/consts'
import { genInlineBtns, therapistDescription } from '../../utils'

export const FIND_THERAPIST = 'findTherapist'

export const findTherapist = (db: Client) => (new Scenes.WizardScene(FIND_THERAPIST,
  ctx => {
    ctx.reply('В какой ценовой категории вы рассматриваете терапевта?', {
      ...Markup.inlineKeyboard([
        genInlineBtns(false, '3000-5000', '5000-7000', '7000-9000'),
        [Markup.button.callback('Не имеет значения', '0-100000')],
      ])
    })

    return ctx.wizard.next()
  },
  ctx => {
    if (!ctx.update.callback_query) return ctx.reply(Message.notButton)

    ctx.wizard.state.price = ctx.update.callback_query.data
    ctx.reply('С чем связан ваш запрос?', {
      ...Markup.inlineKeyboard([
        [Markup.button.callback('Отношения в паре/семье', Category.family)],
        [Markup.button.callback('Карьера', Category.career)],
        [Markup.button.callback('Терапия для подростка', Category.teen)],
        [Markup.button.callback('Поиск себя', Category.self)],
        [Markup.button.callback('Взаимоотношения с окружающими', Category.relations)],
        [Markup.button.callback('Психосоматика', Category.psychosomatic)],
        [Markup.button.callback('Нет четкого запроса', Category.doubt)],
      ])
    })

    return ctx.wizard.next()
  },
  ctx => {
    if (!ctx.update.callback_query) return ctx.reply(Message.notButton)

    ctx.wizard.state.category = ctx.update.callback_query.data
    ctx.reply('Какую терапию рассматриваете?', {
      ...Markup.inlineKeyboard([
        [Markup.button.callback('Долгосрочную', '1')],
        [Markup.button.callback('Короткосрочную (до 10 сеансов)', '2')],
        [Markup.button.callback('Не уверен(а)', '0')],
      ])
    })

    return ctx.wizard.next()
  },
  ctx => {
    if (!ctx.update.callback_query) return ctx.reply(Message.notButton)

    ctx.wizard.state.duration = ctx.update.callback_query.data
    ctx.reply('Какой опыт должен быть у терапевта?', {
      ...Markup.inlineKeyboard([
        [Markup.button.callback('Более 3 лет', '3')],
        [Markup.button.callback('Более 5 лет', '5')],
        [Markup.button.callback('Более 10 лет', '10')],
        [Markup.button.callback('Не имеет значения', '0')],
      ])
    })

    return ctx.wizard.next()
  },
  ctx => {
    if (!ctx.update.callback_query) return ctx.reply(Message.notButton)

    ctx.wizard.state.experience = ctx.update.callback_query.data
    ctx.reply('Выберите формат терапии', {
      ...Markup.inlineKeyboard([
        [Markup.button.callback('Очно в Москве', '1')],
        [Markup.button.callback('Онлайн', '2')],
        [Markup.button.callback('Не имеет значения', '0')],
      ])
    })

    return ctx.wizard.next()
  },
  ctx => {
    if (!ctx.update.callback_query) return ctx.reply(Message.notButton)

    ctx.wizard.state.experience = ctx.update.callback_query.data
    ctx.reply('Выберите формат терапии', {
      ...Markup.inlineKeyboard([
        [Markup.button.callback('Очно в Москве', '1')],
        [Markup.button.callback('Онлайн', '2')],
        [Markup.button.callback('Не имеет значения', '0')],
      ])
    })

    return ctx.wizard.next()
  },
  async ctx => {
    if (!ctx.update.callback_query) return ctx.reply(Message.notButton)

    const { price, category, duration, experience } = ctx.wizard.state
    const [minPrice, maxPrice] = price.split('-')
    const categoryQuery = category ? `AND ${Category[category]} > 0` : ""
    console.log('† line 100 categoryQuery', categoryQuery)

    const res = await db.query(`
      SELECT migas.user.id, description, photo, fullname FROM migas.specialist
      JOIN migas.user ON migas.specialist.id = migas.user.id
      WHERE price >= ${minPrice} AND price <= ${maxPrice} ${categoryQuery}
    `)

    if (res.rows.length > 0) {
      res.rows.forEach(async (therapist) => {
        await ctx.sendPhoto( { url: therapist.photo })
        await ctx.replyWithHTML(therapistDescription(therapist))
      })
    } else {
      ctx.reply("Извините по вашим требованиям специалистов нет")
    }

    return ctx.scene.leave()
  }
))
