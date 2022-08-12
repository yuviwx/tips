import { TableRow } from "./tableRow2";

export function Table(props){
    
    return(
        <table dir="rtl">
            <thead>
                <tr>
                    <th scope="col">מלצרים</th>
                    <th scope="col">מחיקה</th>
                </tr>
            </thead>
            <tbody>
                {
                    props.workers ? props.workers.map((worker, index) => <TableRow workers={props.workers} worker={props.worker} key={index} index={index} setWorkers={props.setWorkers} removeEmploy={props.removeEmploy} totalTime={props.totalTime} setTotalTime={props.setTotalTime}/>) : <TableRow worker='' key={0}/>
                }
            </tbody>
        </table>
    )
}