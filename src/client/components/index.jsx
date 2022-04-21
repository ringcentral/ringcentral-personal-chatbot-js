import { Component } from 'react'
import { Button, List, Switch, Tag, Typography, Spin } from 'antd'
import fetch from '../store/fetch'
import {
  LinkOutlined,
  GithubFilled,
  HighlightOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import _ from 'lodash'

const { Text } = Typography
const { server } = window.rc

export default class App extends Component {
  state = {
    logined: false,
    user: {},
    botInfo: window.rc.botInfo,
    loading: false,
    switching: false,
    fetchingUser: false
  }

  componentDidMount () {
    window.particleBg && window.particleBg('#bg', {
      color: '#eee'
    })
    this.fetchUserInfo()
  }

  handleUpdateSigned = async (signed) => {
    this.setState({
      loading: true
    })
    const res = await fetch.post(window.rc.server + '/api/action', {
      action: 'bot-signature-switch',
      update: {
        signed
      }
    })
    const up = {
      loading: false
    }
    this.setState(old => {
      const r = up
      if (res) {
        r.user = {
          ...old.user,
          signed
        }
      }
      return r
    })
  }

  updateEnable = async (enabled) => {
    this.setState({
      switching: true
    })
    const res = await fetch.post(window.rc.server + '/api/action', {
      action: 'bot-switch',
      update: {
        enabled
      }
    })
    const up = {
      switching: false
    }
    this.setState(old => {
      const r = up
      if (res) {
        r.user = {
          ...old.user,
          enabled
        }
      }
      return r
    })
  }

  getUser = async () => {
    this.setState({
      fetchingUser: true
    })
    const res = await fetch.post(window.rc.server + '/api/action', {
      action: 'get-user'
    }, {
      handleErr: () => {
        console.log('fetch user error')
      }
    })
    const up = {
      fetchingUser: false
    }
    this.setState(old => {
      const r = up
      if (res) {
        r.user = res.result
        r.logined = !!res.result.id
      }
      return r
    })
  }

  handleReplyWithoutMentionInTeam = async (update) => {
    this.setState({
      loading: true
    })
    const res = await fetch.post(window.rc.server + '/api/action', {
      action: 'switch-reply-without-mention-in-team',
      update
    })
    const up = {
      loading: false
    }
    this.setState(old => {
      const r = up
      if (res) {
        r.user = {
          ...old.user,
          data: {
            ...old.user.data,
            replyWithoutMentionInTeam: update
          }
        }
      }
      return r
    })
  }

  fetchUserInfo = () => {
    this.getUser()
  }

  renderFooter () {
    return (
      <div className='mg3t pd1y'>
        <p>
          <a
            href='https://github.com/ringcentral/ringcentral-personal-chatbot-js/issues'
            target='_blank'
            rel='noreferrer'
          >
            <HighlightOutlined /> Feedback
          </a>
          <a
            className='mg1l'
            href='https://github.com/ringcentral/ringcentral-personal-chatbot-js'
            target='_blank'
            rel='noreferrer'
          >
            <GithubFilled /> GitHub repo
          </a>
          <a
            className='mg1l'
            href='https://www.ringcentral.com/apps'
            target='_blank'
            rel='noreferrer'
          >
            <LinkOutlined /> RingCentral App gallery
          </a>
        </p>
        <div className='pd1y'>
          <Text type='secondary'>
            <div>
              <img src='//raw.githubusercontent.com/ringcentral/ringcentral-embeddable/master/src/assets/rc/icon.svg' className='iblock mg1r' alt='' />
              <span className='iblock bold pd1y'>RingCentral Labs</span>
            </div>
            <p>RingCentral Labs is a program that lets RingCentral engineers, platform product managers and other employees share RingCentral apps they've created with the customer community. RingCentral Labs apps are free to use, but are not official products, and should be considered community projects - these apps are not officially tested or documented. For help on any RingCentral Labs app please consult each project's GitHub Issues message boards - RingCentral support is not available for these applications.</p>
          </Text>
        </div>
      </div>
    )
  }

  renderSkills (skills = this.state.botInfo.skills) {
    if (!skills.length) {
      return null
    }
    return (
      <div className='pd2y'>
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
                        ? <a href={item.homepage} title='Skill homepage' target='_blank' rel='noreferrer'><LinkOutlined /></a>
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
                          <a target='_blank' className='mg1l' href={server + item.settingPath} rel='noreferrer'>
                            <Button type='ghost'>Skill setting</Button>
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
      </div>
    )
  }

  renderTitle () {
    const { botInfo } = this.state
    return (
      <div>
        <div className='pd2b'>
          <h1>
            {botInfo.name}
            <sup className='mg1l'><Tag color='red'>Beta</Tag></sup>
          </h1>
          <p className='pd1b'>{botInfo.description}</p>
        </div>
        <ul>
          <li>
            Built-in commands:
            <b className='mg1l'>__help__(show bot info)</b>
          </li>
          <li>
            You can talk to self by post message starts with
            <b className='mg1l'>#me </b>
          </li>
          <li>
            You can pause the bot in current chatgroup for <b>10</b> minutes by sending message
            <b className='mg1l'>pause 10m</b> or <b className='mg1l'>pause</b>(5 minutes)
          </li>
          <li>
            * If bot stop working, you can try fix it by <b>turn off</b> and <b>turn it on</b> again
          </li>
        </ul>
      </div>
    )
  }

  renderSwitch () {
    const { enabled } = this.state.user
    const { switching } = this.state
    const turnOnUrl = window.rc.authUrlDefault.replace(window.rc.defaultState, 'user')
    if (enabled) {
      return (
        <Button
          type='danger'
          loading={switching}
          onClick={() => this.updateEnable(false)}
        >Turn off Bot
        </Button>
      )
    } else {
      return (
        <a href={turnOnUrl}>
          <Button
            type='primary'
            loading={switching}
          >Turn on Bot
          </Button>
        </a>
      )
    }
  }

  renderLogined () {
    const { loading, user = {} } = this.state
    const txt = 'Enabled bot message signature'
    const { enabled } = user
    const txt1 = enabled
      ? 'Bot is working now, you can close this page, bot will still work. You can stop the bot by come back and '
      : 'Bot is offline now, you can '
    const txt2 = 'Reply without mention in team'
    return (
      <div className='outer'>
        <div className='header alignright mg3b pd2x pd1y'>
          <a href={`${server}/logout`} className='iblock'>
            <LogoutOutlined /> logout
          </a>
        </div>
        <div className='wrap'>
          {this.renderTitle()}
          <p className='pd1y'>{txt1} {this.renderSwitch()}.</p>
          <div className='pd1b'>
            <Switch
              loading={loading}
              checked={user.signed}
              onChange={this.handleUpdateSigned}
              checkedChildren={txt}
              unCheckedChildren={txt}
            />
            <span className='mg1l'>When enabled, every message sent by bot has a "[sent by bot]" signature.</span>
          </div>
          <div className='pd1b'>
            <Switch
              loading={loading}
              checked={!!_.get(user, 'data.replyWithoutMentionInTeam')}
              onChange={this.handleReplyWithoutMentionInTeam}
              checkedChildren={txt2}
              unCheckedChildren={txt2}
            />
            <span className='mg1l'>When enabled, bot will trigger without mention in team chat.</span>
          </div>
          {this.renderSkills()}
          {this.renderFooter()}
        </div>
      </div>
    )
  }

  renderNotLogined () {
    const { fetchingUser } = this.state
    return (
      <div className='wrap'>
        {this.renderTitle()}
        <Spin spinning={fetchingUser}>
          <div className='pd1b pd1t'>
            <a href={window.rc.authUrlDefault}>
              <Button type='primary' size='large'>
                Login
              </Button>
            </a>
          </div>
        </Spin>
        <p className='pd1b'>After login, bot system will hook into your account, reply some message for you when any talk to you 😏.</p>
        {this.renderSkills()}
        {this.renderFooter()}
      </div>
    )
  }

  render () {
    const { logined } = this.state
    return logined
      ? this.renderLogined()
      : this.renderNotLogined()
  }
}
