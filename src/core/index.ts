import AudioConvertor from "./audio-convertor";
import Assistant from "./assistant";
import openaiApi from "./openai-api";
import Helper from "./helper/helper";

export default {
  audioConvertor: new AudioConvertor(),
  helper: new Helper(openaiApi),
  openaiApi,
  createAssistant: <ResponseType>(id: string) => new Assistant<ResponseType>(openaiApi, id)
}