import { openAI } from './open-ai';
import { BotContext, ChattingType } from './types';

const replyText = async (input: string, context: BotContext) => {
  const output = await openAI.chatByText(input)
  if(output) context.reply(output);
}

const replyVoice = async (input: string, context: BotContext) => {
  const output = await openAI.chatByVoice(input)
  if(output) context.sendVoice({ source: output });
}

const replyMixed = async (input: string, context: BotContext) => {
  const output = await openAI.chatByTextAndVoice(input)

  if(output.voice) {
    await context.sendVoice({ source: output.voice });
  }

  if(output.text) {
    await context.reply(output.text);
  }
}

const REPLIES = {
  [ChattingType.VOICE]: replyVoice,
  [ChattingType.TEXT]: replyText,
  [ChattingType.MIXED]: replyMixed,
}

export const reply = (input: string, context: BotContext) => {
  try {
    return REPLIES[context.session.chattingType as ChattingType](input, context)
  } catch(err) {
    console.error('Error while replying', err)
  }

}
