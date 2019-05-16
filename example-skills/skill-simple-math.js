/**
 * simple bot skillthat can solve simple math problem,
 * like `123 + 234` then give the result as response
 */

exports.onPostAdd = async ({
  text, // original text
  textFiltered, // text without metion user
  group,
  user,
  handled // hanlded by prev skills
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
      await user.sendMessage(group.id, {
        text: `${textFiltered} = ${res}`
      })
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

exports.name = 'Simple math skill'
exports.description = 'simple bot skill that can solve simple math problem, like `123 + 234` then give the result as response'
