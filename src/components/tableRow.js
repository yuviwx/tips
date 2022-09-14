import { useEffect, useState } from "react";
import { runItAll } from "../fetchers/scanBon";

const timeToInteger = time => {
    const hours = time.slice(0,2);
    const minutes = time.slice(3,5);
    const total_time = (parseFloat(hours) + parseFloat(minutes)/60);
    return total_time;
}

const roundToQuarter = (num) => {
    return parseFloat((Math.round(num*4)/4).toFixed(2));
}

export function TableRow(props){
    const {workers, setWorkers, index} = props;
    const [selectedImage, setSelectedImage] = useState(null);

    const handleChangeImage = ({target}) => {
        setSelectedImage(target.files[0])
    }
    
    useEffect(() => {
        console.log(index)
        console.log("entered the effect")
        if(selectedImage){
            if(localStorage.getItem('selectedImage') !== selectedImage)
                window.localStorage.setItem("selectedImage", selectedImage)
                console.log("inside effect")
                const getName = async () => {
                    const {name, entranceTime, leaveTime} = await runItAll(selectedImage);
                    console.log(name)
                    console.log(typeof(name))
                    setWorkers(workers.map(worker => worker.id === index ? {...worker, name: name, entranceTime: entranceTime, leaveTime: leaveTime} : worker))
                }
            getName()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[selectedImage])



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
        const totalTime = parseFloat((left - arrived).toFixed(2));
        console.log("type of total: " + typeof(totalTime))
        const fixedTime = roundToQuarter(totalTime)
        props.setWorkers(props.workers.map(worker => worker.id === props.index ? {...worker, totalTime: fixedTime} : worker)) 
    }

    /*const setTotalTime = (e) => {
        console.log(e.view.document)
        props.setTotalTime(parseFloat((props.totalTime + parseFloat(e.target.value)).toFixed(2)))
    }*/

    const handleNextInput = (event) => {
        if(event.target.value){
            const form = event.target.form;
            const index = [...form].indexOf(event.target);
            form.elements[index + 2].click();
        }
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
                <label htmlFor={index}>סרוק תמונה</label>
                <input type="file" id={index} className="upload" accept="image/*" onChange={handleChangeImage}/> 
            </td>
            <td>
                <input name="remove" className="remove" id={props.worker.id} type='button' onClick={props.removeEmploy} />
            </td>
        </tr>
    )
}
