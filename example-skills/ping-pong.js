/**
 * exmaple bot skill file
 * reply pong to ping
 */

exports.name = 'ping pong bot skill'
exports.description = 'ping pong bot skill, reply with pong when got command "ping"'
exports.homepage = 'https://github.com/rc-personal-bot-framework/ringcentral-personal-chatbot-js/blob/master/example-skills/ping-pong.js'

exports.onPostAdd = async ({
  text, // original text
  textFiltered, // text without metion user
  group,
  user,
  handled, // hanlded by prev skills
  shouldUseSignature // should use signature like "send by bot skill xxx" in message.
}) => {
  if (textFiltered === 'ping') {
    let sign = shouldUseSignature
      ? `\n(send by [${exports.name}](${exports.homepage}))`
      : ''
    await user.sendMessage(group.id, {
      text: `pong${sign}`
    })
    return true
  } else {
    return false
  }
}
