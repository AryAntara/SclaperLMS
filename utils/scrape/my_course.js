import {html} from "../core/html.js";
import {dashboard} from "./dashboard.js";
import {standardGet} from "./internet.js";

export async function myCourse(){
    let dashboardReq = await dashboard();
    let $ = html.load(dashboardReq);
    const courseData = [];
    $('div.card-body ul').find('li').each(function(){
        let link = $(this).find('a').attr('href')
        let id = link.split('id=')[1]
        let name = $(this).text()
        courseData.push({
            link,
            id,
            name
        })
    });
    return courseData
}

export async function getAllCourse(){
    let courseData = await myCourse();
    return {data: courseData, view: courseData.map((e,i) => `${i+1}. ${e.name}`)}
}

export async function detailHTML(url){
    let courseDetail = await standardGet(url);
    let $ = html.load(courseDetail);
    return $;
}

