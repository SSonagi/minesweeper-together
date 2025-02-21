import React, { useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { restartGame } from '../../../store/actions';
import Select from '@mui/material/Select';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { MainContext } from '../Context';

const Difficulty = (
) => {
    const dispatch = useDispatch();	
    const difficultyState = useContext(MainContext)[0];

    const handleDifficultyChange = useCallback((event) => {
        dispatch(restartGame(event.target.value));
    },[dispatch]);

    return (
        <FormControl sx={{ m: 1, maxWidth: 150, width: '15vw', minWidth: 85, margin: '2px', marginBottom: '10px' }}>
            <Select 
                autoWidth
                value={difficultyState} 
                id="difficulty-select" 
                onChange={handleDifficultyChange}
                sx={{
                    height: '2.5rem',
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'gray'
                    },
                    '& .MuiSvgIcon-root': {
                        color: 'white'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'gray',
                    },
                }}
                MenuProps={{
                    PaperProps: {
                        sx: {
                            bgcolor: "#4A4A4A", // Change background color
                            color: 'white'
                        },
                    },
                }}
            >
                <ListSubheader sx={{ color: 'white', bgcolor: "#2B2B2B" }}>Easy - 10 Mines</ListSubheader>
                <MenuItem value={0}>8 x 8 - 15.6%</MenuItem>
                <MenuItem value={1}>9 x 9 - 12.3%</MenuItem>
                <MenuItem value={2}>10 x 10 - 10%</MenuItem>
                <ListSubheader sx={{ color: 'white', bgcolor: "#2B2B2B" }}>Medium - 40 Mines</ListSubheader>
                <MenuItem value={3}>15 x 13 - 20.5%</MenuItem>
                <MenuItem value={4}>16 x 13 - 19.2%</MenuItem>
                <MenuItem value={5}>15 x 14 - 19.0%</MenuItem>
                <MenuItem value={6}>16 x 14 - 17.9%</MenuItem>
                <MenuItem value={7}>15 x 15 - 17.8%</MenuItem>
                <MenuItem value={8}>16 x 15 - 16.7%</MenuItem>
                <MenuItem value={9}>16 x 16 - 15.6%</MenuItem>
                <ListSubheader sx={{ color: 'white', bgcolor: "#2B2B2B" }}>Hard - 99 Mines</ListSubheader>
                <MenuItem value={10}>30 x 16 - 20.6%</MenuItem>
            </Select>
        </FormControl>
    );
};

export default Difficulty;