import Cell from '../cell/cell';
import './board.css';
import { useDispatch, useSelector } from 'react-redux';
import { DIFFICULTY, GAME } from '../../constants';
import { Button } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { restartGame, startVersus } from '../../store/actions';

const Board = ({
	difficulty,
    boardData
}) => {
    const dispatch = useDispatch();	
    const width = DIFFICULTY[difficulty][0];
    const height = DIFFICULTY[difficulty][1];
    const players = useSelector(state => state.players);
    const gameState = useSelector(state => state.gameState);
    const [ showControl, setShowControl ] = useState(true);
    const [ showVersus, setShowVersus ] = useState(false);

    useEffect(() => {
        setShowVersus(players.length >= 2);
    }, [players]);

    useEffect(() => {
        console.log(gameState);
        switch(gameState) {
            case(GAME.READY):
                setShowControl(true);
                break;
            default:
                setShowControl(false);
        }
    }, [gameState]);

    const onClickVersus = useCallback(() => {
        dispatch(restartGame(difficulty));
        dispatch(startVersus());
    }, [difficulty, dispatch]);

    const onClickClassic = useCallback(() => {
        setShowControl(false);
    });

 	return (
        <div style={{width: String(width * 40 + width) + 'px'}} className='Board'>
            { showControl &&
                <div 
                    className='BoardBarrier'
                    style={{
                        width: String(width * 40 + width) + 'px',
                        height: String(height * 40 + height) + 'px'
                    }}
                >
                    <Button
                        variant='contained'
                        size='small'
                        style={{
                            color: '#FFFFFF', 
                            backgroundColor: '#4dafe0',
                            borderRadius: '12px'
                        }}
                        onClick={onClickClassic}
                    >
                        Classic
                    </Button>
                    { showVersus && 
                        <Button
                            variant='contained'
                            size='small'
                            style={{
                                color: '#FFFFFF', 
                                backgroundColor: '#FF5B61',
                                borderRadius: '12px'
                            }}
                            onClick={onClickVersus}
                        >
                            Versus
                        </Button>
                    }
                </div>
            }
            {Array(width * height).fill().map((_, i) =>     
                <Cell x={i % width} y={Math.floor(i / width)} boardData={boardData} onClickHandler={() => {}}></Cell>
            )}
        </div>
	);
};

export default Board;