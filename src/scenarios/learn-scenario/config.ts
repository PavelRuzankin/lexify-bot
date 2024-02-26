export enum Stage {
  SELECT_DICTIONARY = 'SELECT_DICTIONARY',
  SELECT_COUNT = 'SELECT_COUNT',
  LEARN = 'LEARN',
  LEVEL = 'LEVEL'
}

export enum Level {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2',
}

export enum ActionButton {
  NEXT = 'NEXT',
}

export const TEXT = {
  start: () => 'Выберете словарь для изучения.',
  selectDictionary: (dictionary: string) => `Выбранный словарь <b>${dictionary}</b>. \nВыберете количество прдложений.`,
  selectCount: (count: number) => `Выбрано <b>${count} предложений</b>. \nВыберете уровень сложности`,
  notifyStart: (words: string[], count: number, level: Level) => `Вы выбрали:\n\nИзучаемые слова <b>${words.join(', ')}</b>.\nУровень: <b>${level}</b>.\nКоличество предложений: <b>${count}</b>.\n\nИзучение скоро начнётся 🚀`,
  stopLearning: (count: number) => `<b>Изучение оконченно</b>. \nВы изучили ${count} предложений.`,
}