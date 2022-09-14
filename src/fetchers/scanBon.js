import { createWorker } from "tesseract.js";

const meltserWorkers = ['יובל','בר','אפיק','מישל','מאיה','ימית','פוקסי','טל שמואלי','טל ששון','דניאל','ניצן','סתיו','אריאל','גל','ליאור','מתן','נאור','נועה','קיילה'];
const WorkersFullNames = {
    יובל: 'יובל נחמן',
    בר: 'בר כהן',
    אפיק: 'אפיק ברכה',
    מישל: 'מישל פרייזן',
    מאיה: 'מאיה אקנוניה',
    ימית: 'ימית טובל',
    שי: 'פוקסי',
    'טל שמ': 'טל שמואלי',
    'טל שש': 'טל ששון',
    דניאל: 'דניאל חורש',
    ניצן: 'ניצן ישראלי',
    סתיו: 'סתיו הררי',
    אריאל: 'אריאל קורן',
    גל: 'גל דוד',
    ליאור: 'ליאור חסיד',
    מתן: 'מתן יעקובי',
    נאור: '',
    נועה: 'נועה לוי',
    קיילה: 'קיילה'
}

export const convertImageToText = async (image, lang='heb') => {
    const worker = createWorker({
        logger: m => console.log(m),
      });
    await worker.load();
    await worker.loadLanguage(lang);
    await worker.initialize(lang);
    const { data } = await worker.recognize(image);
    //alert(data.text)
    console.log(data)
    await worker.terminate();
    return data
}

const cropImage = (imageURL, bbox=null) => {
    return new Promise((resolve,reject) => {
        let flag = false;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const image = new Image();
        image.src = URL.createObjectURL(imageURL);

        image.onload = function(){
            const {sx,sy,sWidth,sHeight} = bbox ? {
            sx: this.width * 660 / 1540,
            sy: bbox.sy,
            sWidth: this.width * 430 / 1540,
            sHeight: bbox.sHeight
            } : {
            sx: this.width * 660 / 1540,
            sy: this.height * 450 / 2030,
            sWidth: this.width * 430 / 1540,
            sHeight: this.height * 320 / 2030}
            /*
                         const sx = this.width * 660 / 1540;
            const sy = this.height * 450 / 2030;
            const sWidth = this.width * 430 / 1540;
            const sHeight = this.height * 320 / 2030;
             */
            canvas.height = sHeight;
            canvas.width = sWidth;
            context.drawImage(image, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);
            console.log(canvas.toDataURL('image/png'));
            flag = true;
        }

        const myInterval = setInterval(() => {
            if(flag) {
                clearInterval(myInterval);
                resolve(canvas.toDataURL('image/png'));
            }
        },100);
    });
}

const secondTry = async (image) => {
    const rawData = await convertImageToText(image)
    const name = rawData.words.filter(word => word.text === 'שם' || word.text.indexOf("שם") !== -1)[0]
    if(name){
        console.log(name.bbox)
        const y0 = name.bbox.y0 - 15;
        const y1 = name.bbox.y1 + 15;
        const workerName = await cropImage(image, {sy: y0-15, sHeight: y1 - y0 + 15})
        .then(resolve => convertImageToText(resolve))
        .then(resolve => resolve.text)
        return workerName
    }else{
        return("404 no name found, please tell yuval")

    }
}

export const runItAll = async image => {
    let flagSecondTry = false;
    let name = await cropImage(image)
    .then((resolve) => convertImageToText(resolve))
    .then(resolve => {
        for(let i = 0; i < meltserWorkers.length; i++){
            if(resolve.text.indexOf(meltserWorkers[i]) !== -1){
                return WorkersFullNames[meltserWorkers[i]]
            }
        }
        flagSecondTry = true;
        return secondTry(image)
    })
    .catch(e => alert(e))
    let times = await convertImageToText(image, "eng")
    .then(resolve => {
        const reg = /\d\d:\d\d/i;
        let timeARR = resolve.words.filter(word => word.text.match(reg));
        timeARR = timeARR.map(time => time.text.slice(0,5));
        return timeARR
    })
    alert("the final name is: " + name)
    console.log(times)
    if(flagSecondTry) {
        for(let i = 0; i < meltserWorkers.length; i++){
            if(name.indexOf(meltserWorkers[i]) !== -1){
                name = WorkersFullNames[meltserWorkers[i]]
            }
        }
    }
    return {name:name, entranceTime:times[0], leaveTime:times[1]}
} 

/*
const cropImage = im => {
    const script = spawn('python', ['.\imageDevider.py',URL.createObjectURL(im)]);
    //const python_process = spawner('python', ['.\imageDevider.py', URL.createObjectURL(im)]);
    script.stdout.on('data',({im1,im2}) => {
        console.log("data recived from python")
        console.log(im1,im2)
    })
}*/

/*
const cropImage = imageURL => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const image = new Image();
    image.src = URL.createObjectURL(imageURL);
    console.log(image)
    image.onload = function(){
        const sx = this.width * 660 / 1540;
        const sy = this.height * 450 / 2030;
        const sWidth = this.width * 430 / 1540;
        const sHeight = this.height * 320 / 2030;
        canvas.height = sHeight;
        canvas.width = sWidth;
        context.drawImage(image, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight)
        console.log(canvas.toDataURL('image/png'))
        return canvas.toDataURL('image/png');
    }
     return canvas.toDataURL('image/png'); 
}
*/

/*
    const rawData = await convertImageToText(image)
    const name = rawData.words.filter(word => word.text === 'שם' || word.text.indexOf("שם") !== -1)[0]
    if(name){
        console.log(name.bbox)
        const y0 = name.bbox.y0;
        const y1 = name.bbox.y1;
    }else{
        alert("noname")
    }
*/