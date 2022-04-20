/**
 * auto init database after server running
 */

const axios = require('axios')
const port = process.env.SERVER_PORT
const url = `http://127.0.0.1:${port}/admin/setup-database`

export default () => {
  console.log('-> init database...')
  console.log('->', url)
  axios.put(
    url,
    undefined,
    {
      auth: {
        username: process.env.RINGCENTRAL_CHATBOT_ADMIN_USERNAME,
        password: process.env.RINGCENTRAL_CHATBOT_ADMIN_PASSWORD
      }
    }
  )
}
