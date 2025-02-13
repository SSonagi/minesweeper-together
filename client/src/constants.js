export const CODES = {
	OPENED: 0,
	NOTHING: -1,
	FLAG: -2,
	MINE: -3,
	MINE_FLAG: -4,
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