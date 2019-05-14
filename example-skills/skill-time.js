/**
 * exmaple bot skill file
 * report server time
 */

export const onPostAdd = async ({
  text, // original text
  textFiltered, // text without metion user
  group,
  user,
  handled // hanlded by prev skills
}) => {
  if (textFiltered === 'server time') {
    await user.sendMessage(group.id, {
      text: `Server time: ${new Date().toString()}`
    })
    return true
  }
  return false
}

exports.name = 'server time bot skill'
exports.description = 'server time bot skill, reply with server time string when got command "server time"'
