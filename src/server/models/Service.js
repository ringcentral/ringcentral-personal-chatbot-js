import Sequelize from 'sequelize'

import sequelize from './sequelize'

export const Service = sequelize.define('user', {
  id: { // Glip user ID
    type: Sequelize.STRING,
    primaryKey: true
  },
  name: { // glip user name
    type: Sequelize.STRING
  },
  email: { // Glip user email
    type: Sequelize.STRING
  },
  token: { // user token
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
  data: { // all other data associcated with this user
    type: Sequelize.JSON
  }
})
