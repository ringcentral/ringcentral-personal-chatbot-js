import Sequelize from 'dynamo-sequelize'
import AWS from 'aws-sdk'
import dynamoose from 'dynamoose'

const {
  AWS_PROFILE,
  DYNAMODB_LOCALHOST
} = process.env

if (AWS_PROFILE) {
  const credentials = new AWS.SharedIniFileCredentials({
    profile: AWS_PROFILE
  })
  AWS.config.credentials = credentials
}

if (DYNAMODB_LOCALHOST) {
  dynamoose.aws.ddb.local(DYNAMODB_LOCALHOST)
}

const config = {
  define: {
    timestamps: true,
    jsonAsObject: true,
    saveUnknown: true
  },
  logging: false,
  throughput: {
    read: process.env.DYNAMO_READ || 20,
    write: process.env.DYNAMO_WRITE || 10
  }
}

if (process.env.DIALECT === 'dynamodb') {
  config.dialect = 'dynamo'
}

const sequelize = new Sequelize(
  process.env.RINGCENTRAL_DATABASE_CONNECTION_URI,
  config
)

export default sequelize
