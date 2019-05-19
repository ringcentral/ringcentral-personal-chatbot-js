/**
 * simple bot skillthat can solve simple math problem,
 * like `123 + 234` then give the result as response
 */

exports.name = 'Simple math skill'
exports.description = 'simple bot skill that can solve simple math problem, like `123 + 234` then give the result as response'
exports.homepage = 'https://github.com/rc-personal-bot-framework/ringcentral-personal-chatbot-js/blob/master/example-skills/skill-simple-math.js'

exports.onPostAdd = async ({
  text, // original text
  textFiltered, // text without metion user
  group,
  user,
  handled, // hanlded by prev skills
  shouldUseSignature // should use signature like "send by bot skill xxx" in message.
}) => {
  // eslint-disable-next-line
  let reg = /^ *[\d\.]+ *[*\-+/] *[\d\.]+$/
  if (reg.test(textFiltered)) {
    let res
    try {
      // eslint-disable-next-line
      res = eval(textFiltered)
    } catch (e) {
      console.log(`eval ${textFiltered} fails`)
    }
    if (res) {
      let sign = shouldUseSignature
        ? `\n(send by [${exports.name}](${exports.homepage}))`
        : ''
      await user.sendMessage(group.id, {
        text: `${textFiltered} = ${res}${sign}`
      })
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}
