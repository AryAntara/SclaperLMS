import {detailHTML,getAllCourse} from "./my_course.js"
import {input} from "../core/input.js"
import {loginMenu} from "./login.js"
import {html} from "../core/html.js"

let allCourseData = null;
export async function handler(option,data) {
    console.clear()
    if(option == 1){
        console.log('Get Course data ...')
        await allCourse();
    } else if (option == 2){
        console.log('Get Course data ...')
        allCourseData = null;
        await allCourse();
    } else if (option == 3){
        console.log('Get Course data ...')
        allCourseData = null;
        await allCourse();
        await pickCourse(data);
    }

    let confirm = await input('press (enter) : ')
    console.clear()
    await loginMenu(data)
}

async function allCourse(){
    if(!allCourseData){
        allCourseData = await getAllCourse();
    }
    console.log(allCourseData['view'].join('\n'))
}

async function pickCourse(data){
    console.log('(R) to refresh data')
    let courseId = await input('Masukan nomor course :')
    if(courseId == 'R'){
        await handler(3,data)
    }
    courseId = Number(courseId) - 1;
    let courseSelected = allCourseData.data[courseId];
    if(courseSelected){
        await DetailCourse(courseSelected,data)
    } else {
        await loginMenu(data)
    }
    
}

async function DetailCourse(data,rootData){
    console.clear();
    console.log(`geting info for ${data.name}...`)
    let $ = await detailHTML(data.link)
    let menuList = [
        'Info Absensi',
        'Materi'
    ].map((e,i) => `${i+1}. ${e}`).join('\n')
    
    console.log(menuList)
    let opt = await input('Pilih : ')
    if(opt === '1'){
        await Absensi($('li.attendance').find('a').attr('href'),data,rootData)
    } else if (opt == '2'){
        await Materi($,data,rootData)
    }
    await handler(3,rootData)
}

async function Absensi(url,data,rootData){
    console.clear()
    let $ = await detailHTML(url)
    let j = 0
    let k = 0
    let tr = $('table').find('tr')
    
    tr.each(function(){

        const data = {};
        let i = 0
        j++
        $(this).find('td').each(function(){
            i++
            if(i == 1){
                data['date'] = $(this).text()
            }else if (i == 3){
                data['keterangan'] = $(this).text()
            } 
        })
        if(j == 1 || j == 2 || j > tr.length - 3){
            
        } else {
            k++
            console.log(`${k}. Tanggal ${data['date']}, Status ${data['keterangan']}`)
        }
    })
    await input('Enter')
    await DetailCourse(data,rootData)
    
}

async function Materi(materi,data,rootData){
    console.clear()
    let Materies = []
    let $ = materi
    let i = 0
    let j = 0
    console.log(`MatKul : ${data.name}`)
    $('ul.topics').find('li.section').each(function(){
        if(j != 0){
            i++
            let name = $(this).find('h3.sectionname').text()
            console.log(`${i}.`,name)
            Materies.push({
                link : $(this).find('a').attr('href'),
                detail : $(this).find('div.content').html(),
                name,
            })
        }
        j++
    })
    
    let opt = await input('Pilih Materi (untuk melihat detail ) : ')
    let numOpt = Number(opt) - 1
    let materiPick = Materies[numOpt]
    if(materiPick){
        await MateriDetail(materiPick, materi,data,rootData )
    } else if(opt != '') {
        console.log('index not found...');
        await input('Enter');
        return await Materi($,data,rootData);
    }
    
    await input('Enter')
    await DetailCourse(data,rootData)
}

async function MateriDetail(materi,materiParrent,data,rootData){
    console.clear()
    console.log(`Detail dari ${materi.name} :`)
    let $ = html.load(materi.detail)
    let j = 0
    $('ul').find('li').each(function(){
        j++
        let type = '';
        let link = $(this).find('a').attr('href');
        if(!link){
            console.log(`${j}. ${$(this).text()}`)
        } else {
            if(link.includes('resource')){
                type = 'File'
            } else if (link.includes('assign')){
                type = 'Tugas'
            } else if (link.includes('url')){
                type = 'link'
            }
            console.log(`${j}. ${$(this).text()} (${type}) (${link}) `)
        }
    })

    await input('Kembali (Enter) : ')
    await Materi(materiParrent,data,rootData)
}
