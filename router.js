import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
global.__basedir = path.join(__dirname, '../../')

export default async (app, port = 3000) => {
    const methods = [
        'get', 'head', 'post', 'put', 'delete', 'connect', 'options', 'trace', 'patch'
    ]

    app.listen(port, async () => {
        console.log(`Server is running @ http://localhost:${port}`)
    })

    try {
        let items = await fs.readdir(`${__basedir}/routes`)
        let success = 0

        for (const item of items) {
            let stat = await fs.lstat(`${__basedir}/routes/${item}`)

            if (stat.isFile()) {
                let extension = item.split('.').filter(Boolean).splice(1).join('.').toLowerCase()
                let method = extension.split('.')[0]

                let methodName = `${method.toUpperCase()}`
                while (methodName.length < 7) {
                    methodName += ' '
                }
                
                if (methods.includes(method)) {
                    success++
                    let file = await import(`../../routes/${item}`)
                    let routes = file.routes || [ item.split('.')[0] ]
                    app[method](routes, async (req, res) => file.default(req, res))

                    console.log(`✅ ${methodName} - Loaded route ${item.split('.')[0]}`)
                } else {
                    console.log(`❌ ${methodName} - Unable to load route ${item.split('.')[0]}`)
                }
            }
        }
        console.log()
        console.log(`✅ (${success}/${items.length}) routes loaded successfully.`)
    } catch(err) {
        console.error(err)
    }
}