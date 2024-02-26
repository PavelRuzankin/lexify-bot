import { Bot } from './types'

export const setupChatActions = (bot: Bot): Bot => {
  bot.use(async (context, next) => {
    context.sendChatAction('typing')

    const intervalId = setInterval(() => {
      context.sendChatAction('typing')
    }, 5000)

    await next()
    clearInterval(intervalId)
  })

  return bot
}