import React, { useState, useCallback } from 'react';
import Board from './components/Board';
import Sidebar from './components/Sidebar';
import './App.css';
import { aStarSearch1, aStarSearch2 } from './algorithms/searchAlgorithms';

function App() {
  // Estados do puzzle
  const [currentBoard, setCurrentBoard] = useState([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0]
  ]);

  const [goalBoard, setGoalBoard] = useState([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0]
  ]);

  // Estados da interface
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('astar');
  const [selectedDepth, setSelectedDepth] = useState('1');
  const [isShuffling, setIsShuffling] = useState(false);
  const [selectedHeuristic, setSelectedHeuristic] = useState('manhattan');
  const [isSolving, setIsSolving] = useState(false);
  const [solutionInfo, setSolutionInfo] = useState(null); // Estado para informações da solução

  const findPosition = (board, value) => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === value) {
          return [i, j];
        }
      }
    }
    return null;
  };

  const isValidMove = (board, fromRow, fromCol) => {
    const [emptyRow, emptyCol] = findPosition(board, 0);
    
    const rowDiff = Math.abs(fromRow - emptyRow);
    const colDiff = Math.abs(fromCol - emptyCol);
    
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  };

  const movePiece = (board, fromRow, fromCol) => {
    if (!isValidMove(board, fromRow, fromCol)) {
      return board;
    }

    const newBoard = board.map(row => [...row]);
    const [emptyRow, emptyCol] = findPosition(board, 0);
    
    newBoard[emptyRow][emptyCol] = board[fromRow][fromCol];
    newBoard[fromRow][fromCol] = 0;
    
    return newBoard;
  };

  const getPossibleMoves = (board) => {
    const [emptyRow, emptyCol] = findPosition(board, 0);
    const moves = [];
    const directions = [
      [-1, 0], // cima
      [1, 0],  // baixo
      [0, -1], // esquerda
      [0, 1]   // direita
    ];
    
    directions.forEach(([dRow, dCol]) => {
      const newRow = emptyRow + dRow;
      const newCol = emptyCol + dCol;
      
      if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
        moves.push([newRow, newCol]);
      }
    });
    
    return moves;
  };

  const handleCurrentBoardClick = useCallback((row, col) => {
    if (isShuffling || isSolving) return;
    
    const newBoard = movePiece(currentBoard, row, col);
    setCurrentBoard(newBoard);
  }, [currentBoard, isShuffling, isSolving]);

  const handleGoalBoardDrop = useCallback((fromRow, fromCol, toRow, toCol) => {
    const newBoard = goalBoard.map(row => [...row]);
    
    // Troca as posições
    const temp = newBoard[fromRow][fromCol];
    newBoard[fromRow][fromCol] = newBoard[toRow][toCol];
    newBoard[toRow][toCol] = temp;
    
    setGoalBoard(newBoard);
  }, [goalBoard]);

  const shuffleBoard = useCallback(async () => {
    setIsShuffling(true);
    let board = [...currentBoard.map(row => [...row])];
    
    for (let i = 0; i < 50; i++) {
      const possibleMoves = getPossibleMoves(board);
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      
      board = movePiece(board, randomMove[0], randomMove[1]);
      setCurrentBoard([...board.map(row => [...row])]);
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setIsShuffling(false);
  }, [currentBoard]);

  const animateSolution = async (path) => {
    for (const boardState of path) {
      setCurrentBoard(boardState);
      await new Promise(resolve => setTimeout(resolve, 300)); // 300ms de delay entre os passos
    }
  };

  const solveBoard = useCallback(async () => {
    setIsSolving(true);
    setSolutionInfo(null); // Limpa informações anteriores

    let promise;
    if (selectedAlgorithm === 'astar' && selectedDepth === '1') {
      promise = aStarSearch1(currentBoard, goalBoard,selectedHeuristic);
    } else if (selectedAlgorithm === 'astar' && selectedDepth === '2') {
      promise = aStarSearch2(currentBoard, goalBoard, selectedHeuristic);
    } else if (selectedAlgorithm === 'bfs' && selectedDepth === '1') {
      // Chamar a função bfsSearch1 quando implementada
      promise = Promise.resolve({ found: false, message: "BFS Nível 1 não implementado" });
    } else if (selectedAlgorithm === 'bfs' && selectedDepth === '2') {
      // Chamar a função bfsSearch2 quando implementada
      promise = Promise.resolve({ found: false, message: "BFS Nível 2 não implementado" });
    }

    if (promise) {
      const solution = await promise;
      setSolutionInfo({
        nodesExplored: solution.nodesExplored,
        executionTime: solution.executionTime,
        message: solution.message,
        pathLength: solution.path ? solution.path.length : 0
      });

      if (solution.found && solution.path) {
        await animateSolution(solution.path);
      } else {
        alert(solution.message || 'Solução não encontrada.');
      }
    }
    
    setIsSolving(false);
  }, [selectedAlgorithm, selectedDepth, currentBoard, goalBoard]);

  return (
    <div className="app">
      <Sidebar
        selectedAlgorithm={selectedAlgorithm}
        setSelectedAlgorithm={setSelectedAlgorithm}
        selectedDepth={selectedDepth}
        setSelectedDepth={setSelectedDepth}
        selectedHeuristic={selectedHeuristic}
        setSelectedHeuristic={setSelectedHeuristic}
        onShuffle={shuffleBoard}
        onSolve={solveBoard}
        isShuffling={isShuffling}
        isSolving={isSolving}
      />
      
      <div className="main-content">
        <div className="boards-container">
          <Board
            board={currentBoard}
            onCellClick={handleCurrentBoardClick}
            isGoalBoard={false}
            className="current-board"
            animating={isShuffling}
          />
          
          <Board
            board={goalBoard}
            onCellClick={handleGoalBoardDrop}
            isGoalBoard={true}
            className="goal-board"
          />
        </div>
        
        {solutionInfo && (
          <div className="solution-info">
            <h4>Resultados da Busca:</h4>
            <p><strong>{solutionInfo.message}</strong></p>
            <p>Nós explorados: {solutionInfo.nodesExplored}</p>
            <p>Tempo de execução: {solutionInfo.executionTime}</p>
            <p>Passos na solução: {solutionInfo.pathLength}</p>
          </div>
        )}

        <div className="status-info">
          <div className="matrix-display">
            <h4>Estado Atual (Matriz):</h4>
            <pre>{JSON.stringify(currentBoard, null, 2)}</pre>
          </div>
          
          <div className="matrix-display">
            <h4>Estado Final (Matriz):</h4>
            <pre>{JSON.stringify(goalBoard, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
