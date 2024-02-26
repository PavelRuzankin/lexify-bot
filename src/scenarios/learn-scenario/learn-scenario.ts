import core from "../../core";
import config from 'config'
import { dataSource } from "../../data-source";
import { BotContext } from "../../types";
import { Scenario } from "../types";
import { Level, Stage, TEXT } from "./config";
import * as entity from "../../entity";
import { Markup } from "telegraf";
import ScenarioStore from "../scenario-store";
import { AiResponse, Sentence } from "./types";
import learnCycle from "./learn-cycle";

export default class LearnScenario implements Scenario {
  private _stage = Stage.SELECT_DICTIONARY
  private readonly _dictionaryRepository = dataSource.getRepository(entity.Dictionary)
  private readonly _assistant = core.createAssistant<AiResponse>(
    config.get('SENTENCES_GENERATOR_ID')
  )
  private readonly _dictionaries: entity.Dictionary[] = []
  private _selectedDictionary: entity.Dictionary | null = null
  private _count: number | null = null
  private _level: Level | null = null
  private _cycle: learnCycle | null = null

  constructor(
    private readonly _userId: string, 
    private readonly _store: ScenarioStore
  ) {}

  action(action: string, context: BotContext) {
    if(this._stage === Stage.SELECT_DICTIONARY) {
      return this._handleDictionary(action, context)
    }

    if(this._stage === Stage.SELECT_COUNT) {
      return this._handleCount(action, context)
    }

    if(this._stage === Stage.LEARN) {
      return this._cycle?.action(action, context)
    }

    if(this._stage === Stage.LEVEL) {
      return this._handleLevel(action, context)
    }
  };

  message(message: string, context: BotContext) {};
  voice(voice: string, context: BotContext) {};

  async start(context: BotContext): Promise<void> {
    await this._uploadDictionaries()
    const keyboard = this._getDictionariesList()
    if(keyboard) {
      await context.reply(TEXT.start(), keyboard)
    }
  }

  private async _handleLevel(level: string, context: BotContext) {
    this._level = level as Level

    this._startLearning(context)
  }

  private async _handleCount(action: string, context: BotContext) {
    const count = Number(action)
    if(!Number.isNaN(count)) {
      this._count = count
      this._stage = Stage.LEVEL
      
      await context.replyWithHTML(TEXT.selectCount(count), Markup.inlineKeyboard([
        Markup.button.callback(Level.A1, Level.A1),
        Markup.button.callback(Level.A2, Level.A2),
        Markup.button.callback(Level.B1, Level.B1),
        Markup.button.callback(Level.B2, Level.B2),
        Markup.button.callback(Level.C1, Level.C1),
        Markup.button.callback(Level.C2, Level.C2),
      ]))
    }
  }

  private async _handleDictionary(dictionaryId: string, context: BotContext) {
    const dictionary = this._dictionaries.find(({ id }) => id === dictionaryId)

    if(dictionary) {
      this._selectedDictionary = dictionary
      this._stage = Stage.SELECT_COUNT
      await context.replyWithHTML(
        TEXT.selectDictionary(dictionary.name), 
        Markup.inlineKeyboard([
          Markup.button.callback('10', '10'),
          Markup.button.callback('20', '20'),
          Markup.button.callback('30', '30'),
          Markup.button.callback('40', '40'),
        ])
      )
    }
  }

  private async _startLearning(context: BotContext) {
    await this._notifyStart(context);
    
    const sentences = await this._createSentences();
      
    if(!sentences) return 

    this._stage = Stage.LEARN;
    this._cycle = new learnCycle(sentences, this._store)
    this._cycle.start(context)
  }

  private async _notifyStart(context: BotContext) {
    if(!(this._selectedDictionary && this._count && this._level)) return null

    context.replyWithHTML(TEXT.notifyStart(
      this._selectedDictionary.words.map(({ value }) => value),
      this._count,
      this._level
    ))
  }

  private async _createSentences(): Promise<Sentence[] | null> {
    if(!(this._selectedDictionary && this._count && this._level)) return null

    const words = this._selectedDictionary.words.map(({ value }) => value)

    const response = await this._assistant.fetch({
      count: this._count,
      words: words
    })

    return response ? response.sentences : null
  }

  private async _uploadDictionaries() {
    const dictionaries = await this._dictionaryRepository.find({
      where: { userId: this._userId },
      relations: { words: true }
    })

    this._dictionaries.push(...dictionaries)
  }

  private _getDictionariesList() {
    if(!this._dictionaries.length) return null

    return Markup.inlineKeyboard(this._dictionaries.map((dictionary) => (
      Markup.button.callback(dictionary.name, dictionary.id)
    )))
  }
}