import React from 'react';
import './Sidebar.css';

const Sidebar = ({
  selectedAlgorithm,
  setSelectedAlgorithm,
  selectedDepth,
  setSelectedDepth,
  onShuffle,
  onSolve,
  isShuffling,
  isSolving,
  selectedHeuristic,
  setSelectedHeuristic
}) => {
  return (
    <div className="sidebar">
      <h2>8-Puzzle Solver</h2>
      
      <div className="section">
        <h3>Algoritmo de Busca</h3>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="algorithm"
              value="astar"
              checked={selectedAlgorithm === 'astar'}
              onChange={(e) => setSelectedAlgorithm(e.target.value)}
            />
            A* (A-Star)
          </label>
          <label>
            <input
              type="radio"
              name="algorithm"
              value="bfs"
              checked={selectedAlgorithm === 'bfs'}
              onChange={(e) => setSelectedAlgorithm(e.target.value)}
            />
            Best First
          </label>
        </div>
      </div>

      <div className='section'>
       <h3>Heuristica</h3>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="heuristic"
              value="manhattan"
              checked={selectedHeuristic === 'manhattan'}
              onChange={(e) => setSelectedHeuristic(e.target.value)}
            />
            Manhattan
          </label>
          <label>
            <input
              type="radio"
              name="heuristic"
              value="misplaced"
              checked={selectedHeuristic === 'misplaced'}
              onChange={(e) => setSelectedHeuristic(e.target.value)}
            />
            Quadrados fora do lugar
          </label>
        </div>
      </div>
      

      <div className="section">
        <h3>Profundidade</h3>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="depth"
              value="1"
              checked={selectedDepth === '1'}
              onChange={(e) => setSelectedDepth(e.target.value)}
            />
            Nível 1
          </label>
          <label>
            <input
              type="radio"
              name="depth"
              value="2"
              checked={selectedDepth === '2'}
              onChange={(e) => setSelectedDepth(e.target.value)}
            />
            Nível 2
          </label>
        </div>
      </div>

      <div className="section">
        <h3>Ações</h3>
        <button
          className="action-button shuffle-button"
          onClick={onShuffle}
          disabled={isShuffling || isSolving}
        >
          {isShuffling ? 'Embaralhando...' : 'Embaralhar'}
        </button>
        
        <button
          className="action-button solve-button"
          onClick={onSolve}
          disabled={isShuffling || isSolving}
        >
          {isSolving ? 'Resolvendo...' : 'Resolver'}
        </button>
      </div>

      <div className="section">
        <h3>Instruções</h3>
        <div className="instructions">
          <p><strong>Estado Final:</strong> Arraste as peças para configurar o estado desejado.</p>
          <p><strong>Estado Atual:</strong> Clique nas peças adjacentes ao espaço vazio para movê-las.</p>
          <p><strong>Embaralhar:</strong> Realiza 50 movimentos aleatórios com animação.</p>
          <p><strong>Resolver:</strong> Usa o algoritmo selecionado para encontrar a solução.</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
