/**
 * default handler
 */

/**
 * this example bot would show full config
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
  console.log('got text', text)
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
  // app.get('/some-route', (req, res) => res.end('some'))
}

// export skills
// check skill-examples/*.js for skill examples
/*
import skillA from 'skill-a'
import skillB from 'skill-b'
export const skills = [skillA, skillB]
*/

export const skills = []
