import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material';
import { restartGame } from './store/actions';
import { GAME } from './constants';
import Board from './components/board/board';
import Settings from './components/settings/settings';
import Info from './components/info/info';

import './App.css';

const theme = createTheme({
  palette: {
    cell: {
      main: '#FFFFFF',
    },
    button: {
      main: '#FFFFFF',
    }
  },
});

function App() {
  const width = useSelector(state => state.width);
  const height = useSelector(state => state.height);
  const gameState = useSelector(state => state.gameState);
  const dispatch = useDispatch();

  const tryAgain = useCallback(() => {
    dispatch(restartGame());
  }, [dispatch]);

  const getResult = useCallback(() => {
      switch (gameState) {
        case GAME.WIN:
          return 'You Win!';
        case GAME.LOSE:
          return (
            <button className='Reset' onClick={tryAgain}>
              Try Again?
            </button>
          );
        default:
          return '';
      }
    }, [gameState, tryAgain]);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <div className='Header'>
          <Info/>
          <Settings/>
        </div>
        <div className='Body'>
          <h1>MINESWEEPER TOGETHER</h1>
          <Board width={width} height={height}/>
          <div style={{width: String(width * 40 + width) + 'px'}} className='Result'>{getResult()}</div>
        </div>
        <a className='Credits' href="https://github.com/SSonagi/minesweeper-together">Github</a>
      </div>
    </ThemeProvider>
  );
}

export default App;
