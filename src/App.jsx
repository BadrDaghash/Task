import React from "react";
import "./App.css";
import { createBrowserRouter, createHashRouter, RouterProvider } from "react-router-dom";
import Home from "./Components/Home";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '@fontsource/roboto';
import DataContextProvider from "./Context/DbContext";
import Graph from "./Components/Graph";

// Define your custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Customize as needed
    },
    secondary: {
      main: '#dc004e', // Customize as needed
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

const router = createHashRouter([
  {
    path: "/",
    element: <Home />,children: [
     { index:true ,element:<Graph/>}
    ]
  },
]);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DataContextProvider>
        <RouterProvider router={router} />
      </DataContextProvider>
    </ThemeProvider>
  );
}

export default App;
