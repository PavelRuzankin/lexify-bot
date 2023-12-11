import { Bot, ChattingType } from './types'

export const setupActions = (bot: Bot) => {
  bot.use(async (context, next) => {
    const chattingType = context.session.chattingType
    const action = chattingType === ChattingType.TEXT 
      ? 'typing' 
      : 'record_voice'

    await context.sendChatAction(action)

    const intervalId = setInterval(() => {
      context.sendChatAction(action)
    }, 5000)

    await next()
    clearInterval(intervalId)
  })

  return bot
}