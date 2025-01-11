import { createRoot } from 'react-dom/client'
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import './assets/css/style.css';
import '@mantine/charts/styles.css';
import {MantineProvider} from '@mantine/core';
import {ThemeModify} from './ThemeCustomize.ts';
import Router from './Router.tsx';
import { BrowserRouter } from 'react-router-dom';
import {store} from "../src/redux/store.ts"
import { Provider } from 'react-redux'
createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <MantineProvider theme={ThemeModify}>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
    </MantineProvider>
  </Provider>
)
