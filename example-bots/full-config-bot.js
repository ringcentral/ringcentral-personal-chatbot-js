/**
 * this example bot would show full config
 */

// could load User class
// import { User } from 'ringcentral-personal-chatbot-js/dist/models/ringcentral'

// handle post added event
exports.onPostAdd = ({
  text, // original text
  textFiltered, // text without metion user
  group,
  user
}) => {
  user.sendMessage(group.id, {
    text: textFiltered
  })
}

// handle all events except post added event
exports.onEvent = ({
  eventType, // == message.body.eventType
  message, // original event message
  user // user instance
}) => {
  console.log(message)
}

// extends express app as you need
exports.appExtend = (app) => {
  app.get('/some-route', (req, res) => res.end('some'))
}

// export skills
// check skill-examples/*.js for skill examples
/*
const skillA = require('skill-a')
const skillB = require('skill-b')
exports.skills = [skillA, skillB]
*/

exports.skills = []
