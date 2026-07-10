import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';

const ThemedToaster = () => {
  const { isDark } = useTheme();
  return <Toaster richColors position="top-right" theme={isDark ? "dark" : "light"} />;
};

function App() {
  return (
    <ThemeProvider>
      <ThemedToaster />
      {/* <button onClick={() => toast("Hello from sonner")}>Click here!!!</button> */}

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
