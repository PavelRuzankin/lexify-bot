import { Sentence } from "../types";
import { CycleMessage } from "./types";

export const createMessages = (sentences: Sentence[]): CycleMessage[] => 
  sentences.reduce<CycleMessage[]>((normalized, sentence) => {
    normalized.push(
      { audio: true, value: sentence.eng, source: 'en' },
      { audio: false, value: sentence.ru, source: 'ru' },
    )
    return normalized
  }, [])