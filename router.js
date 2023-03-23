import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
global.__basedir = path.join(__dirname, '../../')

const readDirectory = async (directory, parent) => {
    try {
        let route = `${parent}/${directory}`
        let success = 0
        let items = await fs.readdir(route)
        const methods = [ 'get', 'head', 'post', 'put', 'delete', 'connect', 'options', 'trace', 'patch' ]

        for (const item of items) {
            let stat = await fs.lstat(`${route}/${item}`)

            if (stat.isDirectory()) readDirectory(item, route)
            if (stat.isFile()) {
                let extension = item.split('.').filter(Boolean).splice(1).join('.').toLowerCase()
                let method = extension.split('.')[0]

                let methodName = `${method.toUpperCase()}`
                while (methodName.length < 7) {
                    methodName += ' '
                }
                
                if (methods.includes(method)) {
                    success++
                    let file = await import(`../../routes/${path.join(route, item).split('routes\\')[1]}`)
                    let routes = file.routes || [ item.split('.')[0] ]
                    app[method](routes, async (req, res) => file.default(req, res))

                    console.log(`✅ ${methodName} - Loaded route ${item.split('.')[0]}`)
                } else {
                    console.log(`❌ ${methodName} - Unable to load route ${item.split('.')[0]}`)
                }
            }
        }
    } catch(err) {
        console.error(err)
    }
}

export default async (app, port = 3000) => {
    global.app = app
    app.listen(port, async () => console.log(`Server is running @ http://localhost:${port}`))
    readDirectory(``, `${__basedir}/routes`)
}