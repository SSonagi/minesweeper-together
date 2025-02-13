import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { joinRoom } from '../../store/actions';
import { TextField, Button, Stack } from "@mui/material";

const Room = () => {
    const roomNo = useSelector(state => state.roomNo);
    const [room, setRoom] = useState(roomNo);
    const dispatch = useDispatch();	

    useEffect(() => {
        setRoom(roomNo);
    }, [roomNo]);

    const handleChange = (e) => {
        // Allow only 4 digits
        const inputValue = e.target.value.replace(/\D/g, "").slice(0, 4);
        setRoom(inputValue);
    };

    const handleEnterClick = () => {
        console.log("Entering room:", room);
        dispatch(joinRoom(room));
    };

    return (
        <Stack direction="row" alignItems="center" style={{ color: '#FFFFFF', fontSize: '25px'}}>
            <div style={{marginBottom: "5px"}}>
                Room:
            </div>
            <TextField
                variant="filled"
                size="small"
                value={room}
                onChange={handleChange}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleEnterClick();
                    }
                }}
                slotProps={{
                    maxLength: 4,
                }}
                sx={{
                    marginLeft: "10px",
                    width: "95px",
                    backgroundColor: '#4A4A4A',
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "gray" },
                        "&:hover fieldset": { borderColor: "white" },
                        "&.Mui-focused fieldset": { borderColor: "white" },
                    },
                    input: { color: "white", letterSpacing: "5px", fontSize: "25px", padding: "0px 10px 0px 10px" },
                    }}
            />
            <Button 
                variant="contained" 
                onClick={handleEnterClick}
                sx={{
                    minWidth: "50px",
                    padding: "5px 0px",
                    backgroundColor: "#gray"
                }}
            >
                JOIN
            </Button>
        </Stack>
    )
}

export default Room;