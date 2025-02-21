import React, { useCallback, useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { restartGame } from '../../store/actions';
import IconButton from '@mui/material/IconButton';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import Difficulty from './difficulty/difficulty';
import Room from '../room/room';
import { MainContext } from './Context';
import './settings.css'

const Settings = (
) => {
    const dispatch = useDispatch();	
    const [ difficultyState, showError ] = useContext(MainContext);
    const [ showSettings, setShowSettings ] = useState(false);

    const onClickRestart = useCallback(() => {
		dispatch(restartGame(difficultyState));
    }, [difficultyState, dispatch]);

    const onClickSettings = useCallback(() => {
        setShowSettings(!showSettings);
    }, [showSettings]);

    return (
        <div className="setup">
            <IconButton color='primary' onClick={onClickSettings}>
                <SettingsIcon/>
            </IconButton>
            <IconButton color='primary' onClick={onClickRestart}>
                <RestartAltIcon/>
            </IconButton>
            { showSettings && 
                <div className='Settings'>
                    Change Difficulty: 
                    <Difficulty/>
                    Join a Different Room?
                    <Room/>
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