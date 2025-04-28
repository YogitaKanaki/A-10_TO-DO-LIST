import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Registration from './components/Registration';
import Dashboard from './components/Dashboard';
import AddTask from './components/AddTasks';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-task" element={<AddTask />} />
      </Routes>
    </Router>
  );
}

export default App;