import './App.css';
import HomePage from './Pages/HomePage';
import ChatPage from './Pages/ChatPage';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </main>
  );
}

export default App;
