import React, { useState } from 'react';
import { Provider } from 'react-redux'
import store from './Redux/store'
import DrawerComponent from './Drawer.component';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import blue from '@material-ui/core/colors/blue';

let themeOption = {
  palette: {
    type: 'light',
    primary: blue,
  }
};

function App() {
  const [theme, setTheme] = useState(themeOption);
  // const [darkMode, setDarkMode] = useState(getInitialNode());
  // useEffect(() => {
  //   localStorage.setItem('dark', JSON.stringify(darkMode))
  //   const updateedTheme = {
  //     ...theme,
  //     palette: { ...theme.palette, type: darkMode ? 'dark' : 'light' }
  //   }
  //   setTheme(updateedTheme)
  // }, [darkMode]);

  // const toggleDarkMode = async () => {
  //   setDarkMode(prevMode => !prevMode);
  // }

  // function getInitialNode() {
  //   const isReturningUser = 'dark' in localStorage;
  //   const userPrefersDark = getPrefColorScheme()
  //   const savedMode = JSON.parse(localStorage.getItem('dark'));
  //   if (isReturningUser) { return savedMode }
  //   else if (userPrefersDark) { return true }
  //   else { return false }
  // }

  // function getPrefColorScheme() {
  //   if (!window.matchMedia) return;
  //   return window.matchMedia("(prefers-color-scheme: dark)").matches
  // }
// const express = require("express");

// var cors = require('cors')

// const app = express();

// app.use(cors());

// const { createProxyMiddleware } =require('http-proxy-middleware');

// app.use('/api', createProxyMiddleware({ 

//     target:'http://localhost:3000/', //original url

//     changeOrigin:true, 

//     //secure: false,

//     onProxyRes:function (proxyRes, req, res) {

//       proxyRes.headers['Access-Control-Allow-Origin'] = '*';

//     }

// }));

// app.listen(8080);
  const themeConfig = createMuiTheme(theme)
  return (
    <Provider store={store}>
      <ThemeProvider theme={themeConfig}>
        <DrawerComponent />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
