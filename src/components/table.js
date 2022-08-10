import {  useState } from "react";
import { TableRow } from "./tableRow"; 

const worker = {
    id: 0,
    name: '',
    entranceTime: '',
    leaveTime: '',
    totalTime: 0,
    moneyForAnHour: 0,
    totalSalary: 0,
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
        let totalTime = workers.reduce((previousValue, currentValue) => previousValue + currentValue.totalTime,0)
        console.log(totalTime)
        setTotalTime(parseFloat(totalTime.toFixed(2)))
        console.log(totalTime)
        const oneHourSalary = (totalTips / totalTime).toFixed(2);
        if(totalTips > 0) {
            setWorkers(workers.map(worker => ({...worker, moneyForAnHour: oneHourSalary, totalSalary: (oneHourSalary * worker.totalTime).toFixed(2), supplement: 0})))
        }
        if(oneHourSalary < 50) {
            let supplement = 50 - oneHourSalary;
            setWorkers(workers.map(worker => ({...worker, supplement: (supplement * worker.totalTime).toFixed(2)})))
        }
    }

    return (
        <form dir="rtl" onSubmit={calculateSalaries}>
            <header>
                <label htmlFor="date">תאריך</label>
                <input name="date" type="text" defaultValue={today}></input>
                <label htmlFor="totalTips">סה"כ טיפים</label>
                <input name="totalTips" type="number" value={totalTips} placeholder={0} onChange={handleChange} required></input>
            </header>
            <table>
                <thead>
                <tr>
                    <th scope='col'>שם עובד</th>
                    <th scope='col'>שעת כניסה</th>
                    <th scope='col'>שעת יציאה</th>
                    <th scope='col'>סה"כ שעות</th>
                    <th scope='col'>סה"כ לשעה</th>
                    <th scope='col'>סה"כ</th>
                    <th scope='col'>השלמה</th>
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
            <div id="total_time">{`סה"כ שעות: ${totalTime}`}</div>
        </footer>
      </form>
    )
}