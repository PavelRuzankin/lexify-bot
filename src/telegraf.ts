import config from 'config';
import { Telegraf } from 'telegraf';
import { Bot, BotContext } from './types';

export const telegraf = new Telegraf<BotContext>(
  config.get('TELEGRAM_TOKEN'),
  {
    handlerTimeout: 300000,
  }
) as Bot;

telegraf.catch((err) => {
  console.error('Telegraf error', err)
})

telegraf.launch();

process.once('SIGINT', () => telegraf.stop('SIGINT'));
process.once('SIGTERM', () => telegraf.stop('SIGTERM'));