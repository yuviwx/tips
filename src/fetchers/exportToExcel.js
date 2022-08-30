import { TableExport } from "tableexport";

function handleClick(oldTable, newTable) {
    oldTable.hidden = false;
    newTable.remove()
}

function makeTable(store) {

    let table = document.getElementsByTagName("table")[0];
    
    table.hidden = true
    const newTable = document.createElement('table');
    newTable.innerHTML="<thead></thead><tbody></tbody><tfoot></tfoot>"
    newTable.tHead.innerHTML = '<tr dir="rtl"><th scope="col">שם עובד</th><th scope="col">שעת כניסה</th><th scope="col">שעת יציאה</th><th scope="col">סה"כ שעות</th><th scope="col">שכר</th><th scope="col">השלמה</th></tr>';
    
    let workers = store.workers.map(worker => {

        return `<tr>` + Object.entries(worker).map(([key,value]) => {
            if(key !== 'id' && key !== 'moneyForAnHour') {
                return `<td>${value}</td>`
            }return ''}).join('') + `</tr>`
    });
    newTable.tBodies[0].innerHTML = workers.join('');
    newTable.tFoot.innerHTML = `<tr><th scope="col">סה"כ שעות</th><td>${store["totalTime"]}</td></tr><tr><th scope="col">סה"כ טיפים</th><td>${store["totalTips"]}</td></tr><tr><th scope="col">סה"כ לשעה</th><td>${store.workers[0]["moneyForAnHour"]}</td></tr>`
    table.insertAdjacentElement("afterend", newTable)
    return newTable
}

export function exportToExcel(store) {
    const oldTable = document.getElementsByTagName('table')[0]
    const table = makeTable(store);
    TableExport.prototype.formatConfig.xlsx.buttonContent = "ייצא לאקסל"
    TableExport.prototype.formatConfig.xlsx.buttonContent = "ייצא לאקסל"
    TableExport(table, {
        filename: 'meltzerTips',            
        sheetname: "sheet1",
        formats: ["xlsx"],
        RTL: true,                     
    });

    let button = document.createElement("button");
    const caption = document.querySelector("#root > div > form > table > caption")
    caption.append(button);
    button.innerText = "חזור לעריכה";
    button.setAttribute("type", "button")
    button.onclick = function() {handleClick(oldTable, table)}
    console.log(button)
} 

