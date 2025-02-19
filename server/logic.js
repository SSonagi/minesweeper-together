import { CODES, DIFFICULTY } from './constants.js';

export const initBoard = (difficulty) => {
	const [ width, height, mineCount ] = DIFFICULTY[difficulty];
    const indexes = Array.from(Array(width * height).keys());
    const mines = [];
    const board = [];

    for(let i=0; i<mineCount; i++)
        mines.push(indexes.splice(Math.floor(Math.random() * indexes.length), 1)[0]);

    for (let i = 0; i < height; i++) {
		const row = Array(width).fill(CODES.NOTHING);
		board.push(row);
	}

    for(let mine of mines){
        const x = mine % width;
		const y = Math.floor(mine / width);
		board[y][x] = CODES.MINE;   
    }

    return board;   
};

export const flagCell = (code, num) => {
	switch (code) {
		case CODES.NOTHING:
			return CODES.FLAG_1 - num;
		case CODES.MINE:
			return CODES.MINE_FLAG_1 - num;
		case CODES.FLAG_1:
		case CODES.FLAG_2:
		case CODES.FLAG_3:
		case CODES.FLAG_4:
			return CODES.NOTHING;
		case CODES.MINE_FLAG_1:
		case CODES.MINE_FLAG_2:
		case CODES.MINE_FLAG_3:
		case CODES.MINE_FLAG_4:
			return CODES.MINE;
		default:
			return code;
	}
};

export const getFlagCount = (code) => {
	switch (code) {
		case CODES.MINE:
			return 1;
		case CODES.MINE_FLAG:
			return -1;
		default:
			return 0;
	}
};

export const expandCell = (boardData, x, y) => {
	let openedCellCount = 0;

	// Define function to get mine count
	const getMineCount = (x, y) => {
		let aroundCode = [];
		let mineCount = 0;

		aroundCode = boardData[y - 1] ? aroundCode.concat(boardData[y - 1][x - 1], boardData[y - 1][x], boardData[y - 1][x + 1]) : aroundCode;
		aroundCode = aroundCode.concat(boardData[y][x - 1], boardData[y][x + 1]);
		aroundCode = boardData[y + 1] ? aroundCode.concat(boardData[y + 1][x - 1], boardData[y + 1][x], boardData[y + 1][x + 1]) : aroundCode;

		mineCount = aroundCode.filter(v => [
			CODES.MINE,
			CODES.MINE_FLAG,
		].includes(v)).length;

		return mineCount;
	}; 

	// Using DFS algorithm to expand
	const dfsSearch = (x, y) => {
		if (boardData[y][x] !== CODES.NOTHING) {
			return;
		}

		boardData[y][x] = getMineCount(x, y);
		openedCellCount++;

		let aroundPoint = [];
		aroundPoint = boardData[y - 1] ? aroundPoint.concat({ x: x - 1, y: y - 1 }, { x, y: y - 1 }, { x: x + 1, y: y - 1 }) : aroundPoint;
		aroundPoint = aroundPoint.concat({ x: x - 1, y }, { x: x + 1, y });
		aroundPoint = boardData[y + 1] ? aroundPoint.concat({ x: x - 1, y: y + 1 }, { x, y: y + 1 }, { x: x + 1, y: y + 1 }) : aroundPoint;

		if (boardData[y][x] === 0) {
			aroundPoint.forEach((v) => {
				dfsSearch(v.x, v.y);
			});
		}
	};

	dfsSearch(x, y);
	return { boardData, openedCellCount };
};