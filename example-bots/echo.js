/**
 * exmaple bot file
 * echo any message, pretty annoying
 */

exports.onPostAdd = async ({
  text, // original text
  textFiltered, // text without metion user
  group,
  user,
  handled // hanlded by prev skills
}) => {
  await user.sendMessage(group.id, {
    text: textFiltered
  })
}

exports.name = 'echo bot'

exports.description = 'Bot will echo every message'
