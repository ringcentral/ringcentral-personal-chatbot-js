/**
 * exmaple bot file
 * reply to hello with hi
 */

const skillServerTime = require('../example-skills/skill-time')
const skillPingpong = require('../example-skills/ping-pong')
const skillCalc = require('../example-skills/skill-simple-math')
const skillFake = require('../example-skills/fake-skill-with-setting-page')

exports.name = 'Hello bot'

exports.description = 'Bot only respond to "Hello"'
exports.skills = [skillServerTime, skillPingpong, skillCalc, skillFake]
exports.homepage = 'https://github.com/rc-personal-bot-framework/ringcentral-personal-chatbot-js/blob/master/example-bots/hello-bot-with-skills.js'

exports.onPostAdd = async ({
  text, // original text
  textFiltered, // text without metion user
  isPrivateChat,
  group,
  user,
  handled, // hanlded by prev skills
  shouldUseSignature // should use signature like "send by bot skill xxx" in message.
}) => {
  let sign = shouldUseSignature
    ? `\n(send by [${exports.name}](${exports.homepage}))`
    : ''
  console.log(text, textFiltered, group, user, handled, shouldUseSignature)
  if (textFiltered.toLowerCase() === 'hello') {
    await user.sendMessage(group.id, {
      text: 'Hi' + sign
    })
  }
}
