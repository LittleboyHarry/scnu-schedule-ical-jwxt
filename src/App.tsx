import { useEventListener, useKeyPress } from '@umijs/hooks';
import 'antd/dist/antd.css';
import React, { useEffect, useState } from 'react';
import './App.css';
import { getAppState, useAppState } from './AppState';
import { Footer, GettingStart, HelpDoc, Introduction, Navbar, ResultPage } from './fragments';
import generator, { CourseDataTransformer } from './generator';
import * as Rules from './rules';

function Debugger() {
  const [visible, setVisible] = useState(false);

  useKeyPress('`', () => {
    setVisible(true);
  });

  return (
    <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 2 }} hidden={!visible}>
      <button
        onClick={() => {
          getAppState().turnToFailure();
        }}
      >
        失败模拟
      </button>
      <button
        onClick={() => {
          getAppState().turnToSuccess(null!);
        }}
      >
        成功模拟
      </button>
    </div>
  );
}

function App() {
  useEffect(() => {
    document.title = Rules.title;
  }, []);

  const setFailure = useAppState((state) => state.turnToFailure);

  useEventListener('message', ({ data, origin }: MessageEvent) => {
    if (origin === Rules.jwxtOrigin) {
      const appState = getAppState();
      appState.closeChildWindow();
      try {
        const { generateOptions } = getAppState();
        if (generateOptions) {
          const calendar = generator((data as any[]).map(CourseDataTransformer), generateOptions);
          appState.turnToSuccess(calendar);
        } else {
          throw new Error('错误');
        }
      } catch (error) {
        setFailure({ code: error.toString() });
      }
    }
  });

  return (
    <>
      <Debugger />
      <Navbar />
      <Introduction />
      <GettingStart />
      <HelpDoc />
      <ResultPage />
      <Footer />
    </>
  );
}

export default App;
