import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IntlProvider, addLocaleData } from 'react-intl';
import { Provider } from 'react-redux';
import { store } from './helpers/store';
import App from './app';
import * as en from 'react-intl/locale-data/en';
import * as zh from 'react-intl/locale-data/zh';

//let zhCN = require('../translation/locales/zh.json');

addLocaleData([...en, ...zh]);


ReactDOM.render(
    <IntlProvider locale='en'>
        <Provider store={store}>
            <App/>
        </Provider>
    </IntlProvider>,
    document.getElementById('main')
);