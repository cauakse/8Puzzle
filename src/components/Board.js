import React from 'react';
import './Board.css';

const Board = ({
  board,
  onCellClick,
  isGoalBoard = false,
  className = '',
  animating = false
}) => {
  const handleCellClick = (row, col) => {
    if (onCellClick && !animating) {
      if (isGoalBoard) {
        // Para o tabuleiro objetivo, não fazemos nada no clique simples
        return;
      }
      onCellClick(row, col);
    }
  };

  const handleDragStart = (e, row, col) => {
    if (board[row][col] === 0 || !isGoalBoard) return; // Só permite arrastar no tabuleiro objetivo
    e.dataTransfer.setData('text/plain', JSON.stringify({ row, col, value: board[row][col] }));
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const isSolvable = (board) => {
    const flatBoard = board.flat().filter(n => n !== 0);

    let inversions = 0;
    for (let i = 0; i < flatBoard.length; i++) {
      for (let j = i + 1; j < flatBoard.length; j++) {
        if (flatBoard[i] > flatBoard[j]) {
          inversions++;
        }
      }
    }

    return inversions % 2 === 0;
  };


  const handleDrop = (e, targetRow, targetCol) => {
    e.preventDefault();
    if (!isGoalBoard) return;

    const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
    if (onCellClick) {
      const newBoard = board.map(row => [...row]);
      const temp = newBoard[targetRow][targetCol];
      newBoard[targetRow][targetCol] = dragData.value;
      newBoard[dragData.row][dragData.col] = temp;

      // valida se o novo estado é solucionável
      if (isSolvable(newBoard)) {
        onCellClick(dragData.row, dragData.col, targetRow, targetCol);
      } else {
        alert("Esse estado não é solucionável!");
      }
    }
  };

  return (
    <div className={`board ${className} ${animating ? 'animating' : ''}`}>
      <h3>{isGoalBoard ? 'Estado Final Desejado' : 'Estado Atual'}</h3>
      <div className="board-grid">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`cell ${cell === 0 ? 'empty' : ''} ${isGoalBoard ? 'goal-cell' : ''}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              draggable={cell !== 0 && isGoalBoard}
              onDragStart={(e) => handleDragStart(e, rowIndex, colIndex)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
            >
              {cell !== 0 && cell}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Board;
