import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateElapsedTime } from '../../store/actions';
import { DIFFICULTY } from '../../constants';
import './info.css'

const Info = ({
	width
}) => {
    const enableTimer = useSelector(state => state.enableTimer);
	const elapsedTime = useSelector(state => state.elapsedTime);
    const mineCount = useSelector(state => DIFFICULTY[state.difficulty][2]);
    const flagCount = useSelector(state => state.flagCount);
    const dispatch = useDispatch();	

    useEffect(() => {
		let gameTimer;

		if (enableTimer) {
			gameTimer = setInterval(() => {
				dispatch(updateElapsedTime());
			}, 1000);
		}

		return () => {
			clearInterval(gameTimer);
		};
	}, [enableTimer, dispatch]);

    return (
        <div className='Info' style={{ width: width }}>
			<div style={{ paddingLeft: '4px' }}>Mines: {mineCount - flagCount}</div>
			<div style={{ paddingRight: '4px' }}>Time: {elapsedTime}</div>
        </div>
    )
}

export default Info;