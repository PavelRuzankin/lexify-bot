import { Repository } from 'typeorm'
import SessionStore from './session-store'
import { BaseSessionEntity } from './types'
import { Context, Telegraf } from 'telegraf'
import { Session } from './session'

type SetupSessionBot<Entity extends BaseSessionEntity> = Telegraf<
  { session: Session<Entity> } & Context
>

export const setupSession = <Entity extends BaseSessionEntity>(
  repository: Repository<Entity>,
  entityCreator: () => Entity
) => (bot: SetupSessionBot<Entity>): SetupSessionBot<Entity> => {
  const sessions = new SessionStore<Entity>(repository, entityCreator)

  bot.use(async (context, next) => {
    context.session = await sessions.getSession(String(context.from?.id))

    next()
  })
  return bot
}