import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List, ListItem, ListItemText, Paper, TextField, IconButton, Box, Divider } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { sendChat } from '../../store/actions';
import { PLAYERCOLOR } from '../../constants';
import './chat.css';

const Chat = () => {
  const messages = useSelector(state => state.messages || []);
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages.length]);

  return (
    <Paper className="ChatContainer" elevation={2} style={{ backgroundColor: '#2e2e2e', borderRadius: '12px' }}>
      <List className="ChatList" ref={listRef}>
        {messages.map((m, idx) => {
          const name = m.name || 'Unknown';
          const color = (typeof m.color !== 'undefined' && PLAYERCOLOR[m.color]) ? PLAYERCOLOR[m.color] : '#ffffffff';

          return (
            <ListItem key={idx} alignItems="flex-start">
              <ListItemText
                primary={
                    <span className="ChatLine">
                        <span className="ChatName" style={{ color }}>
                            {name}
                        </span>
                        <span className="ChatMessage">
                            {m.message}
                        </span>
                    </span>
                }
              />
            </ListItem>
          );
        })}
      </List>
      <Divider sx={{ backgroundColor: '#444' }} />

      <Box className="ChatInput" sx={{ display: 'flex', padding: '8px' }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Type a message..."
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && text.trim()) {
              dispatch(sendChat(text.trim()));
              setText('');
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { border: 'none' },
              backgroundColor: 'transparent'
            },
            '& .MuiInputBase-input': { color: '#fff' },
            '& .MuiInputBase-input::placeholder': { color: '#bbb' }
          }}
        />
        <IconButton color="primary" sx={{ ml: 1 }} onClick={() => {
          if (text.trim()) {
            dispatch(sendChat(text.trim()));
            setText('');
          }
        }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default Chat;
