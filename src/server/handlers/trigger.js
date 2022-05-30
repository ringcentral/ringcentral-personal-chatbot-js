/**
 * handle triggers
 */

import { triggerMaintain } from './renew-task'

export default function (event) {
  // console.log('event', event)
  const {
    app
  } = event
  if (app === 'maintain') {
    return triggerMaintain(event)
  }
}
