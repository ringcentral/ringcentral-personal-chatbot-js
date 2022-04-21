# ringcentral-personal-chatbot-js <!-- omit in toc -->

RingCentral personal chatbot framework.

![ ](https://github.com/rc-personal-bot-framework/ringcentral-personal-chatbot-skill-faq/raw/master/screenshots/s1.png)

- [Quick start](#quick-start)
- [Build and run in production](#build-and-run-in-production)
- [Token renew](#token-renew)
- [Use as CLI tool](#use-as-cli-tool)
- [Write a personal bot](#write-a-personal-bot)
- [Write/use a personal bot skill](#writeuse-a-personal-bot-skill)
- [Build-in commands](#build-in-commands)
- [Origin](#origin)
- [Credits](#credits)
- [License](#license)

## Quick start

First, need create a AWS account, we will use free local AWS dynamodb, and put your aws credentials in `~/.aws/credentials`, check [https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)

Let's start a simple chatbot server and login to it with you sandbox glip account, and you account will auto respond to `hello` with `Hi`(any private message or message mentioned you).

```bash
# get the code
git clone git@github.com:ringcentral/ringcentral-personal-chatbot-js.git
cd ringcentral-personal-chatbot-js

# install dependecies
npm i

# start proxy server, this will make your local bot server can be accessed by RingCentral service
npm run ngrok

# will show
Forwarding                    https://xxxx.ap.ngrok.io -> localhost:6066
# Remember the https://xxxx.ap.ngrok.io, we will use it later

# start local dynamodb
npm run dynamo
```

Login to [developer.ringcentral.com](https://developer.ringcentral.com/) and create REST API App:

- Application Type: Public
- Platform Type: Browser-based
- Carrier: accept the default values
- Permissions Needed: Accounts, Team messaging, Read Accounts, Webhook Subscriptions
- Set OAuth Redirect URI: Using your ngrok HTTPS URL from above, enter in the following value: `https://xxxx.ap.ngrok.io/rc/oauth`.

```bash
cp .env.sample .env
# then fill all required fields in .env, you can get client ID / secret from app setting

# run sample hello bot
npm start

# start client dev server
npm run c

```

Then visit [https://xxxx.ap.ngrok.io](https://xxxx.ap.ngrok.io) to login, after auth, when someone talk to you with "hello"(any private message or message mentioned you), you will auto respond with "Hi".

## Build and run in production

```bash
# build
npm run build

# run prodcution code
npm run p
# or
cross-env NODE_ENV=production node bin/rcpf.js example-bots/hello.js

# proxy for production code
npm run ngrok-p
```

## Token renew

todo

## Use as CLI tool

I will as simple as this:

```bash
npx ringcentral-personal-chatbot your-bot-file.js
```

- Check example-bots folders for bot examples, it is quite simple, you could just write your own.
- Check [ringcentral-personal-bot-template-js](https://github.com/rc-personal-bot-framework/ringcentral-personal-bot-template-js) as a realworld example which uses [ringcentral-personal-chatbot-skill-faq](https://github.com/rc-personal-bot-framework/ringcentral-personal-chatbot-skill-faq) and [ringcentral-personal-bot-skill-pack-simple](https://github.com/rc-personal-bot-framework/ringcentral-personal-bot-skill-pack-simple), it only need [28 lines code](https://github.com/rc-personal-bot-framework/ringcentral-personal-bot-template-js/blob/master/src/server/index.js).

## Write a personal bot

[docs/write-a-bot.md](docs/write-a-bot.md)

## Write/use a personal bot skill

[docs/write-use-a-skill.md](docs/write-use-a-skill.md)

## Build-in commands

- `__test__`: show bot info.

## Origin

It is a project for RingCentral Xiamen Office 2019 Hackathon. It begin with [Jakob Lewei](https://github.com/orgs/rc-personal-bot-framework/people/jakob-lewei)'s idea about fuzzy matching FAQ bot, then I decided to make it more generic: a bot framework for personal glip account.

## Credits

It is based on the these projects, especially [Tyler](https://github.com/tylerlong)'s work.

- [Tyler](https://github.com/tylerlong)'s [RingCentral chatbot js](https://github.com/ringcentral/ringcentral-chatbot-js)
- [RingCentral chatbot python](https://github.com/zxdong262/ringcentral-chatbot-python).
- [https://github.com/zxdong262/ringcentral-chatbot-voicemail-helper](https://github.com/zxdong262/ringcentral-chatbot-voicemail-helper)

## License

MIT
