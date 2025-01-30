import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setGame, restartGame } from '../../store/actions';
import Select from '@mui/material/Select';
import ListSubheader from '@mui/material/ListSubheader';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import './settings.css'

const Settings = () => {
    const dispatch = useDispatch();	
    const [difficultyIndex, setDifficultyIndex] = React.useState(0);

    const onClickRestart = useCallback(() => {
        console.log(difficulties[difficultyIndex]);
		dispatch(setGame(difficulties[difficultyIndex]));
		dispatch(restartGame());
	}, [difficultyIndex]);

    const handleDifficultyChange = (event) => {
        setDifficultyIndex(event.target.value);
    };

    const difficulties = [
        [8,8,10],
        [9,9,10],
        [10,10,10],
        [15,13,40],
        [16,13,40],
        [15,14,40],
        [16,14,40],
        [15,15,40],
        [16,15,40],
        [16,16,40],
        [30,16,99]
    ];

    return (
        <div className="setup">
            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel     
                    sx={{
                        color: 'gray',
                        '&.Mui-focused': {
                            color: 'white'
                        }
                    }} 
                    htmlFor="grouped-select"
                >
                    Difficulty
                </InputLabel>
                <Select 
                    autoWidth
                    value={difficultyIndex} 
                    id="difficulty-select" 
                    label="Difficulty"
                    onChange={handleDifficultyChange}
                    sx={{
                        height: '2.5rem',
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'gray'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white'
                        },
                        '& .MuiSvgIcon-root': {
                            color: 'white'
                        },
                        '&.MuiTablePagination-select[aria-expanded="true"]': {
                            border: '2px solid green'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
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
                    <MenuItem value={0}>8 x 8</MenuItem>
                    <MenuItem value={1}>9 x 9</MenuItem>
                    <MenuItem value={2}>10 x 10</MenuItem>
                    <ListSubheader sx={{ color: 'white', bgcolor: "#2B2B2B" }}>Medium - 40 Mines</ListSubheader>
                    <MenuItem value={3}>15 x 13</MenuItem>
                    <MenuItem value={4}>16 x 13</MenuItem>
                    <MenuItem value={5}>15 x 14</MenuItem>
                    <MenuItem value={6}>16 x 14</MenuItem>
                    <MenuItem value={7}>15 x 15</MenuItem>
                    <MenuItem value={8}>16 x 15</MenuItem>
                    <MenuItem value={9}>16 x 16</MenuItem>
                    <ListSubheader sx={{ color: 'white', bgcolor: "#2B2B2B" }}>Hard - 99 Mines</ListSubheader>
                    <MenuItem value={10}>30 x 16</MenuItem>
                </Select>
            </FormControl>
            <IconButton color='button' onClick={onClickRestart}>
                <RestartAltIcon/>
            </IconButton>
        </div>
    );
};

export default Settings;