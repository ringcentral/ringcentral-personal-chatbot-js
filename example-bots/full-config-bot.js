/**
 * this example bot would show full config
 */

// could load User class
// import { User } from 'ringcentral-personal-chatbot-js/dist/models/ringcentral'

exports.name = 'Bot name'

exports.description = 'Bot description'
exports.homepage = 'https://github.com/rc-personal-bot-framework/ringcentral-personal-chatbot-js/blob/master/example-bots/hello-bot-with-skills.js'

// handle post added event
exports.onPostAdd = async ({
  text, // original text
  textFiltered, // text without metion user
  group,
  user,
  handled, // hanlded by prev skills
  shouldUseSignature // should use signature like "send by bot skill xxx" in message.
}) => {
  let sign = shouldUseSignature
    ? ` [send by [${exports.name}](${exports.homepage})]`
    : ''
  await user.sendMessage(group.id, {
    text: textFiltered + sign
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
