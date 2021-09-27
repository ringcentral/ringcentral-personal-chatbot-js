
/**
 * lambda file
 */

import triggerFunc from './app/handlers/trigger'
import { maintain as maintainFunc } from './app/common/maintain'

export const maintain = async () => {
  console.log('send renew request')
  await maintainFunc()
}

export const trigger = async (event) => {
  return triggerFunc(event)
}
