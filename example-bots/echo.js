/**
 * exmaple bot file
 * echo any message, pretty annoying
 */

exports.onPostAdd = ({
  text, // original text
  textFiltered, // text without metion user
  group,
  user
}) => {
  user.sendMessage(group.id, {
    text: textFiltered
  })
}
