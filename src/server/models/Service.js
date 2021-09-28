import Sequelize from 'sequelize'
import { generate } from 'shortid'
import sequelize from './sequelize'

export const Service = sequelize.define('user', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    defaultValue: generate
  },
  name: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  token: {
    type: Sequelize.JSON
  },
  enabled: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  signed: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  privateChatOnly: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  lastUseTime: {
    type: Sequelize.INTEGER
  },
  tokenUpdateTime: {
    type: Sequelize.INTEGER
  },
  data: { // all other data associcated with this user
    type: Sequelize.JSON
  }
})
