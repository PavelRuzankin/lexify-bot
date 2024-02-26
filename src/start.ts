import { telegraf } from './telegraf';
import { compose } from './utils/compose';
import { initDataSource } from './data-source';
import { setupChatActions } from './chat-actions';
import { setupScenarios } from './scenarios';
import { setupSettings } from './userSettings';

export const start = async () => {
  let startTry = 1

  try {
    const dataSource = await initDataSource()
  
    if(!dataSource) return
    
    compose(
      setupSettings,
      setupChatActions,
      setupScenarios,
    )(telegraf);
  } catch(error) {
    console.error(`Error while starting. Try ${startTry}`, error)

    if(startTry <= 3) {
      start()
    }
  }
}