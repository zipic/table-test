import { Provider } from 'react-redux';
import './App.css';
import { store } from './redux/store';
import UsersTable from './components/userTable/UsersTable';

function App() {
  return (
    <Provider store={store}>
    <div className="App">
      <UsersTable />
    </div>
    </Provider>
  );
}

export default App;
