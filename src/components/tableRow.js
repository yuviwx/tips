const timeToInteger = time => {
    const hours = time.slice(0,2);
    const minutes = time.slice(3,5);
    const total_time = (parseFloat(hours) + parseFloat(minutes)/60);
    return total_time;
}

const roundToQuarter = (num) => {
    let toFixed = num.slice(-2); // Num is a number with 2 decimal digits
    toFixed %= 25;
    if(toFixed <= 12) {
        console.log(toFixed)
        return parseFloat(num - toFixed/100)
    }

    return parseFloat(num) + (25 - toFixed)/100
}

export function TableRow(props){

    const handleChange = ({ target }) => {
        console.log("enter change")
        props.setWorkers(props.workers.map(worker => worker.id === props.index ? {...worker, [target.name]: target.value} : worker)) 
        if(target.name === 'leaveTime') {

        }           
    }

    const calculateShift = ({target}) => {
        const arrived = timeToInteger(props.worker.entranceTime);
        let left = timeToInteger(target.value);
        if(left < arrived) {
            left += 24
        }
        const totalTime = (left - arrived).toFixed(2)
        console.log("type of total: " + typeof(totalTime))
        const fixedTime = roundToQuarter(totalTime)
        props.setWorkers(props.workers.map(worker => worker.id === props.index ? {...worker, totalTime: fixedTime} : worker)) 
    }

    /*const setTotalTime = (e) => {
        console.log(e.view.document)
        props.setTotalTime(parseFloat((props.totalTime + parseFloat(e.target.value)).toFixed(2)))
    }*/

    const handleNextInput = (event) => {
        const form = event.target.form;
        const index = [...form].indexOf(event.target);
        form.elements[index + 2].click();
        event.preventDefault();
      };

    return(
        <tr>
            {/*<th scope="row"><input name="name" type="text" pattern="[א-ת ]+" value={props.worker.name} onChange={handleChange} autoFocus required></input></th>
            <td><input name="entranceTime" type="time" value={props.worker.entranceTime} onChange={handleChange} required></input></td>
            <td><input name="leaveTime" type="time" value={props.worker.leaveTime} onChange={handleChange} onBlur={calculateShift} required></input></td>
            <td><input name="totalTime" type="number" value={props.worker.totalTime} onChange={handleChange} onBlur={setTotalTime}></input></td>
            <td><input name="moneyForAnHour" type="number" value={props.worker.moneyForAnHour} onChange={handleChange}></input></td>
            <td><input name="totalSalary" type="number" value={props.worker.totalSalary} onChange={handleChange}></input></td>
            <td><input name="supplement" type="number" value={props.worker.supplement} onChange={handleChange}></input></td>*/}
            <td>
                <section className="firstLine">
                    <div>
                        <label htmlFor="name">שם:</label>
                        <input name="name" type="text" pattern="[א-ת ]+" value={props.worker.name} placeholder="שם" onChange={handleChange} onBlur={handleNextInput} autoFocus autoComplete="on" required />
                    </div>
                    <div>
                        <input name="totalTime" type="number" value={props.worker.totalTime} placeholder='סה"כ שעות' onChange={handleChange} disabled/>
                        <label htmlFor="totalTime">שעות</label>
                    </div>
                </section>
                <section className="timesLine">
                    <label htmlFor="entranceTime">שעת כניסה:</label>
                    <input name="entranceTime" type="time" value={props.worker.entranceTime} onChange={handleChange} required />
                    <label htmlFor="leaveTime">שעת יציאה:</label>
                    <input name="leaveTime" type="time" value={props.worker.leaveTime} onChange={handleChange} onBlur={calculateShift} required />
                </section>
                <section className="salary">
                <label htmlFor="totalSalary">שכר</label>
                <input name="totalSalary" type="number" value={props.worker.totalSalary} placeholder="שכר" onChange={handleChange} disabled/>
                <label htmlFor="supplement">השלמה</label>
                <input name="supplement" type="number" value={props.worker.supplement} placeholder="השלמה" onChange={handleChange} />
                </section>
            </td>
            <td>
                <input name="remove" className="remove" id={props.worker.id} type='button' onClick={props.removeEmploy} />
            </td>
        </tr>
    )
}
