import { BotCommand } from "telegraf/typings/core/types/typegram"
import { AVAILABLE_COMMANDS } from "./config"

export const getAvailableCommandsMessage = (): string => `
<b>Доступные команды:</b>

${Object.entries(AVAILABLE_COMMANDS).map(([command, description]) => (
  `/${command} - ${description}`
)).join('\n\n')}
`

export const getStartMessage = (): string => `
Привет! Я Lexify Bot, твой личный тренер по словам на английском. Готов учить новые слова? Давай начнем! 📚🔠
${getAvailableCommandsMessage()}
`

export const getBotCommands = (): BotCommand[] => {
  return Object.entries(AVAILABLE_COMMANDS).map(([command, description]) => ({
    command,
    description
  }))
}