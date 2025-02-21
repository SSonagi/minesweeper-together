import React from 'react';
import { useSelector } from 'react-redux';
import CircleIcon from '@mui/icons-material/Circle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { PLAYERCOLOR } from '../../constants';

const Players = () => {
    const players = useSelector(state => state.players);

    return (
        <List sx={{ width: '100%', maxWidth: 250, fontSize: "25px", color: "#FFFFFF", bgcolor: '#696969', paddingLeft: "15px", marginTop: '15px' }}>
            {players.map((value) => {
                const labelId = `checkbox-list-label-${value[0]}`;

                return (
                <ListItem
                    key={value}
                    disablePadding
                >
                    <ListItemIcon>
                        <CircleIcon sx={{ color: PLAYERCOLOR[value[1]], fontSize: '18px' }}/>
                    </ListItemIcon>
                    <ListItemText id={labelId} style={{ color: PLAYERCOLOR[value[1]] }} primary={value[0]} />  
                </ListItem>
                );
            })}
        </List>
    )
}

export default Players;