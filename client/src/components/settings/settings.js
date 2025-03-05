import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { restartGame, startVersus } from '../../store/actions';
import IconButton from '@mui/material/IconButton';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import { MainContext } from './Context';
import './settings.css'

const Settings = (
) => {
    const dispatch = useDispatch();	
    const players = useSelector(state => state.players);
    const [ difficultyState, showError ] = useContext(MainContext);
    const [ showSettings, setShowSettings ] = useState(false);
    const [ showVersus, setShowVersus ] = useState(false);

    const onClickRestart = useCallback(() => {
		dispatch(restartGame(difficultyState));
    }, [difficultyState, dispatch]);

    const onClickSettings = useCallback(() => {
        setShowSettings(!showSettings);
    }, [showSettings]);

    useEffect(() => {
        setShowVersus(players.length >= 2);
    }, [players])

    const onClickVersus = useCallback(() => {
        dispatch(restartGame(difficultyState));
        dispatch(startVersus());
    }, [difficultyState, dispatch])

    return (
        <div className="setup">
            { showVersus && 
                <Button
                    variant='contained'
                    size='small'
                    style={{
                        color: '#FFFFFF', 
                        backgroundColor: '#FF5B61'
                    }}
                    onClick={onClickVersus}
                >
                    START VERSUS
                </Button>
            }
            <IconButton color='primary' onClick={onClickSettings}>
                <SettingsIcon/>
            </IconButton>
            <IconButton color='primary' onClick={onClickRestart}>
                <RestartAltIcon/>
            </IconButton>
            { showSettings && 
                <div className='Settings'>
                    Change Difficulty: 
                    { showError &&
                        <div className='Error'>
                            That room is full!
                        </div>
                    }
                </div>
            }
        </div>
    );
};

export default Settings;