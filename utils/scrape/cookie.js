import fs from "fs";
import {config} from '../core/parser.js';
const CookieHistory = [];
export function saveCookies(CookieNameAlias,CookieData,CookiePath='./storage/cookie.json'){
    CookieHistory.push({ 
      type: 'insert',
      date : new Date(),
      content: CookieData,
    })
    let oldCookieData = loadCookies('*');
    oldCookieData[CookieNameAlias] = CookieData;
    return fs.writeFileSync(CookiePath,JSON.stringify(oldCookieData));
}

export function loadCookies(CookieNameAlias='*', CookiePath='./storage/cookie.json'){
    
    let cookies = fs.readFileSync(CookiePath,'utf8')
    CookieHistory.push({ 
      type: 'reading',
      date : new Date(),
      content: cookies,
    })
    if(CookieNameAlias == '*'){
      return JSON.parse(cookies);
    }
    return JSON.parse(cookies)[CookieNameAlias] && cookieParser(JSON.parse(cookies)[CookieNameAlias]['cookies']);
}

export function cookieParser(cookies){
  return cookies.map(cookie => {
    return `${cookie.key}=${cookie.value}; path=${cookie.path}`
  }).join(' ')
}

export function cookieDriver(){
  let data = CookieHistory
  return {
    get: () => {
       return data.map((e,i) => {
         return `\nno ${i+1}\nDate : ${e.date},\n Content : ${e.content};\nType : ${e.type}`
       }).join('')
    }
  }

}
