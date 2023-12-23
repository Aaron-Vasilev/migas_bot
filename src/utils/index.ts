import { Markup } from "telegraf"


export function genInlineBtns(newLine: boolean, ...args: string[]) {
  const buttons: any[] = []

  args.forEach(value => {
    buttons.push(newLine ? 
      [Markup.button.callback(value, value)] : 
      Markup.button.callback(value, value))
  })

  return buttons
}

export function validateNumber(n: string) {
  if (n === undefined || n.length === 0) return false
  if (!isNaN(+n)) return true
}

export function therapistFormKeyboardScale() {
  return {
    ...Markup.inlineKeyboard([
      [Markup.button.callback('Не работаю с таким запросом', '0')],
      [Markup.button.callback('Могу работать с таким запросом', '1')],
      [Markup.button.callback('Уверенно работаю с таким запросом', '2')],
      [Markup.button.callback('Имею высокую компетенцию в этом запросе', '3')],
    ])
  }
}

interface Therapist {
  id: number
  fullname: string
  description: string
}

export function therapistDescription(t: Therapist): string {
  return `<b>${t.fullname}</b>

${t.description}`
}
