import React from 'react';
import './index.css';
import App from './App';
import {createRoot} from "react-dom/client";

const container: HTMLElement | null = document.getElementById('root') as HTMLElement;

if (!container) {
    throw new Error("Root container not found.");
}

const root = createRoot(container);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)