import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material';
import { restartGame, updateBoard, updatePlayers } from './store/actions';
import { GAME } from './constants';
import Board from './components/board/board';
import Settings from './components/settings/settings';
import Info from './components/info/info';
import Room from './components/room/room';
import Players from './components/players/players';
import Login from './components/login/login';
import { io } from 'socket.io-client';
import './App.css';
import { DIFFICULTY } from './constants';
import { DifficultyContext } from './components/settings/Context';

// const socket = io("localhost:4000");

const socket = io("https://minesweeper-together.onrender.com", {
  withCredentials: true
}); // Connect to server

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFFFFF', 
    }
  },
});

function App() {
  const difficulty = useSelector(state => state.difficulty);
  const [ difficultyState, setDifficultyState ] = useState(0);
  const gameState = useSelector(state => state.gameState);
  const boardData = useSelector(state => state.boardData);
  const [ showLogin, setShowLogin] = useState(true);
  const [ showError, setShowError ] = useState(false);
  const dispatch = useDispatch();
  const timer = useRef(null);

  useEffect(() => {
    return () => { // unmount callback
      if (timer.current != null) {
        clearTimeout(timer.current) // clear timer
      }
    }
  }, [])

  useEffect(() => {
    socket.on("updateBoard", (data) => {
      dispatch(updateBoard(data));
      setDifficultyState(data[2]);
    })

    socket.on("updatePlayers", (data) => {
      dispatch(updatePlayers(data));
    })

    socket.on("roomFull", () => {
      setShowError(true);
      timer.current = setTimeout(() => {
        setShowError(false)
      }, 3000);
    })

    return () => {
      socket.off("disconnect");
    };
  }, [dispatch]);

  const tryAgain = useCallback(() => {
    dispatch(restartGame(difficultyState));
  }, [dispatch, difficultyState]);

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
      <DifficultyContext.Provider value={difficultyState}>
        <div className="App">
          {showLogin && 
            <Login setShowLogin={() => setShowLogin(false)}/>
          }
          <div className='Header'>
            <Room/>
            {showError &&
              <div className='Error'>
                That room is full!
              </div>
            }
            <Settings/>
          </div>
          <div className='Body'>
            <h1>MINESWEEPER TOGETHER</h1>
            <Board difficulty={difficulty} boardData={boardData}/>
            <div 
              style={{
                width: String(DIFFICULTY[difficulty][0] * 40 + DIFFICULTY[difficulty][0]) + 'px'
              }} 
              className='Result'>{getResult()}
            </div>
          </div>
          <div className='Footer'>
            <Info/>
            <a className='Credits' href="https://github.com/SSonagi/minesweeper-together">Github</a>
            <Players/>
          </div>
        </div>
      </DifficultyContext.Provider>     
    </ThemeProvider>
  );
}

export const server = socket;
export default App;
