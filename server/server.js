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
        origin: ["http://minesweepertogether.com", "https://minesweepertogether.com"],
        // origin: "http://localhost:3000",
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
let players = {};
let playerNo = {};
let boardMode = {};

const updateBoard = async (roomNo) => {
    io.in(roomNo).emit("updateBoard", [
        roomNo,
        gameState[roomNo],
        difficulty[roomNo],
        boardData[roomNo],
        flagCount[roomNo],
        boardMode[roomNo]
    ]);
}

const updatePlayers = async (roomNo) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomNo));
    let names = [];
    for (const ids of clients) {
        names.push(players[ids]);
    }
    io.in(roomNo).emit("updatePlayers", names);
}

const resetScores = async (roomNo) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomNo));
    for (const ids of clients) {
        players[ids][2] = 0;
    }
}

const leaveRoom = async (roomNo) => {
    const clients = io.sockets.adapter.rooms.get(roomNo);
    if (clients) {
        updatePlayers(roomNo);
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
    playerNo[roomNo] = [0,1,2,3];
    boardMode[roomNo] = "coop";
}

io.on("connection", (socket) => {
    let roomNo = 0
    do {
        roomNo = Math.floor(Math.random() * 9999);
    } while (boardData[roomNo]);

    socket.join(roomNo);
    setupRoom(roomNo);

    let num = playerNo[roomNo].shift();
    players[socket.id] = ["", num, 0];
    playerNo[roomNo].push(num);

    console.log(`User connected: ${socket.id}, Room number: ${roomNo}`);

    socket.on("login", (data) => {
        players[socket.id][0] = data.name;
        updateBoard(roomNo);
        updatePlayers(roomNo);
    });

    socket.on("restart", (data) => {
        gameState[roomNo] = GAME.READY;
        difficulty[roomNo] = data.difficulty;
        boardData[roomNo] = initBoard(difficulty[roomNo]);
        flagCount[roomNo] = 0;
        openedCellCount[roomNo] = 0;
        boardMode[roomNo] = "coop";
        updateBoard(roomNo);
        resetScores(roomNo);
        updatePlayers(roomNo);
    });

    socket.on("joinRoom", (data) => {
        let curr_occupancy = io.sockets.adapter.rooms.get(Number(data.roomNo));
        if ( curr_occupancy && Array.from(curr_occupancy).length >= 4 ) {
            io.to(socket.id).emit("roomFull");
        } else {
            socket.leave(roomNo);

            playerNo[roomNo].splice(playerNo[roomNo].indexOf(players[socket.id][1]), 1);
            playerNo[roomNo].unshift(players[socket.id][1]);

            players[socket.id][2] = 0;
    
            leaveRoom(roomNo);
    
            roomNo = Number(data.roomNo);
    
            if (!io.sockets.adapter.rooms.get(roomNo)) {
                setupRoom(roomNo);
            }
    
            let num = playerNo[roomNo].shift();
            players[socket.id][1] = num;
            playerNo[roomNo].push(num);
    
            socket.join(roomNo);
            updateBoard(roomNo);
            updatePlayers(roomNo);
        }
    })

    socket.on("versus", () => {
        boardMode[roomNo] = "versus";
        io.in(roomNo).emit("startVersus");
        updateBoard(roomNo);
    });

    socket.on("clickCell", (data) => {
        const x = data.x;
        const y = data.y;
        const cellCode = boardData[roomNo][y][x];
        gameState[roomNo] = GAME.RUN;
        
        const openCell = (code, x, y) => {
            if (code === CODES.MINE) {
                switch(boardMode[roomNo]) {
                    case "coop":
                        gameState[roomNo] = GAME.LOSE;
                        break;
                    case "versus":
                        boardData[roomNo][y][x] = flagCell(cellCode, players[socket.id][1]);
                        flagCount[roomNo] += getFlagCount(cellCode);

                        players[socket.id][2] -= 200;
                        break;
                }
            }
            else if (code === CODES.NOTHING) {
                const expandResult = expandCell(boardData[roomNo], x, y);
                boardData[roomNo] = expandResult.boardData;
                openedCellCount[roomNo] += expandResult.openedCellCount;

                players[socket.id][2] += 10 * expandResult.openedCellCount;

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
        updatePlayers(roomNo);
        updateBoard(roomNo);
    });

    socket.on("rightClick", (data) => {
        const cellCode2 = boardData[roomNo][data.y][data.x];
        if (cellCode2 !== CODES.OPENED) {
            if (cellCode2 === CODES.MINE) {
                players[socket.id][2] += 100;
                updatePlayers(roomNo);
            }
            boardData[roomNo][data.y][data.x] = flagCell(cellCode2, players[socket.id][1]);
            flagCount[roomNo] += getFlagCount(cellCode2);
        }   
        updateBoard(roomNo);
    });

    socket.on("disconnect", () => {
        playerNo[roomNo].splice(playerNo[roomNo].indexOf(players[socket.id][1]), 1);
        playerNo[roomNo].unshift(players[socket.id][1]);

        socket.leave(roomNo);

        leaveRoom(roomNo);
        console.log(`User disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));