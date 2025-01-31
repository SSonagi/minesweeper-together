import React, { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clickCell, rightClickCell } from '../../store/actions';
import { CODES, GAME } from '../../constants';
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

const Cell = ({
	x,
	y
}) => {
	const board = useSelector(state => state.boardData[y][x]);
	const gameState = useSelector(state => state.gameState);
	const [playSound] = useSound(OpenCellSound)
	const dispatch = useDispatch();	

	const getCell = useCallback((cellCode) => {
		switch (cellCode) {
			case CODES.OPENED:
				return '';
			case CODES.NOTHING:
				return '';
			case CODES.FLAG:
				return '🚩'
			case CODES.MINE_FLAG:
				switch (gameState) {
					case GAME.WIN:
						return '💣';
					case GAME.LOSE:
						return '💥';
					default:
						return '🚩';
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
        <Button 
			style={cellStyle} 
			color='primary'
			variant={board >= CODES.OPENED ? "outlined" : "contained"}
			onClick={onClick} 
			onContextMenu={onRightClick}>{getCell(board)}
		</Button>
	);
};

export default memo(Cell);