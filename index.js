const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const execa = require('execa')
const prompt = require('prompt')
const uuid = require('uuid/v4')
const request = require('request')
const jimp = require('jimp')

const pass = require('./pass.json')

console.log(
`
We'll ask you for some information about you. You can skip any entry simply by pressing enter.

Required fields:
  - Name
  - Twitter (your avatar will appear on the pass)

Optional fields:
- Title
  - Email
  - Website
  - GitHub
`
)

prompt.message = 'passcard'

prompt.start()

let fields = [
  // required
  'Name',
  'Twitter',

  // optional
  'Email',
  'Website',
  'GitHub',
  'Title'
]

prompt.get(fields, (err, result) => {
	let dir = path.join(__dirname, 'card.pass')
  rimraf.sync(dir)
	fs.mkdirSync(dir)

  const fieldExists = key => result[key] !== ''

  let name = result['Name']

  pass['serialNumber'] = uuid()
  pass['logoText']    = name
  pass['description'] = name

  pass['generic']['primaryFields'] = [{ key: "name", value: name }]


  if (fieldExists('Title')) {
    pass['generic']['secondaryFields'] = [{ key: "title", label: "TWITTER", value: result['Twitter'] }]
  } else {
    delete pass['generic'].secondaryFields
  }

  let auxiliaryFields = []
  let backFields = []

  const pushField = (key, ...dest) => {
    let field = {
      key: key.toLowerCase(),
      label: key.toUpperCase(),
      value: result[key]
    }
    for (d of dest) {
      d.push(field)
    }
  }

  const pushFields = (fields, dest) => {
    fields.forEach(field => {
      if (fieldExists(field)) {
        pushField(field, dest)
      }
    })
  }

  pushFields(['Email', 'Title'], auxiliaryFields)
  pushFields(fields, backFields)


  pass['generic']['auxiliaryFields'] = auxiliaryFields
  pass['generic']['backFields'] = backFields


  if (fieldExists('Website')) {
    pass['barcodes'][0] = {
      message: result['Website'],
      altText: result['Website'],
      format: "PKBarcodeFormatQR",
      messageEncoding: "utf-8",
    }
  } else {
    pass['barcodes'] = []
  }

  let twitter = result['Twitter'].replace('@', '')

  let options = {
  	url: `https://twitter.com/${twitter}/profile_image?size=original`,
  	encoding: null // This forces a Buffer
  }

  request(options, (err, res, body) => {
  	(async () => {
  		let avatar = await jimp.read(body)

  		avatar
  			.write(path.join(dir, 'thumbnail@2x.png'))
  			.scale(0.5)
  			.write(path.join(dir, 'thumbnail.png'))
  			.resize(58, 58)
  			.write(path.join(dir, 'icon@2x.png'))
  			.write(path.join(dir, 'logo@2x.png'))
  			.resize(29, 29)
  			.write(path.join(dir, 'icon.png'))
  			.write(path.join(dir, 'logo.png'))

  		fs.writeFileSync(path.join(dir, 'pass.json'), JSON.stringify(pass, null, 2) , 'utf-8')

  		setTimeout(() => {
  			(async () => {
  				await execa('./signpass', ['-p', dir])
  				console.log(`DONE. Your pass is available at ${dir}`)
  				rimraf.sync(dir)
  			})()
			}, 500)
  	})()
  })
})
