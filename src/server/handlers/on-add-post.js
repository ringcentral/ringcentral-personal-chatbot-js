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
  return `Hi, this is my AI assistant: **${cn}**, here to help with common questions and requests.
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
  const pausegUntil = user && user.data && user.data[`pauseUntil_${groupId}`] ? user.data[`pauseUntil_${groupId}`] : 0
  const regex = new RegExp(`!\\[:Person\\]\\(${user.id}\\)`)
  const textFiltered = text.replace(regex, ' ').replace(/^#me /, '').trim()
  if (
    pausegUntil && pausegUntil > now &&
    textFiltered !== 'resume'
  ) {
    return
  }
  const pauseReg = /^pause( +[0-9]+m)?$/
  const max = 60
  const defaultMin = 5
  if (textFiltered === '__test__' || textFiltered === '__help__') {
    await user.sendMessage(groupId, {
      text: buildBotInfo(conf)
    })
  } else if (textFiltered === 'resume') {
    let dt = {
      ...user.data
    }
    Object.keys(dt).forEach(k => {
      if (k.startsWith('pauseUntil')) {
        delete dt[k]
      }
    })
    dt.pauseUntil = 0
    await User.update({
      data: dt
    }, {
      where: {
        id: user.id
      }
    })
    await user.sendMessage(groupId, {
      text: `Bot resume`
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
    let up = {
      ...user.data
    }
    up[`pauseUntil_${groupId}`] = pauseUntil
    await User.update({
      data: up
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
