import {createInterface} from "readline";
const rl = createInterface({
    input:process.stdin,
    output:process.stdout
})
export function input(prompt){
    return new Promise((resolve,reject)=>{
        rl.question(prompt,(data) => {
            resolve(data)
        })
    })
}
