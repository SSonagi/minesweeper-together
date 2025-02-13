import { flagCell, initBoard, expandCell, getFlagCount } from './logic.js';
import { CODES, GAME, DIFFICULTY } from './constants.js';

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        //origin: ["http://minesweepertogether.com", "https://minesweepertogether.com"],
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    },
});
  
app.use(cors());

let gameState = {};
let boardData = {};
let difficulty = {};
let flagCount = {};
let openedCellCount = {};

const updateBoard = async (roomNo) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomNo));

    io.in(roomNo).emit("updateBoard", [
        roomNo,
        gameState[roomNo],
        difficulty[roomNo],
        boardData[roomNo],
        flagCount[roomNo],
        clients
    ]);
}

const cleanRoom = async (roomNo) => {
    const clients = io.sockets.adapter.rooms.get(roomNo);
    if (clients) {
        updateBoard(roomNo);
    } else {
        setupRoom(roomNo);
    }
}

const setupRoom = (roomNo) => {
    gameState[roomNo] = GAME.READY;
    boardData[roomNo] = initBoard(0);
    difficulty[roomNo] = 0;
    flagCount[roomNo] = 0;
    openedCellCount[roomNo] = 0;
}

io.on("connection", (socket) => {
    let roomNo = Math.floor(Math.random() * 9999);
    socket.join(roomNo);

    setupRoom(roomNo);

    console.log(`User connected: ${socket.id}, Room number: ${roomNo}`);
    updateBoard(roomNo);

    socket.on("restart", (data) => {
        gameState[roomNo] = GAME.READY;
        difficulty[roomNo] = data.difficulty;
        boardData[roomNo] = initBoard(difficulty[roomNo]);
        flagCount[roomNo] = 0;
        openedCellCount[roomNo] = 0;
        updateBoard(roomNo);
    });

    socket.on("joinRoom", (data) => {
        socket.leave(roomNo);
        cleanRoom(roomNo);
        roomNo = Number(data.roomNo);
        if (!io.sockets.adapter.rooms.get(roomNo)) {
            setupRoom(roomNo);
        }
        socket.join(roomNo);
        updateBoard(roomNo);
    })

    socket.on("clickCell", (data) => {
        const x = data.x;
        const y = data.y;
        const cellCode = boardData[roomNo][y][x];
        gameState[roomNo] = GAME.RUN;
        
        const openCell = (code, x, y) => {
            if (code === CODES.MINE) {
                gameState[roomNo] = GAME.LOSE;
            }
            else if (code === CODES.NOTHING) {
                const expandResult = expandCell(boardData[roomNo], x, y);
                boardData[roomNo] = expandResult.boardData;
                openedCellCount[roomNo] += expandResult.openedCellCount;

                if (DIFFICULTY[difficulty[roomNo]][0] * DIFFICULTY[difficulty[roomNo]][1] - DIFFICULTY[difficulty[roomNo]][2] === openedCellCount[roomNo]) {
                    gameState[roomNo] = GAME.WIN;
                    flagCount[roomNo] = DIFFICULTY[difficulty[roomNo]][2];
                }
            }
        }

        if (cellCode >= CODES.OPENED) {
            let aroundCode = [];
    
            aroundCode = boardData[roomNo][y - 1] ? aroundCode.concat([[y - 1, x - 1]], [[y - 1, x]], [[y - 1, x + 1]]) : aroundCode;
            aroundCode = aroundCode.concat([[y, x - 1]], [[y, x + 1]]);
            aroundCode = boardData[roomNo][y + 1] ? aroundCode.concat([[y + 1, x - 1]], [[y + 1, x]], [[y + 1, x + 1]]) : aroundCode;

            for (const cell of aroundCode) {
                if (boardData[roomNo][cell[0]][cell[1]] === CODES.NOTHING || boardData[roomNo][cell[0]][cell[1]] === CODES.MINE) {
                    openCell(boardData[roomNo][cell[0]][cell[1]], cell[1], cell[0]);
                }
            }
        }
        else {
            openCell(cellCode, x, y);
        }
        updateBoard(roomNo);
    });

    socket.on("rightClick", (data) => {
        const cellCode2 = boardData[roomNo][data.y][data.x];
        if (cellCode2 !== CODES.OPENED) {
            boardData[roomNo][data.y][data.x] = flagCell(cellCode2);
            flagCount[roomNo] += getFlagCount(cellCode2);
        }   
        updateBoard(roomNo);
    });

    socket.on("disconnect", () => {
        socket.leave(roomNo);
        cleanRoom(roomNo);
        console.log(`User disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));