import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateElapsedTime } from '../../store/actions';
import { DIFFICULTY } from '../../constants';

const Info = () => {
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
        <div style={{ color: '#FFFFFF', fontSize: 'calc(15px + 1vw)', marginLeft: 'auto'}}>
            Mines: {mineCount - flagCount} Time: {elapsedTime}
        </div>
    )
}

export default Info;