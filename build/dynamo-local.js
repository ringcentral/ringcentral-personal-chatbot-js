import DynamoDbLocal from 'dynamodb-local'

const dynamoLocalPort = 8000

async function init () {
  await DynamoDbLocal.launch(
    dynamoLocalPort, null, [], false, true
  )
  console.log('local dynamdb started at port:', dynamoLocalPort)
}

init()
