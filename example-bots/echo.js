/**
 * exmaple bot file
 * echo any message, pretty annoying
 */

exports.name = 'echo bot'

exports.description = 'Bot will echo every message'
exports.homepage = 'https://github.com/ringcentral/ringcentral-personal-chatbot-js/blob/master/example-bots/echo.js'

exports.onPostAdd = async ({
  text, // original text
  textFiltered, // text without metion user
  group,
  isPrivateChat,
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
