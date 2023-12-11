import { message } from 'telegraf/filters';
import { audioConvertor } from './audio-convertor';
import { openAI } from './open-ai';
import { compose } from './compose';
import { Bot } from './types';
import { reply } from './reply';

const handleVoice = (bot: Bot) => {
  bot.on(message('voice'), async (context, next) => {

    const userId = String(context.message.from.id);

    const url = await context.telegram.getFileLink(context.message.voice.file_id);
    const mp3Path = await audioConvertor.fromOggToMp3(url.href, userId);

    if(!mp3Path) return

    const text = await openAI.transcribe(mp3Path);

    if(text) {
      await reply(text, context)
    }

    await next()
  })

  return bot
}

const handleText = (bot: Bot) => {
  bot.on(message('text'), async (context, next) => {
    await reply(context.message.text, context)
    await next()
  })

  return bot
}

export const setupChat = (bot: Bot) => compose(
  handleVoice,
  handleText,
)(bot)