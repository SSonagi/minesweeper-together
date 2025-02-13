import React from 'react';
import { useSelector } from 'react-redux';
import CircleIcon from '@mui/icons-material/Circle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

const Players = () => {
    const players = useSelector(state => state.players);

    return (
        <List sx={{ width: '100%', maxWidth: 300, fontSize: "25px", color: "#FFFFFF", bgcolor: '#696969', paddingLeft: "10px" }}>
            {players.map((value) => {
                const labelId = `checkbox-list-label-${value}`;

                return (
                <ListItem
                    key={value}
                    disablePadding
                >
                    <ListItemIcon>
                        <CircleIcon sx={{ color: "#FFFFFF" }}/>
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={value } />  
                </ListItem>
                );
            })}
        </List>
    )
}

export default Players;