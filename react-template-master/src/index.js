// Polyfills
import 'core-js/features/promise';
import 'core-js/features/array/from';
import 'whatwg-fetch';
import 'webrtc-adapter/out/adapter_no_global';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import store from './store/';
import App from './App';

render(
    <Provider store={store}>
        <App location={ location } />
    </Provider>,
    document.getElementById('app')
);
