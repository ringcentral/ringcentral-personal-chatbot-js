/**
 * this example bot skill would show full config
 */

// could load User class
// import { User } from 'ringcentral-personal-chatbot-js/dist/models/ringcentral'

// handle post added event
export const onPostAdd = ({
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
export const onEvent = ({
  eventType, // == message.body.eventType
  message, // original event message
  user // user instance
}) => {
  console.log(message)
}

// extends express app as you need
export const appExtend = (app) => {
  app.get('/some-route', (req, res) => res.end('some'))
}
