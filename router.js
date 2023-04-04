module.exports = async (app, port = 3000) => {
    const path = await import('path')
    const { fileURLToPath } = await import('url')
    const fs = await import('fs/promises')

    global.__basedir = path.join(__dirname, '../../')

    const readDirectory = async (directory, parent) => {
        try {
            let route = `${parent}/${directory}`
            let success = 0
            let error = false
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
                        if (file) {
                            if (file.routes && file.register) {
                                let routes = file.routes || [ `/${item.split('.')[0]}` ]
                                app[method](routes, async (req, res) => file.register(req, res))
                            } else error = true
                        } else error = true
                    } else error = true

                    if (error) console.log(`❌ ${methodName} - Unable to load route ${item}`)
                    else console.log(`✅ ${methodName} - Loaded route ${item}`)
                }
            }
        } catch(err) {
            console.error(err)
        }
    }
    (async () => {
        global.app = app
        app.listen(port)
        readDirectory(``, `${__basedir}/routes`)
    })()
}