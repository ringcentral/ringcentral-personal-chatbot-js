/**
 * cron job to help maintain accesstoken
 */

import axios from 'axios'
import { CronJob } from 'cron'

function run () {
  if (process.env.NO_CRON_JOB) {
    console.log('NO_CRON_JOB')
    return
  }
  const rule = '* * */1 * *'
  console.log('Running cron job', rule)
  return new CronJob(rule, function () {
    axios.put(
      `${process.env.RINGCENTRAL_CHATBOT_SERVER}/admin/renew-token`,
      undefined,
      {
        auth: {
          username: process.env.RINGCENTRAL_CHATBOT_ADMIN_USERNAME,
          password: process.env.RINGCENTRAL_CHATBOT_ADMIN_PASSWORD
        }
      }
    )
      .then(() => {
        console.log('renew request send:', new Date() + '')
      })
  }, null, true)
}

run()
