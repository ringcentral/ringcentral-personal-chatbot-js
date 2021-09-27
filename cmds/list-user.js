
require('dotenv').config()
const axios = require('axios')
const { writeFileSync } = require('fs')
const { resolve } = require('path')

const {
  PROD_SERVER,
  PROD_USER,
  PROD_PASS,
  RUN
} = process.env

async function run () {
  console.log('run')
  const conf = {
    auth: {
      username: PROD_USER,
      password: PROD_PASS
    }
  }
  const r = await axios.get(
    `${PROD_SERVER}/admin/view-faqs`,
    conf
  )
    .then(r => {
      return r.data
    })
    .catch(console.log)
  const p = resolve(__dirname, `../temp/all-rc-user-faq.json`)
  writeFileSync(
    p,
    JSON.stringify(r, null, 2)
  )
  const r1 = await axios.get(
    `${PROD_SERVER}/admin/view-database`,
    conf
  )
    .then(r => {
      return r.data
    })
    .catch(console.log)
  const p1 = resolve(__dirname, `../temp/all-rc-user.json`)
  writeFileSync(
    p1,
    JSON.stringify(r1, null, 2)
  )
  return [r, r1]
}

if (RUN !== 'yes') {
  run()
}
