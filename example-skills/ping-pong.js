/**
 * exmaple bot skill file
 * reply pong to ping
 */

export const onPostAdd = async ({
  text, // original text
  textFiltered, // text without metion user
  group,
  user,
  handled // hanlded by prev skills
}) => {
  if (textFiltered === 'ping') {
    await user.sendMessage(group.id, {
      text: `pong`
    })
    return true
  } else {
    return false
  }
}

exports.name = 'ping pong bot skill'
exports.description = 'ping pong bot skill, reply with pong when got command "ping"'
