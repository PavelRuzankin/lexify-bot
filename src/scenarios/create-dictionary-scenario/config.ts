export enum Stage {
  NAME = 'NAME',
  WORDS = 'WORDS',
  CREATE = 'CREATE'
}

export enum ActionButton {
  CONFIRM = 'CONFIRM',
  EDIT = 'EDIT',
  CONTINUE = 'CONTINUE'
}

export const TEXT = {
  start: () => `<b>Создание словаря.</b>\nВведите название нового словаря`,
  success: () => 'Словарь успешно создан!',
  typeWords: (name: string) => `Словарь <b>«${name}»</b>.\nВведите слова на английском, которые вы хотите включить в словарь`,
  typeInEnglish: () => 'Введите слова на английском',
  rejectedWords: (words?: string[]) => words?.length ? '\nCлова ' + words.join(', ') + ' были отклонены.' : '',
  acceptMessage: (name: string, words: string[], rejections?: string[]) => `Словарь <b>«${name}»</b> будет содержать слова ${words.join(', ')}.` + TEXT.rejectedWords(rejections),
  rejectMessage: () => 'Данных слов нет в английском языке. Попробуйте ввести другие слова.',
  create: () => 'Создать словарь',
  edit: () => 'Ввести заново'
}