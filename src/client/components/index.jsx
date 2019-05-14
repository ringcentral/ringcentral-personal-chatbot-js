import { Component } from 'react-subx'
import { Button } from 'antd'
import logo from '../images/rc128.png'

export default class App extends Component {
  renderLogined () {
    return (
      <div className='aligncenter wrap'>
        <div className='pd2b'>
          <img
            className='iblock'
            src={logo}
          />
        </div>
        <h1>Ringcentral personal bot system</h1>
        <div className='pd1b'>
          Bot running, you can post message with "__test__" to verify.
        </div>
        <a href='/logout'>
          <Button icon='logout'>
            logout
          </Button>
        </a>
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
        <a href={window.rc.authUrl}>
          <Button icon='login'>
            login
          </Button>
        </a>
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
