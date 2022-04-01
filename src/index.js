import React from 'react';
import ReactDOM from 'react-dom';
import { SpeechProvider } from '@speechly/react-client';
import env from "react-dotenv";

import { Provider } from './context/context';
import App from './App';

import './index.css';

ReactDOM.render(
    <SpeechProvider appId={env.SPEECHLY_APP_ID} language='en-US'>
        <Provider>
            <App />
        </Provider>
    </SpeechProvider>, 
document.getElementById('root'));