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

  const handleDrop = (e, targetRow, targetCol) => {
    e.preventDefault();
    if (!isGoalBoard) return; // Só permite drop no tabuleiro objetivo
    
    const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
    if (onCellClick) {
      onCellClick(dragData.row, dragData.col, targetRow, targetCol);
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
