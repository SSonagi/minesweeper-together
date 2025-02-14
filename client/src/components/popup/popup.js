import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { styled } from '@mui/material/styles';
import { login } from '../../store/actions';
import './popup.css'

const NameField = styled(TextField)({
    '& .MuiFilledInput-root': {
        '&:before': {
            borderBottom: '1px solid #E0E3E7',
        },
        '&:hover:before': {
            borderBottom: '1px solid #696969',
        },
        '&:hover:after': {
            borderBottom: '1px solid #E0E3E7',
        },
        '&:after': {
            borderBottom: '0px solid #F00',
        }
    }
});

const Popup = ({
    setShowPopup
}) => {
    const dispatch = useDispatch();	
    const [ name, setName ] = useState("");
    
    const onPlay = () => {
        dispatch(login(name))
        setShowPopup();
    };

    return (
        <div className='Barrier'>
            <div className='Popup'>
                <div className='Username'>
                    Name:
                    <NameField
                        size='small'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant='filled'
                        sx={{
                            input: {
                                color: '#FFFFFF',
                                fontSize: 'calc(6px + 1vw)',
                                padding: '5px 10px'
                            }
                        }}
                    />
                </div>
                <Button
                    variant='contained'
                    size='small'
                    onClick={() => onPlay()}
                >
                    Play
                </Button>
            </div>
        </div>
    )
}

export default Popup;