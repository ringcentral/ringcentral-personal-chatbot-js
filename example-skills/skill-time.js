/**
 * exmaple bot skill file
 * report server time
 */

exports.name = 'server time bot skill'
exports.description = 'server time bot skill, reply with server time string when got command "server time"'
exports.homepage = 'https://github.com/rc-personal-bot-framework/ringcentral-personal-chatbot-js/blob/master/example-skills/skill-time.js'

exports.onPostAdd = async ({
  text, // original text
  textFiltered, // text without metion user
  group,
  user,
  isPrivateChat,
  handled, // hanlded by prev skills
  shouldUseSignature // should use signature like "send by bot skill xxx" in message.
}) => {
  if (textFiltered === 'server time') {
    let sign = shouldUseSignature
      ? `\n(send by [${exports.name}](${exports.homepage}))`
      : ''
    await user.sendMessage(group.id, {
      text: `Server time: ${new Date().toString()}${sign}`
    })
    return true
  }
  return false
}
