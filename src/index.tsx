import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { isCarThing, isDev } from './utils/env';

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);

  if (!isCarThing && isDev) {
    rootEl.style.backgroundColor = '#060504';
  }

  root.render(
    <React.StrictMode>
      <main
        style={
          !isCarThing && isDev
            ? {
                width: '800px',
                height: '480px',
                margin: 'auto',
                borderRadius: '16px',
                border: '1px solid #292524',
              }
            : {}
        }
        className="flex items-center justify-center bg-stone-950 text-stone-50 w-full h-full overflow-hidden"
      >
        <App />
      </main>
    </React.StrictMode>,
  );
}
