import React, { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clickCell, rightClickCell } from '../../store/actions';
import { CODES, GAME, PLAYERCOLOR } from '../../constants';
import { styled } from '@mui/material/styles';
import FlagIcon from '@mui/icons-material/Flag';
import Button from '@mui/material/Button';
import useSound from 'use-sound'
import OpenCellSound from '../../sound/OpenCell.mp3' // Your sound file path here

const cellSize = '40px';

const cellStyle = {
	maxWidth: cellSize, 
	minWidth: cellSize, 
	maxHeight: cellSize, 
	minHeight: cellSize,
};

const CellButton = styled(Button)({
	boxShadow: '0 0 0.1rem 0',
});

const Cell = ({
	x,
	y,
	boardData
}) => {
	//console.log(boardData);
	// console.log("going for x:" + x + " y:" + y); 
	const board = boardData[y][x];
	const gameState = useSelector(state => state.gameState);
	const [playSound] = useSound(OpenCellSound)
	const dispatch = useDispatch();	

	const getCell = useCallback((cellCode) => {
		switch (cellCode) {
			case CODES.OPENED:
				return '';
			case CODES.NOTHING:
				return '';
			case CODES.FLAG_1:
				return <FlagIcon style={{ color: PLAYERCOLOR[0] }}/>
			case CODES.FLAG_2:
				return <FlagIcon style={{ color: PLAYERCOLOR[1] }}/>
			case CODES.FLAG_3:
				return <FlagIcon style={{ color: PLAYERCOLOR[2] }}/>
			case CODES.FLAG_4:
				return <FlagIcon style={{ color: PLAYERCOLOR[3] }}/>
			case CODES.MINE_FLAG_1:
				switch (gameState) {
					case GAME.WIN:
						return '💣';
					case GAME.LOSE:
						return '💥';
					default:
						return <FlagIcon style={{ color: PLAYERCOLOR[0] }}/>;
				}
			case CODES.MINE_FLAG_2:
				switch (gameState) {
					case GAME.WIN:
						return '💣';
					case GAME.LOSE:
						return '💥';
					default:
						return <FlagIcon style={{ color: PLAYERCOLOR[1] }}/>;
				}
			case CODES.MINE_FLAG_3:
				switch (gameState) {
					case GAME.WIN:
						return '💣';
					case GAME.LOSE:
						return '💥';
					default:
						return <FlagIcon style={{ color: PLAYERCOLOR[2] }}/>;
				}
			case CODES.MINE_FLAG_4:
				switch (gameState) {
					case GAME.WIN:
						return '💣';
					case GAME.LOSE:
						return '💥';
					default:
						return <FlagIcon style={{ color: PLAYERCOLOR[3] }}/>;
				}
			case CODES.MINE:
				switch (gameState) {
					case GAME.WIN:
						return '💣';
					case GAME.LOSE:
						return '💥';
					default:
						return '';
				}
			default:
				return cellCode;
		}
	}, [gameState]);

	const onClick = useCallback(() => {
		if (gameState === GAME.READY || gameState === GAME.RUN) {
			playSound();
			dispatch(clickCell({x, y}));
		}
	}, [gameState, dispatch, playSound, x, y]);

	const onRightClick = useCallback((e) => {
		e.preventDefault();

		if (gameState === GAME.READY || gameState === GAME.RUN) {
			playSound();
			dispatch(rightClickCell({x, y}))
		}
	}, [gameState, dispatch, playSound, x, y]);

	return (
        <CellButton 
			style={cellStyle} 
			color='primary'
			variant={board >= CODES.OPENED ? "outlined" : "contained"}
			onClick={onClick} 
			onContextMenu={onRightClick}
		>
			{getCell(board)}
		</CellButton>
	);
};

export default memo(Cell);