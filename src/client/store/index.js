import SubX from 'subx'
import fetch from './fetch'

const store = SubX.create({
  logined: !!window.rc.user,
  user: window.rc.user,
  botInfo: window.rc.botInfo,
  loading: false,
  async updateSigned (signed) {
    store.loading = true
    let res = await fetch.post('/api/action', {
      action: 'bot-signature-switch',
      update: {
        signed
      }
    })
    store.loading = false
    if (res) {
      store.user.signed = signed
    }
  }
})

export default store
