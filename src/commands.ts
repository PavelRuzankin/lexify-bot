import { Markup } from 'telegraf';
import { Bot, BotContext, ChattingType } from './types';

const replySettings = (context: BotContext) => {
  context.reply(
    'Выберите способ общения:',
    Markup.inlineKeyboard([
      Markup.button.callback('Текст', ChattingType.TEXT),
      Markup.button.callback('Аудио', ChattingType.VOICE),
      Markup.button.callback('Смешанный', ChattingType.MIXED)
    ])
  )}

export const setupCommands = (bot: Bot) => {
  bot.command(['setup', 'start'], replySettings)

  bot.action(Object.values(ChattingType), async (context) => {
    const chattingType = context.match[0] as ChattingType
    await context.session.setChattingType(chattingType)
    
    context.reply('Приятного общения!')

  })

  return bot
}

