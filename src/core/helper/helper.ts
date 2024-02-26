import OpenAIApi from 'openai';
import { createReadStream } from 'fs';

export default class Helper {
  constructor(private api: OpenAIApi) {}

  async textToSpeach(input: string): Promise<Buffer | null> {
    try {
      const mp3 = await this.api.audio.speech.create({
        model: 'tts-1',
        voice: 'alloy',
        input,
      });

      return Buffer.from(await mp3.arrayBuffer());
    } catch(err) {
      console.error('Error whle converting text to speach', input)
      return null
    }
  }

  async transcribe(filepath: string): Promise<string | null> {
    try {
     const response = await this.api.audio.transcriptions.create({
        file: createReadStream(filepath),
        model: 'whisper-1'
     })

     return response.text
    } catch(err) {  
      console.error('Error while transcribing', err)
      return null
    }
  }
}