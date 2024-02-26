import core from "../../../core";
import { Markup } from "telegraf";
import { BotContext } from "../../../types";
import { Scenario } from "../../types";
import { TEXT } from "../config";
import { Sentence } from "../types";
import { CycleMessage } from "./types";
import { createMessages } from "./utils";
import { NEXT_ACTION } from "./config";
import ScenarioStore from "../../scenario-store";

class LearnСycle implements Scenario {
  private _primaryCount: number
  private _currMessage: CycleMessage | null = null
  private readonly _messages: CycleMessage[]

  constructor(
    sentences: Sentence[],
    private readonly _store: ScenarioStore
  ) {
    this._primaryCount = sentences.length
    this._messages = createMessages(sentences)
  }

  async start(context: BotContext) {
    await this._turnCycle(context)
  };

  async action(action: string, context: BotContext): Promise<void> {
    if(action === NEXT_ACTION) {
      await this._turnCycle(context)
    }
  }

  async message(message: string, context: BotContext): Promise<void> {}
  async voice(voice: string, context: BotContext): Promise<void> {}

  private async _turnCycle(context: BotContext) {
    if(!this._messages.length) {
      await context.replyWithHTML(TEXT.stopLearning(this._primaryCount))
      await context.settings.removeCurrScene()
      this._store.removeScene(context.settings.userId)
      return;
    }

    this._applyNewMessage()
    this._replyMessage(context)
  }

  private _applyNewMessage() {
    const sentence = this._messages.pop()

    if(sentence) {
      this._currMessage = sentence
    }
  }

  private async _replyMessage(context: BotContext) {
    if(!this._currMessage) return 

    if(this._currMessage.audio) {
      const voice = await core.helper.textToSpeach(this._currMessage.value)

      if(voice) {
        await context.sendVoice({ source: voice })
      };      
    }

    const flag = this._currMessage.source === 'ru' ? '🇷🇺 ' : '🇺🇸 '

    await context.reply(flag + this._currMessage.value, Markup.inlineKeyboard([
      Markup.button.callback('Далее', NEXT_ACTION)
    ]))
  }
}

export default LearnСycle