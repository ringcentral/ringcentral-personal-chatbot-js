/**
 * exmaple bot file
 * reply to hello with hi
 */

exports.onPostAdd = async ({
  text, // original text
  textFiltered, // text without metion user
  group,
  user,
  handled // hanlded by prev skills
}) => {
  if (textFiltered === 'hello') {
    await user.sendMessage(group.id, {
      text: 'Hi'
    })
  }
}

exports.name = 'Hello bot'

exports.description = 'Bot only respond to "Hello"'