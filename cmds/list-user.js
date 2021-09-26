
require('dotenv').config()
const axios = require('axios')
const { writeFileSync } = require('fs')
const { resolve } = require('path')
const dayjs = require('dayjs')

const {
  PROD_SERVER,
  PROD_USER,
  PROD_PASS
} = process.env

async function run () {
  console.log('run')
  const r = await axios.get(
    `${PROD_SERVER}/admin/view-database`,
    {
      auth: {
        username: PROD_USER,
        password: PROD_PASS
      }
    }
  )
    .then(r => {
      return r.data
    })
    .catch(console.log)
  const t = dayjs().format('YYYY-MM-DD-HH-mm-ss')
  const p = resolve(__dirname, `../temp/all-rc-user-${t}.txt`)
  writeFileSync(
    p,
    r
  )
}

run()
