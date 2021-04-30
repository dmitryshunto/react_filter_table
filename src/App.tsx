
import './App.css';
import Table from './Components/Table';
import { data } from './data';

const App = () => {
  return (
    <div className='app'>
        <h1>React Filter And Sorter Table</h1>
        <Table tets_data = {data}/>
    </div>
  );
}

export default App;
