import tableStyle from './styles/table.css';
import { Table } from './components/table';

function App() {
  return (
    <div className="App">
      <Table  style={tableStyle}></Table>
    </div>
  );
}

export default App;
