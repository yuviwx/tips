import {  useState } from "react";
import { TableRow } from "./tableRow"; 
import { exportToExcel } from "../fetchers/exportToExcel"

const worker = {
    id: 0,
    name: '',
    entranceTime: '00:00',
    leaveTime: '00:00',
    totalTime: null,
    moneyForAnHour: 0,
    totalSalary: null,
    supplement: ''
}

const date = new Date();
const today = date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' });

export function Table(props) {
    const [workers, setWorkers] = useState([{...worker}]);
    const [totalTips, setTips] = useState()
    const [totalTime, setTotalTime] = useState(0)

    const addEmploy = (e) => {
        e.preventDefault()
        setWorkers([...workers, {...worker, id: workers.length}])
    }
    const removeEmploy = ({target}) => {
        console.log("enter func");
        console.log(target.id)
        setWorkers(() => {
            // eslint-disable-next-line eqeqeq
            const a = workers.filter(worker => worker.id != target.id)
            return a.map((worker,index) => ({...worker, id: index}))
        });
    }

    const handleChange = ({target}) => {
        console.log(target.value)
        setTips(parseInt(target.value));
    }
    
    const calculateSalaries = (e) => {
        e.preventDefault()
        console.log("calculeting")
        setWorkers(workers.map(worker => ({...worker, totalSalary: 0, supplement: 0})))
        let totalTime = workers.reduce((previousValue, currentValue) => previousValue + currentValue.totalTime,0)
        console.log(totalTime)
        setTotalTime(parseFloat(totalTime.toFixed(2)))
        console.log(totalTime)
        const oneHourSalary = Math.floor(totalTips / totalTime);
        if(oneHourSalary >= 50) {
            console.log("setting salary")
            setWorkers(workers.map(worker => ({...worker, moneyForAnHour: oneHourSalary, totalSalary: Math.round(oneHourSalary * worker.totalTime)})))
        }else {
            console.log("setting suppelment")
            let supplement = 50 - oneHourSalary;
            setWorkers(workers.map(worker => ({...worker,totalSalary: (oneHourSalary * worker.totalTime).toFixed(2), supplement: (supplement * worker.totalTime).toFixed(2)})))
        }
    }

    return (
        <form dir="rtl" onSubmit={calculateSalaries}>
            <header>
                <label htmlFor="date">תאריך</label>
                <input name="date" type="text" defaultValue={today}></input>
                <div>
                  <label htmlFor="totalTips">סה"כ טיפים</label>
                  <input name="totalTips" type="number" value={totalTips} placeholder={0} onChange={handleChange} required />
                  <label htmlFor="totalTime">סה"כ שעות</label>
                  <input name="totalTime" type="number" value={totalTime} placeholder={0} onChange={handleChange} required />
                </div>
            </header>
            <table>
            <thead>
                <tr>
                    <th scope="col">מלצרים</th>
                    <th scope="col">מחיקה</th>
                </tr>
            </thead>
                <tbody>
                    {
                        workers ? workers.map((worker, index) => <TableRow workers={workers} worker={worker} key={index} index={index} setWorkers={setWorkers} removeEmploy={removeEmploy} totalTime={totalTime} setTotalTime={setTotalTime}/>) : <TableRow worker='' key={0}/>
                    }
                </tbody>
                <tfoot></tfoot>
        </table>
        <footer>
            <section className="buttons">
            <button className="button" onClick={addEmploy}>הוסף עובד</button>
            <input className="button" type="submit" onSubmit={calculateSalaries} value="חשב שכר" />
            </section>
            <button className="button" onClick={() => {
                if(workers[0].totalSalary) {
                    exportToExcel({workers:workers, totalTips: totalTips, totalTime: totalTime})
                }
                    }}>ייצא</button>
            <div id="total_time">{`סה"כ לשעה: ${workers[0].moneyForAnHour}`}</div>
        </footer>
      </form>
    )
}
