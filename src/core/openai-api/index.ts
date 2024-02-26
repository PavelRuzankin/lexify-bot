import OpenAIApi from 'openai';
import config from 'config'

const openAIApi = new OpenAIApi({
  apiKey: config.get('OPENAI_KEY')
})

export default openAIApi