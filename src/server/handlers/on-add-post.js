/**
 * default parser for add post event
 */
import { User } from '../models/ringcentral'

function buildBotInfo (conf) {
  let skillsInfo = conf.skills.reduce((prev, s) => {
    let name = s.name || 'skill No name'
    name = s.homepage
      ? `[${name}](${s.homepage})`
      : name
    return prev + `* **${name}**: ${s.description || 'no description'}\n`
  }, '')
  let cn = conf.name
  cn = conf.homepage
    ? `[${cn}](${conf.homepage})`
    : cn
  return `This account is controlled by Bot: **${cn}** : ${conf.description}
${skillsInfo ? '**Skills:**\n' + skillsInfo : ''}`
}

export default async (message, conf) => {
  let { text } = message.body
  if (!text) {
    return // not a text message
  }
  const { ownerId } = message
  const { creatorId } = message.body
  const isTalkToSelf = ownerId === creatorId && text.startsWith('#me ')
  if (ownerId === creatorId && !isTalkToSelf) {
    return // bot should not talk to itself to avoid dead-loop conversation
  }
  const { groupId } = message.body
  const user = await User.findByPk(ownerId)
  const group = await user.getGroup(groupId)
  const isPrivateChat = group.members.length <= 2
  if (!isPrivateChat && !isTalkToSelf && (
    !message.body.mentions ||
    !message.body.mentions.some(m => m.type === 'Person' && m.id === ownerId)
  )) {
    // only respond to mentioned chat in group chat or private chat
    return
  }
  const now = Date.now()
  const pauseUntil = user && user.data && user.data.pauseUntil ? user.data.pauseUntil : 0
  if (pauseUntil && pauseUntil > now) {
    return
  }
  const regex = new RegExp(`!\\[:Person\\]\\(${user.id}\\)`)
  const textFiltered = text.replace(regex, ' ').replace(/^#me /, '').trim()
  const pauseReg = /^pause( +[0-9]+m)?$/
  const max = 60
  const defaultMin = 5
  if (textFiltered === '__test__' || textFiltered === '__help__') {
    await user.sendMessage(groupId, {
      text: buildBotInfo(conf)
    })
  } else if (textFiltered === 'resume') {
    await User.update({
      data: {
        ...user.data,
        pauseUntil: 0
      }
    })
  } else if (pauseReg.test(textFiltered)) {
    let t = textFiltered.match(pauseReg)[1]
    if (!t) {
      t = 5
    } else {
      t = parseInt(t.trim().replace(/m/, ''), 10)
    }
    if (t > max) {
      t = max
    } else if (!t) {
      t = defaultMin
    }
    let pauseUntil = t * 60 * 1000 + new Date().getTime()
    await User.update({
      data: {
        ...user.data,
        pauseUntil
      }
    }, {
      where: {
        id: user.id
      }
    })
    await user.sendMessage(groupId, {
      text: `Bot pause for ${t} minutes`
    })
  }

  return {
    text,
    textFiltered,
    isTalkToSelf,
    isPrivateChat,
    group,
    user,
    shouldUseSignature: conf.shouldUseSignature
  }
}
