/**
 * this skill has setting page and do nothing
 */

exports.onPostAdd = async ({
  text, // original text
  textFiltered, // text without metion user
  group,
  user,
  handled // hanlded by prev skills
}) => {
  return false
}

// extends express app as you need
export const appExtend = (app) => {
  app.get('/skill/fake-setting', (req, res) => res.end('Fake setting page'))
}

exports.name = 'fake skill'
exports.description = 'this skill has a setting page and do nothing'
exports.homepage = ''

// only if you have setting page
exports.settingPath = '/skill/fake-setting'
