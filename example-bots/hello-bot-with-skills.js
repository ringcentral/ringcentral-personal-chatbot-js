/**
 * exmaple bot file
 * reply to hello with hi
 */

const skillServerTime = require('../example-skills/skill-time')
const skillPingpong = require('../example-skills/ping-pong')
const skillCalc = require('../example-skills/skill-simple-math')
const skillFake = require('../example-skills/fake-skill-with-setting-page')

exports.onPostAdd = async ({
  text, // original text
  textFiltered, // text without metion user
  group,
  user,
  handled // hanlded by prev skills
}) => {
  console.log(text, textFiltered, group, user, handled)
  if (textFiltered === 'Hello') {
    await user.sendMessage(group.id, {
      text: 'Hi'
    })
  }
}

exports.name = 'Hello bot'

exports.description = 'Bot only respond to "Hello"'
exports.skills = [skillServerTime, skillPingpong, skillCalc, skillFake]
