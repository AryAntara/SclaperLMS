import { cookieDriver } from "./utils/scrape/cookie.js";
import { logging } from "./utils/core/logging.js";
import { login,loginMenu } from "./utils/scrape/login.js";
import {myCourse,detailHTML} from "./utils/scrape/my_course.js";
import { input } from "./utils/core/input.js"

let content = ['Login','Exit'].map((e,i) => `${i+1}. ${e}`)

console.clear()
console.log("==========================")
console.log("Welcome to LMS.UNHI.AC.ID")
console.log('==========================')
console.log(content.join('\n'))
let confirm = await input('Pilih : ')
if(confirm == '1'){
    console.clear()
    let user = await login()
    loginMenu(user)
} else {
    process.exit();
}

