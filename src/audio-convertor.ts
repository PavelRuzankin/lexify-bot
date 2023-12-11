import axios from 'axios'
import Ffmpeg from 'fluent-ffmpeg'
import installer from '@ffmpeg-installer/ffmpeg'
import { createWriteStream } from 'fs'
import { dirname, resolve } from 'path'

export class AudioConvertor {
  constructor() {
    Ffmpeg.setFfmpegPath(installer.path)
  }

  async fromOggToMp3(url: string, filename: string) {
    const oggPath = await this.loadOgg(url, filename)
    if(oggPath) {
      return this.toMp3(oggPath, filename)
    }

    return null    
  }

  toMp3(input: string, output: string): Promise<string> | null {
    try {
      const outputPath = resolve(dirname(input), `${output}.mp3`)

      return new Promise((resolve, reject) => {
        Ffmpeg(input)
          .inputOption('-t 30')
          .output(outputPath)
          .on('end', () => resolve(outputPath))
          .on('error', (err) => reject(err))
          .run()
      })
    } catch(err) {
      console.error('Error while converting to mp3', err)
      return null
    }
  }

  async loadOgg(url: string, filename: string): Promise<string | null> {
    try {
      const response = await axios.get(url, { responseType: 'stream' })
      // TODO нужно отталкиваться от корня
      const oggPath = resolve(__dirname, '../voices', `${filename}.ogg`)

      return new Promise((resolve) => {
        const stream = createWriteStream(oggPath)
        response.data.pipe(stream)
        stream.on('finish', () => resolve(oggPath))
      })
    } catch(err) {
      console.error('Error while loading', err) 
      return null
    }
  }
}

export const audioConvertor = new AudioConvertor()