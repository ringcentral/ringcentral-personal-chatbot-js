
/**
 * lambda file
 */

import axios from 'axios'

export const maintain = async () => {
  console.log('send renew request')
  return axios.put(
    `${process.env.RINGCENTRAL_CHATBOT_SERVER}/admin/renew`,
    undefined,
    {
      auth: {
        username: process.env.RINGCENTRAL_CHATBOT_ADMIN_USERNAME,
        password: process.env.RINGCENTRAL_CHATBOT_ADMIN_PASSWORD
      }
    }
  ).then(d => d.data)
    .catch(e => {
      console.log(e)
    })
}
