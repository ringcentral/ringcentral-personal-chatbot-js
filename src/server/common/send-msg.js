export async function sendMsg (bot, group, userId, text, mention = true) {
  const pre = mention ? `![:Person](${userId}) ` : ''
  await bot.sendMessage(group.id, {
    text: `${pre}${text}`
  })
}

async function openChat (user) {
  const data = {
    members: [
      {
        id: user.id
      }
    ]
  }
  const rc = await user.rc()
  return rc.post('/restapi/v1.0/glip/conversations', data)
    .then(r => r.data)
    .catch(e => {
      console.log('open chat error', e)
    })
}

export async function sendPrivateMsg (user, text) {
  const chat = await openChat(user)
  await user.sendMessage(chat.id, {
    text: `![:Person](${user.id}) ${text}`
  }).catch(e => {
    console.log('user self chat error', e)
  })
}
