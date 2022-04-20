import DynamoDbLocal from 'dynamodb-local'
import { resolve } from 'path'
import fs from 'fs'

const dbPath = resolve(__dirname, '../.dynamodb')

if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath)
}

const dynamoLocalPort = process.env.DYNAMO_PORT || 8000

async function init () {
  console.log('Starting dynamodb server, please wait, do not quit')
  await DynamoDbLocal.launch(
    dynamoLocalPort, dbPath, [], false, true
  )
  console.log('local dynamdb started at port:', dynamoLocalPort)
}

init()
