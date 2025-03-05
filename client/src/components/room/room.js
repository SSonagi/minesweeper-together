import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { joinRoom } from '../../store/actions';
import { TextField, Button, Stack } from "@mui/material";
import './room.css';

const Room = () => {
    const roomNo = useSelector(state => state.roomNo);
    const [room, setRoom] = useState();
    const dispatch = useDispatch();	

    const handleChange = (e) => {
        setRoom(e.target.value);
    };

    const handleEnterClick = () => {
        dispatch(joinRoom(room));
    };

    return (
        <div className='Room'>
            <div className='Current'>
                Room: {roomNo}
            </div>
            <div className='Join'>
                Join a new room?
                <Stack direction="row" 
                    alignItems="center" 
                    style={{ 
                        color: '#FFFFFF',
                        marginTop: '3px', 
                        maxWidth: '250px'
                    }}
                >
                    <TextField
                        variant="outlined"
                        size="small"
                        value={room}
                        onChange={handleChange}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleEnterClick();
                            }
                        }}
                        sx={{
                            borderRadius: '8px',
                            backgroundColor: '#4A4A4A',
                            "& .MuiOutlinedInput-root": {
                                borderRadius: '8px',
                                backgroundColor: '#373737',
                                "& fieldset": { borderColor: "gray" },
                                "&:hover fieldset": { borderColor: "whitesmoke" },
                                "&.Mui-focused fieldset": { borderColor: "whitesmoke" },
                            },
                            input: { 
                                color: "whitesmoke", 
                                letterSpacing: '1px', 
                                padding: "5px 12px 5px 12px" 
                            },
                        }}
                    />
                    <Button 
                        variant="contained" 
                        onClick={handleEnterClick}
                        sx={{
                            minWidth: "50px",
                            padding: "3px 12px",
                            backgroundColor: "#gray",
                            borderRadius: '8px',
                            marginLeft: '10px'
                        }}
                    >
                        JOIN
                    </Button>
                </Stack>
            </div>
        </div>
        
    )
}

export default Room;