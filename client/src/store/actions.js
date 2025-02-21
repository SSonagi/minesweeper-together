import { createSlice } from '@reduxjs/toolkit';
import { CODES, GAME, MODE } from '../constants';
import { server } from '../App';

const gameSlice = createSlice({
    name: 'gameState',
    initialState: { 
        gameState: GAME.READY,
        enableTimer: false,
        elapsedTime: 0,
        boardData: new Array(8).fill(new Array(8).fill(CODES.NOTHING)),
        difficulty: 0,
        flagCount: 0,
        openedCellCount: 0,
        roomNo: 0,
        players: [],
        gameMode: MODE.COOP
    },
    reducers: {
        updateBoard: (state, action) => {
            state.roomNo = action.payload[0];
            state.gameState = action.payload[1];
            if (!state.enableTimer && state.gameState === GAME.RUN) {
                state.enableTimer = true;
            }
            if (state.enableTimer && state.gameState !== GAME.RUN) {
                state.enableTimer = false;
                state.elapsedTime = 0;
            }
            state.difficulty = action.payload[2];
            state.boardData = action.payload[3];
            state.flagCount = action.payload[4];
            state.gameMode = action.payload[5];
        },
        updatePlayers: (state, action) => {
            state.players = action.payload;
        },
        joinRoom: (state, action) => {
            server.emit("joinRoom", {
                roomNo: action.payload
            });
        },
        login: (state, action) => {
            server.emit("login", {
                name: action.payload
            });
        },
        restartGame: (state, action) => {
            server.emit("restart", {
                difficulty: action.payload
            });
            state.enableTimer = false;
            state.elapsedTime = 0;
        },
        startVersus: (state) => {
            server.emit("versus");
        },
        updateElapsedTime: (state) => {
            state.elapsedTime++;
        },
        startTimer: (state) => {
            state.enableTimer = true;
        },
        clickCell: (state, action) => {
            // Start timer if click on cell
            if (!state.enableTimer) {
                state.enableTimer = true;
            }
            server.emit("clickCell", {
                x: action.payload.x,
                y: action.payload.y
            });
        },
        rightClickCell: (state, action) => {
            server.emit("rightClick", {
                x: action.payload.x,
                y: action.payload.y
            });    
        }
    },
});

const { actions, reducer } = gameSlice
export const { updateBoard, updatePlayers, joinRoom, login, restartGame, startVersus, updateElapsedTime, startTimer, clickCell, rightClickCell } = actions; // Export actions
export default reducer; // Export the reducer