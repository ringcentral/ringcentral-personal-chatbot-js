import { Component } from 'react-subx'
import { Button, List, Switch, Tag, Icon } from 'antd'
import logo from '../images/rc128.png'

export default class App extends Component {
  componentDidMount () {
    window.particleBg('#bg', {
      color: '#eee'
    })
  }

  renderFooter () {
    return (
      <div className='mg3t pd1y'>
        Powered by
        <a href='https://github.com/rc-personal-bot-framework/ringcentral-personal-chatbot-js' target='_blank' className='mg1x'>ringcentral-personal-chatbot</a>
        and
        <a href='https://github.com/tylerlong/subx' target='_blank' className='mg1x'>Subx</a>
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
        header={<div>Loaded Skills</div>}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={
                <span>
                  {
                    item.homepage
                      ? <a href={item.homepage} title='Skill homepage' target='_blank'><Icon type='home' /></a>
                      : null
                  }
                  <b className='mg1l'>{item.name}</b>
                </span>

              }
              description={
                <div>
                  {item.description}
                  {
                    item.settingPath
                      ? (
                        <a target='_blank' className='mg1l' href={item.settingPath}>
                          <Button type='ghost' icon='setting'>Skill setting</Button>
                        </a>
                      )
                      : null
                  }
                </div>
              }
            />
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
      <div className='bot-info mg2b mg3t'>
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

  renderTitle () {
    return (
      <div>
        <div className='pd2b'>
          <img
            className='iblock'
            src={window.rc.server + logo}
          />
        </div>
        <h1>
          RingCentral personal bot system
          <sup className='mg1l'><Tag color='red'>Beta</Tag></sup>
        </h1>
      </div>
    )
  }

  renderSwitch() {
    let { enabled } = this.props.store.user
    let { swithing, updateEnable } = this.props.store
    if (enabled) {
      return (
        <Button
          type='danger'
          icon='disconnect'
          loading={swithing}
          onClick={() => updateEnable(false)}
        >Turn off Bot</Button>
      )
    } else {
      return (
        <a href={window.rc.authUrl}>
          <Button
            type='primary'
            icon='check'
            loading={swithing}
          >Turn on Bot</Button>
        </a>
      )
    }
  }

  renderLogined () {
    let { loading, user = {}, updateSigned } = this.props.store
    let txt = 'Enabled bot message signature'
    let { enabled } = user
    let txt1 = enabled
      ? 'Bot is working now, you can close this page, bot will still work. You can stop the bot by come back and '
      : 'Bot is offline now, you can '
    return (
      <div className='outer'>
        <div className='header alignright mg3b pd2x pd1y'>
          <a href='/logout' className='iblock'>
            <Icon type='logout' /> logout
          </a>
        </div>
        <div className='aligncenter wrap'>
          {this.renderTitle()}
          <p className='pd1y'>{txt1} {this.renderSwitch()}.</p>
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
          {this.renderFooter()}
        </div>
      </div>
    )
  }

  renderNotLogined () {
    return (
      <div className='aligncenter wrap'>
        {this.renderTitle()}
        <p className='pd1b pd1t'>
          <a href={window.rc.authUrl}>
            <Button icon='login' type='primary' size='large'>
              Login
            </Button>
          </a>
        </p>
        <p className='pd1b'>After login, bot system will hook into your account, reply some message for you 😏.</p>
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
