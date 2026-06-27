import { Toaster, toast } from "sonner";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <>
      <Toaster richColors position="top-right" theme="light" />
      {/* <button onClick={() => toast("Hello from sonner")}>Click here!!!</button> */}

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
