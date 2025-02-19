export const CODES = {
	OPENED: 0,
	NOTHING: -1,
	FLAG_1: -2,
	FLAG_2: -3,
	FLAG_3: -4,
	FLAG_4: -5,
	MINE: -6,
	MINE_FLAG_1: -7,
	MINE_FLAG_2: -8,
	MINE_FLAG_3: -9,
	MINE_FLAG_4: -10,
};

export const GAME = {
	READY: 'ready',
	RUN: 'run',
	WIN: 'win',
	LOSE: 'lose'
};

export const DIFFICULTY = [
	[8,8,10],
	[9,9,10],
	[10,10,10],
	[15,13,40],
	[16,13,40],
	[15,14,40],
	[16,14,40],
	[15,15,40],
	[16,15,40],
	[16,16,40],
	[30,16,99]
];