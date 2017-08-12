<img align="right" width="320" height="568" src="https://files.lukaskollmer.me/embed/passcard-example.png">

# passcard [![npm](https://img.shields.io/npm/v/passcard.svg?style=flat-square)](https://www.npmjs.com/package/passcard)

> Create a Passbook/Wallet Business Card


## Install

```
$ npm install --global passcard
```

Apple requires all passes to be signed, meaning that you'll prepare a couple of things in order for `passcard` to work:
1) Register a custom [Pass Type ID](https://developer.apple.com/account/ios/identifier/passTypeId)
2) Create a [Pass Signing Certificate](https://developer.apple.com/account/ios/certificate)

> `passcard` includes the [`signpass`](https://developer.apple.com/download/more/?name=passbook) command line tool from apple

## Usage

```bash
passcard TEAM_ID PASS_TYPE_ID
```

You can AirDrop the generated pass to your iPhone

## Example

```bash
passcard A485NLSB8K pass.me.lukaskollmer.passcard
```

![](https://files.lukaskollmer.me/embed/passcard-cli.png?v=2)


## License

MIT © [Lukas Kollmer](https://lukaskollmer.me)
