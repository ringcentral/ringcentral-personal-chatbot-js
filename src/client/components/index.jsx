import { Component } from 'react-subx'
import { Button, List, Switch } from 'antd'
import logo from '../images/rc128.png'

export default class App extends Component {
  renderFooter () {
    return (
      <div className='bordert mg3t pd1y'>
        About this project: <a href='https://github.com/rc-personal-bot-framework/glip-personal-bot-framework'>github repo</a>
      </div>
    )
  }

  renderSkills (skills) {
    if (!skills.length) {
      return null
    }
    return (
      <List
        dataSource={skills}
        bordered
        header={<div>Skills</div>}
        renderItem={item => (
          <List.Item>
            {
              item.homepage
                ? <a href={item.homepage} title='Skill homepage' target='_blank'>{item.name}: </a>
                : <b>{item.name}: </b>
            }
            <span className='mg1l'>{item.description}</span>
            {
              item.settingPath
                ? (
                  <a target='_blank' className='mg1l fright' href={item.settingPath}>
                    <Button type='primary' icon='setting'>Skill setting</Button>
                  </a>
                )
                : null
            }
          </List.Item>
        )}
      />
    )
  }

  renderBotInfo () {
    let { botInfo } = this.props.store
    if (!botInfo) {
      return null
    }
    return (
      <div className='bot-info mg2b'>
        <h2>
          {botInfo.name}
        </h2>
        <p className='pd1b'>{botInfo.description}</p>
        {
          this.renderSkills(botInfo.skills)
        }
      </div>
    )
  }

  renderLogined () {
    let { loading, user, updateSigned } = this.props.store
    let txt = 'Enabled bot message signature'
    return (
      <div className='aligncenter wrap'>
        <div className='pd2b'>
          <img
            className='iblock'
            src={logo}
          />
        </div>
        <h1>Ringcentral personal bot system</h1>
        <p className='pd1y'>Bot is working now, you can close this page, bot will still work. You can stop the bot by come back and logout.</p>
        <div className='pd1b'>
          <Switch
            loading={loading}
            checked={user.signed}
            onChange={updateSigned}
            checkedChildren={txt}
            unCheckedChildren={txt}
          />
          <span className='mg1l'>When enabled, every message send by bot has a "[send by bot]" signature.</span>
        </div>
        {this.renderBotInfo()}
        <a href='/logout'>
          <Button icon='logout'>
            logout
          </Button>
        </a>
        <p>Only after logout, bot will stop working</p>
        {this.renderFooter()}
      </div>
    )
  }

  renderNotLogined () {
    return (
      <div className='aligncenter wrap'>
        <div className='pd2b'>
          <img
            className='iblock'
            src={logo}
          />
        </div>
        <h1>Ringcentral personal bot system</h1>
        <p className='pd2b pd1t'>
          <a href={window.rc.authUrl}>
            <Button icon='login' type='primary' size='large'>
              Login
            </Button>
          </a>
        </p>
        {this.renderBotInfo()}
        {this.renderFooter()}
      </div>
    )
  }

  render () {
    let { logined } = this.props.store
    return logined
      ? this.renderLogined()
      : this.renderNotLogined()
  }
}
