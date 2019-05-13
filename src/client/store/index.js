import SubX from 'subx'

const store = SubX.create({
  logined: !!window.rc.user,
  user: window.rc.user
})

export default store
