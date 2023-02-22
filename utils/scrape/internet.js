import axios from "axios"
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import {loadCookies} from "./cookie.js";

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));
client.defaults.withCredentials = true
export const internet = client
export async function standardGet(url){
    let resp = await client.get(url,{
        headers:{
          "Access-Control-Expose-Headers": "Set-Cookie",
          'Access-Control-Allow-Origin' : "*",
          'Content-Type' : 'application/x-www-form-urlencoded',
          Cookie: loadCookies('login'),
        }
    })
    return resp.data;
}
