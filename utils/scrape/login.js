import {internet} from "./internet.js";
import {config, daemonizeParser} from "../core/parser.js";
import {html} from "../core/html.js";
import {input} from "../core/input.js";
import {saveCookies,loadCookies} from "./cookie.js";
import {dashboard} from "./dashboard.js";
import {handler} from "./handler.js";

export async function loginMenu(data){
    
    console.log('====================')
    console.log('Name,',data['name'])
    console.log('Username, ',config('username'))
    let menuLoginContent = [
        'lihat semua kursus (cache)',
        'lihat semua kursus (reset)',
        'Info Course',
        'Download Link dari LMS.UNHI'
    ]
    
    menuLoginContent = menuLoginContent.map((e,i)=> {
        return `${i+1}. ${e}`
    })
    console.log(menuLoginContent.join('\n'))
    let option = await input('Pilih :')

    // option 
    await handler(option,data)
}

export async function login(){
    let userData = daemonizeParser()
    , ssl = config('ssl')
    , http = ssl ? 'https://' : 'http://'
    , url_login = `${http}/${config('url_login')}`
    , skip_login = false
    userData.logintoken = await getToken(url_login)
    const info = {};
    if(loadCookies('login')){
        skip_login = true;
        info['session'] = 'Cookie (login) has found skip login...'
    }
    if(userData.logintoken != undefined || !skip_login){
        try{
          let resp = await internet({
              url : url_login,
              method : 'post',
              headers : {
                  "Access-Control-Expose-Headers": "Set-Cookie",
                  'Access-Control-Allow-Origin' : "*",
                  'Content-Type' : 'application/x-www-form-urlencoded',
                  Cookie: loadCookies('dummy-cookie'),
              },
              maxRedirects: 0,
              data : {
                  username : userData.username,
                  password : userData.password,
                  logintoken : userData.logintoken,
                  anchor : ""
              },
             withCredentials: true,
          });
        } catch(response){
          saveCookies('login',response.config.jar)
        }
        
        // try enter dashboard 
        let dashboardData = await dashboard()
        let $ = html.load(dashboardData)

        // error 
        if($('span.usertext').text() == ''){
            info['error'] ='Login Failed....\n'
            +'\nSee your daemonize.json'
            +'\nMay be password or username wrong'
            return info
        }
        info['name'] = $('span.usertext').text()
        return info 
    }
}

async function getToken(url_login){
    let res = await internet.get(url_login,{ withCredentials: true })
    , HtmlData = res.data 
    , $ = html.load(HtmlData)
    , logintoken = $('input[name=logintoken]').val();
    let cookie = res.config.jar
    //.split('Cookie=')
    saveCookies('dummy-cookie',cookie);
    return logintoken;
}
