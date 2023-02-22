import {internet} from "./internet.js";
import {config, daemonizeParser} from "../core/parser.js";
import {saveCookies,loadCookies} from "./cookie.js";

export async function dashboard(){
    let url = config('ssl') ? `https://${config('url')}` : `http://${config('url')}`
    , resp = await internet.get(url,{
        headers:{
          "Access-Control-Expose-Headers": "Set-Cookie",
          'Access-Control-Allow-Origin' : "*",
          'Content-Type' : 'application/x-www-form-urlencoded',
          Cookie: loadCookies('login'),
      },
    })
    return resp.data;
}
