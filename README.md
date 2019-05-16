# ringcentral-personal-chatbot-js <!-- omit in toc -->

RingCentral personal chatbot framework.

- [Quick start](#quick-start)
- [Build and run in production](#build-and-run-in-production)
- [Use as CLI tool](#use-as-cli-tool)
- [Write a personal bot](#write-a-personal-bot)
- [Write/use a personal bot skill](#writeuse-a-personal-bot-skill)
- [Origin](#origin)
- [Credits](#credits)
- [License](#license)

## Quick start

Let's start a simple chatbot server and login to it with you sandbox glip account, and you account will auto respond to `hello` with `Hi`(any private message or message mentioned you).

```bash
# get the code
git clone git@github.com:rc-personal-bot-framework/ringcentral-personal-chatbot-js.git
cd ringcentral-personal-chatbot-js

# install dependecies
npm i

# start proxy server, this will make your local bot server can be accessed by RingCentral service
npm run ngrok

# will show
Forwarding                    https://xxxx.ap.ngrok.io -> localhost:6066
# Remember the https://xxxx.ap.ngrok.io, we will use it later
```

Login to [developer.ringcentral.com](https://developer.ringcentral.com/) and create Web-based App:

- Application Type: Public
- Platform Type: Browser-based
- Carrier: accept the default values
- Permissions Needed: Accounts, Contacts, Glip, Glip Internal, Read Accounts, Read Client Info, Read Contacts, Read Presence, Webhook Subscriptions
- Set OAuth Redirect URI: Using your ngrok HTTPS URL from above, enter in the following value: `https://xxxx.ap.ngrok.io/rc/oauth`.

<a href="https://developer.ringcentral.com/new-app?name=Sample+Personal+Bot+App&desc=A+sample+app+created+in+conjunction+with+the+ringcentral+personal+bot+framework&public=true&type=BrowserBased&carriers=7710,7310,3420&permissions=Accounts,Contacts,Glip,GlipInternal,ReadAccounts,ReadClientInfo,ReadContacts,ReadPresence,WebhookSubscriptions&redirectUri=" target="_blank">Click to create app</a>

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
node -r dotenv/config bin/rcpf.js example-bots/hello.js

# proxy for production code
npm run ngrok-p
```

## Use as CLI tool

I will as simple as this:

```bash
npx ringcentral-personal-chatbot your-bot-file.js

# check example-bots folders for bot examples, it is quite simple, you could just write your own.
```

## Write a personal bot

[docs/write-a-bot.md](docs/write-a-bot.md)

## Write/use a personal bot skill

[docs/write-use-a-skill.md](docs/write-use-a-skill.md)

## Origin

It is a project for RingCentral Xiamen Office 2019 Hackathon. It begin with [Jakob Lewei](https://github.com/orgs/rc-personal-bot-framework/people/jakob-lewei)'s idea about fuzzy matching FAQ bot, then I decided to make it more generic: a bot frame work for personal glip account.

## Credits

It is based on the these projects, especially [Tyler](https://github.com/tylerlong)'s work.

- [Tyler](https://github.com/tylerlong)'s [RingCentral chatbot js](https://github.com/ringcentral/ringcentral-chatbot-js)
- [RingCentral chatbot python](https://github.com/zxdong262/ringcentral-chatbot-python).
- [https://github.com/zxdong262/ringcentral-chatbot-voicemail-helper](https://github.com/zxdong262/ringcentral-chatbot-voicemail-helper)

## License

MIT
