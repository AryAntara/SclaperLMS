import fs from 'fs'

export function daemonizeParser(daemonizePath = './daemonize.json'){
    return JSON.parse(fs.readFileSync(daemonizePath,'utf8'))
}

export function config(fieldName,configPath = './config.json'){
    let data = JSON.parse(fs.readFileSync(configPath,'utf8'))
    return fieldName ? data[fieldName] : data;
}
