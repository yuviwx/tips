import { Table } from "./table"
export function Form(){
    const addEmploy = (workers, setWorkers, worker) => {
        setWorkers(workers.push(worker))
    }
    
    return(
        <form onSubmit={addEmploy}>
            <Table addEmploy={addEmploy}></Table>
            <button onClick={addEmploy}>הוסף עובד</button>
        </form>
    )
}