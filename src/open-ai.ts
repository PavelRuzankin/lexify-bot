import OpenAIApi from 'openai';
import config from 'config'
import { createReadStream } from 'fs';
import { ChatCompletionMessageParam } from 'openai/resources';

type TextAndVoiceOutput = {
  voice?: Buffer | null
  text?: string | null
}

class OpenAI {
  private _api = new OpenAIApi({
    apiKey: config.get('OPENAI_KEY')
  })
  
  async chatByText(input: string): Promise<null | string> {
    try {
      const response = await this._api.chat.completions.create({
        messages: this._getMessages(input),
        model: 'gpt-3.5-turbo'
      })

      return response.choices[0]?.message.content ?? null
      
    } catch(err) {
      console.error('Error while chatting', err)
      return null
    }
  }

  async chatByVoice(input: string):  Promise<null | Buffer>  {
    const text = await this.chatByText(input)

    if(!text) return null

    return this._textToSpeach(text)
  }

  async chatByTextAndVoice(input: string): Promise<TextAndVoiceOutput> {
    const output: TextAndVoiceOutput = {}

    output.text = await this.chatByText(input)

    if(!output.text) return output

    output.voice = await this._textToSpeach(output.text)

    return output

  }

  private async _textToSpeach(input: string): Promise<Buffer | null> {
    try {
      const mp3 = await this._api.audio.speech.create({
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
     const response = await this._api.audio.transcriptions.create({
        file: createReadStream(filepath),
        model: 'whisper-1'
     })

     return response.text
    } catch(err) {  
      console.error('Error while transcribing', err)
      return null
    }
  }

  private _getMessages(
    content: string
  ): ChatCompletionMessageParam[] {
    return [{ role: 'user', content }]
  }
}

export const openAI = new OpenAI()