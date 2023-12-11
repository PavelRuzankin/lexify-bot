import { setupSession } from './session';
import { setupChat } from './chat';
import { telegraf } from './telegraf';
import { setupCommands } from './commands';
import { compose } from './compose';
import { setupActions } from './actions';

export const start = () => {
  try {
    compose(
      setupChat,
      setupCommands,
      setupActions,
      setupSession, 
    )(telegraf);
  } catch(err) {
    console.error(err)
    start()
  }
}