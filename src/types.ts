import type { Context, Telegraf } from 'telegraf';
import type { Session } from './session';

export enum ChattingType {
  TEXT = 'TEXT',
  VOICE = 'VOICE',
  MIXED = 'MIXED'
}

export interface BotContext extends Context {
  session: Session
}

export type Bot = Telegraf<BotContext>

export type ComposeCallback<T> = (arg: T) => T;
