import type { Context, Telegraf } from 'telegraf';
import { Scenario } from './scenarios';
import { UserSettings } from './userSettings';

export interface BotContext extends Context {
  settings: UserSettings,
  scenario?: Scenario | null
}

export type Bot = Telegraf<BotContext>

