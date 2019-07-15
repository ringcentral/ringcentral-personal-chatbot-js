/**
 * exmaple bot file
 * reply to hello with hi
 */

exports.name = 'Hello bot'

exports.description = 'Bot only respond to "Hello"'
exports.homepage = 'https://github.com/ringcentral/ringcentral-personal-chatbot-js/blob/master/example-bots/hello.js'

exports.onPostAdd = async ({
  text, // original text
  textFiltered, // text without metion user
  group,
  user,
  isPrivateChat,
  handled, // hanlded by prev skills
  shouldUseSignature // should use signature like "send by bot skill xxx" in message.
}) => {
  let sign = shouldUseSignature
    ? `\n<send by [${exports.name}](${exports.homepage})>`
    : ''
  if (textFiltered === 'hello') {
    await user.sendMessage(group.id, {
      text: 'Hi' + sign
    })
  }
}
