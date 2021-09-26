const AWS = require('aws-sdk')

export function getName (to = 'trigger') {
  const {
    AWS_LAMBDA_FUNCTION_NAME
  } = process.env
  return AWS_LAMBDA_FUNCTION_NAME.replace(/-\w+$/, `-${to}`)
}

export function invoke (data, name = getName()) {
  const lambda = new AWS.Lambda()
  const parameters = {
    FunctionName: name,
    InvocationType: 'Event',
    Payload: JSON.stringify(data)
  }
  return lambda.invoke(parameters).promise()
}
