import { Bot } from "../types";
import { ScenarioKind } from "./config";
import { ScenarioConfig } from './types'
import { message } from "telegraf/filters";
import ScenarioStore from "./scenario-store";
import { getAvailableCommandsMessage, getBotCommands, getStartMessage } from "./utils";

export const getSetup = (configs: ScenarioConfig[]) => (bot: Bot): Bot => {
  const scenarioStore = new ScenarioStore(bot, configs)

  bot.start( async (context) => {
    await context.setChatMenuButton({ type: "commands" },)
    await context.replyWithHTML(getStartMessage()) 
  })

  bot.telegram.setMyCommands(getBotCommands());

  bot.command(ScenarioKind.EXIT, async (context) => {
    if(context.settings.currScene) {
      context.settings.removeCurrScene()
      scenarioStore.removeScene(String(context.from?.id))
      await context.reply('Сценарий прерван.')
      await context.replyWithHTML(getAvailableCommandsMessage())
    }
  })

  bot.command(ScenarioKind.RESTART, async (context) => {
  })

  bot.command(scenarioStore.commands, async (context) => {
    const { settings, command } = context

    if(!settings.currScene) {
      await settings.setCurrScene(command)

      context.scenario = scenarioStore.createScene(settings.userId, command)
      context.scenario?.start(context)
    }
  })

  bot.use(async (context, next) => {
    const { settings } = context
    if(settings.currScene && !context.scenario) {
      const userId = settings.userId
      const scenario = scenarioStore.getScene(userId)

      if(scenario) {
        context.scenario = scenario
        next()
      } else {
        context.scenario = scenarioStore.createScene(userId, settings.currScene)
        context.scenario?.start(context)
      }
    } 
  })

  bot.on(message('text'), (context) => {
    const message = context.message.text
    context.scenario?.message(message, context)
  })

  bot.on('callback_query', (context) => {
    // @ts-ignore
    context.scenario?.action(context.callbackQuery.data, context)
  })

  return bot
}
