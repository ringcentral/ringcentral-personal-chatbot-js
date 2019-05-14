/**
 * exmaple bot file
 * reply to hello with hi
 */

exports.onPostAdd = async ({
  text, // original text
  textFiltered, // text without metion user
  group,
  user
}) => {
  if (textFiltered === 'hello') {
    await user.sendMessage(group.id, {
      text: 'Hi'
    })
  }
}
