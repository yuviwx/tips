const timeToInteger = time => {
    const a = time.slice(0,2);
    const b = time.slice(3,5);
    const c = (parseFloat(a) + parseFloat(b)/60) 
    return c < 10 ? parseInt(c + 24) : c;
}

export function TableRow(props){

    const handleChange = ({ target }) => {
        props.setWorkers(props.workers.map(worker => worker.id === props.index ? {...worker, [target.name]: target.value} : worker)) 
        if(target.name === 'leaveTime') {

        }           
    }

    const calculateShift = ({target}) => {
        if(target.value) {
            const arrived = timeToInteger(props.worker.entranceTime)
            const left = timeToInteger(target.value)
            const totalTime = parseFloat(Math.abs(left - arrived).toFixed(2))
            props.setWorkers(props.workers.map(worker => worker.id === props.index ? {...worker, totalTime: totalTime} : worker)) 
        }
    }

    const setTotalTime = ({target}) => {

        props.setTotalTime(parseFloat((props.totalTime + parseFloat(target.value)).toFixed(2)))
    }


    return(
        <tr>
            <th scope="row"><input name="name" type="text" pattern="[א-ת ]+" value={props.worker.name} onChange={handleChange} autoFocus required></input></th>
            <td><input name="entranceTime" type="time" value={props.worker.entranceTime} onChange={handleChange} required></input></td>
            <td><input name="leaveTime" type="time" value={props.worker.leaveTime} onChange={handleChange} onBlur={calculateShift} required></input></td>
            <td><input name="totalTime" type="number" value={props.worker.totalTime} onChange={handleChange} onBlur={setTotalTime}></input></td>
            <td><input name="moneyForAnHour" type="number" value={props.worker.moneyForAnHour} onChange={handleChange}></input></td>
            <td><input name="totalSalary" type="number" value={props.worker.totalSalary} onChange={handleChange}></input></td>
            <td><input name="supplement" type="number" value={props.worker.supplement} onChange={handleChange}></input></td>
            <td><input name="remove" className="remove" id={props.worker.id} type='button' onClick={props.removeEmploy} /></td>
        </tr>
    )
}