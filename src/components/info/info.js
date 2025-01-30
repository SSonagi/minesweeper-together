import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateElapsedTime } from '../../store/actions';

const Info = () => {
    const enableTimer = useSelector(state => state.enableTimer);
	const elapsedTime = useSelector(state => state.elapsedTime);
    const mineCount = useSelector(state => state.mineCount);
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
	}, [enableTimer]);

    return (
        <div style={{ color: '#FFFFFF', fontSize: '25px'}}>
            Mines: {mineCount - flagCount} Time: {elapsedTime}
        </div>
    )
}

export default Info;