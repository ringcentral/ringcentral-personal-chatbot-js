/**
 * exmaple bot skill file
 * echo any message, pretty annoying
 */

export const onPostAdd = ({
  text, // original text
  textFiltered, // text without metion user
  group,
  user
}) => {
  user.sendMessage(group.id, {
    text: new Date().toString()
  })
}
