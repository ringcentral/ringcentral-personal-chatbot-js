import SubX from 'subx'
import fetch from './fetch'

const store = SubX.create({
  logined: false,
  user: {},
  botInfo: window.rc.botInfo,
  loading: false,
  swithing: false,
  fetchingUser: false,
  async updateSigned (signed) {
    store.loading = true
    let res = await fetch.post(window.rc.server + '/api/action', {
      action: 'bot-signature-switch',
      update: {
        signed
      }
    })
    store.loading = false
    if (res) {
      store.user.signed = signed
    }
  },
  async updateEnable (enabled) {
    store.swithing = true
    let res = await fetch.post(window.rc.server + '/api/action', {
      action: 'bot-switch',
      update: {
        enabled
      }
    })
    store.swithing = false
    if (res) {
      store.user.enabled = enabled
    }
  },
  async getUser () {
    store.fetchingUser = true
    let res = await fetch.post(window.rc.server + '/api/action', {
      action: 'get-user'
    }, {
      handleErr: () => {
        console.log('fetch user error')
      }
    })
    store.fetchingUser = false
    if (res) {
      store.user = res.result
      store.logined = !!res.result.id
    }
  }
})

export default store
