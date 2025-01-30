import { createSlice } from '@reduxjs/toolkit';
import { flagCell, initBoard, expandCell, getFlagCount } from '../lib/logic';
import { CODES, GAME } from '../constants';

const gameSlice = createSlice({
    name: 'gameState',
    initialState: { 
        gameState: GAME.READY,
        enableTimer: false,
        elapsedTime: 0,
        boardData: initBoard(8,8,10),
        width: 8,
        height: 8,
        mineCount: 10,
        flagCount: 0,
        openedCellCount: 0
    },
    reducers: {
        setGame: (state, action) => {
            state.width = action.payload[0];
            state.height = action.payload[1];
            state.mineCount = action.payload[2];
        },
        restartGame: (state) => {
            state.gameState = GAME.READY;
            state.enableTimer = false;
            state.elapsedTime = 0;
            state.boardData = initBoard(state.width, state.height, state.mineCount);
            state.flagCount = 0;
            state.openedCellCount = 0;        
        },
        updateElapsedTime: (state) => {
            state.elapsedTime++;
        },
        clickCell: (state, action) => {
            const x = action.payload.x;
            const y = action.payload.y;
            const code1 = state.boardData[y][x];
            state.gameState = GAME.RUN;

            // Start timer if click on cell
            if (!state.enableTimer) {
                state.enableTimer = true;
            }
            
            const openCell = (code, x, y) => {
                if (code === CODES.MINE) {
                    state.gameState = GAME.LOSE;
                    state.enableTimer = false;
                }
                else if (code === CODES.NOTHING) {
                    const expandResult = expandCell(state.boardData, x, y);
                    state.boardData = expandResult.boardData;
                    state.openedCellCount += expandResult.openedCellCount;
    
                    // Win
                    if (state.width * state.height - state.mineCount === state.openedCellCount) {
                        state.gameState = GAME.WIN;
                        state.enableTimer = false;
                        state.flagCount = state.mineCount;
                    }
                }
            }

            if (code1 >= CODES.OPENED) {
				let aroundCode = [];
		
				aroundCode = state.boardData[y - 1] ? aroundCode.concat([[y - 1, x - 1]], [[y - 1, x]], [[y - 1, x + 1]]) : aroundCode;
				aroundCode = aroundCode.concat([[y, x - 1]], [[y, x + 1]]);
				aroundCode = state.boardData[y + 1] ? aroundCode.concat([[y + 1, x - 1]], [[y + 1, x]], [[y + 1, x + 1]]) : aroundCode;

				for (const cell of aroundCode) {
					if (state.boardData[cell[0]][cell[1]] === CODES.NOTHING || state.boardData[cell[0]][cell[1]] === CODES.MINE) {
						openCell(state.boardData[cell[0]][cell[1]], cell[1], cell[0]);
					}
				}
			}
            else {
                openCell(code1, x, y);
            }
        },
        rightClickCell: (state, action) => {
            const params = action.payload;
            const code2 = state.boardData[params.y][params.x];
    
            if (code2 !== CODES.OPENED) {
                state.boardData[params.y][params.x] = flagCell(code2);
                state.flagCount += getFlagCount(code2);
            }        
        }
    },
});

const { actions, reducer } = gameSlice
export const { showSettings, hideSettings, setGame, restartGame, updateElapsedTime, clickCell, rightClickCell } = actions; // Export actions
export default reducer; // Export the reducer