import { useEffect } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom';

function App() {

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const testServerConection = async () => {
      try {
        const response = await fetch(`${API_URL}/ping`);
        if (!response.ok) {
          console.error('Client error.');
        } else {
          const data = await response.json();
          console.log(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    testServerConection();
  }, []);

  return (
    <>
      <div className="app">
        <Routes>
          <Route path='/' element={<><h1>Assets System Manager</h1></>}></Route>
        </Routes>
      </div>
    </>
  )
}

export default App
