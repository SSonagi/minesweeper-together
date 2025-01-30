import Cell from '../cell/cell';
import './board.css';

const Board = ({
	width,
	height,
}) => {
	return (
        <div style={{width: String(width * 40 + width) + 'px'}} className='Board'>
            {Array(width * height).fill().map((_, i) =>     
                <Cell x={i % width} y={Math.floor(i / width)} onClickHandler={() => {}}></Cell>
            )}
        </div>
	);
};

export default Board;