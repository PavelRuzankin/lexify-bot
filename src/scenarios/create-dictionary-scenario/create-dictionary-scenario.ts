import { Markup } from "telegraf";
import config from 'config'
import { BotContext } from "../../types";
import { Scenario } from "../types";
import core from "../../core";
import { ActionButton, Stage, TEXT } from "./config";
import * as entity from "../../entity";
import { arrayToMap, extractWords } from "../../utils";
import ScenarioStore from "../scenario-store";
import { isOnlyLatin } from "../../utils/is-only-latin";
import { ValidationResponse } from "./types";
import { dataSource } from "../../data-source";

export default class CreateDictionaryScenario implements Scenario {
  static actions = Object.values(ActionButton)

  private _stage = Stage.NAME
  private readonly _dictionary = new entity.Dictionary()
  private readonly _assistant = core.createAssistant<ValidationResponse>(
    config.get('WORDS_VALIDATOR_ID')
  )

  private _dictionaryRepository = dataSource.getRepository(entity.Dictionary)
  private _wordRepository = dataSource.getRepository(entity.Word)

  constructor(
    private readonly _userId: string,
    private readonly _store: ScenarioStore
  ) {
    this._dictionary.userId = this._userId
  }

  async start(context: BotContext): Promise<void> {
    await context.replyWithHTML(TEXT.start())
  }

  voice() {};

  async action(action: string, context: BotContext): Promise<void> {
    if(this._stage !== Stage.CREATE) {
      return 
    }

    if(action === ActionButton.CONFIRM) {
      await this._saveDictionary()
      await context.reply(TEXT.success())
      await context.settings.removeCurrScene()
      this._store.removeScene(context.settings.userId)
    }

    if(action === ActionButton.EDIT) {
      await context.replyWithHTML(TEXT.typeWords(this._dictionary.name))
      this._setStage(Stage.WORDS)
    }
  }

  async message(message: string, context: BotContext): Promise<void> {
    if (this._stage === Stage.NAME)
      return this._handleNameStage(message, context)

    if (this._stage === Stage.WORDS)
      return this._handleWordsStage(message, context)
  }

  private async _handleNameStage(message: string, context: BotContext): Promise<void> {
    this._dictionary.name = message.charAt(0).toUpperCase() + message.slice(1);

    await context.replyWithHTML(TEXT.typeWords(this._dictionary.name))
    this._setStage(Stage.WORDS)
  }

  private async _handleWordsStage(message: string, context: BotContext): Promise<void> {
    if(!isOnlyLatin(message)) {
      await context.reply(TEXT.typeInEnglish())
      return
    }

    const words = extractWords(message);

    const response = await this._assistant.fetch(words);

    if(!response) return 

    if(!response.acceptances?.length) {
      await context.reply(TEXT.rejectMessage()) 
      return
    }

    await this._saveWords(response.acceptances)

    const reply = TEXT.acceptMessage(
      this._dictionary.name, 
      response.acceptances, 
      response.rejections
    )

    await context.replyWithHTML(reply, Markup.inlineKeyboard([ 
      Markup.button.callback(TEXT.create(), ActionButton.CONFIRM),
      Markup.button.callback(TEXT.edit(), ActionButton.EDIT)
    ]))

    this._setStage(Stage.CREATE)
  }

  private async _saveWords(values: string[]) {
    const presentWordsMap = await this._getWordsMap(values)

    const words = values.map(value => {
      const presentWord = presentWordsMap.get(value)
      if(presentWord) return presentWord

      const word = new entity.Word()
      word.value = value
      return word
    })

    try {
      await this._wordRepository.save(words)
      this._dictionary.words = words
    } catch(err) {
      console.error('Error while saving ' + err)
    }
  }

  private async _saveDictionary() {    
    await this._dictionaryRepository.save(this._dictionary)
  }
  
  private _setStage(stage: Stage) {
    this._stage = stage
  }

  async _getWordsMap(words: string[]) {
    const existWords = await this._wordRepository.find({
      where: words.map(value => ({ value }))
    })

    return arrayToMap(existWords, 'value')
  }
}
