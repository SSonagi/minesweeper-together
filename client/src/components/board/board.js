import Cell from '../cell/cell';
import './board.css';
import { DIFFICULTY } from '../../constants';

const Board = ({
	difficulty,
    boardData
}) => {
    const width = DIFFICULTY[difficulty][0];
    const height = DIFFICULTY[difficulty][1];

 	return (
        <div style={{width: String(width * 40 + width) + 'px'}} className='Board'>
            {Array(width * height).fill().map((_, i) =>     
                <Cell x={i % width} y={Math.floor(i / width)} boardData={boardData} onClickHandler={() => {}}></Cell>
            )}
        </div>
	);
};

export default Board;