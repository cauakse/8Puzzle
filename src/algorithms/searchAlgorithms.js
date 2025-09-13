import PriorityQueue from "js-priority-queue";

export const areStatesEqual = (state1, state2) => {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (state1[i][j] !== state2[i][j]) {
        return false;
      }
    }
  }
  return true;
};

export const findEmptyPosition = (state) => {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (state[i][j] === 0) {
        return [i, j];
      }
    }
  }
  return null;
};

export const generatePossibleMoves = (state) => {
  const [emptyRow, emptyCol] = findEmptyPosition(state);
  const moves = [];
  const directions = [
    [-1, 0], // cima
    [1, 0], // baixo
    [0, -1], // esquerda
    [0, 1], // direita
  ];

  directions.forEach(([dRow, dCol]) => {
    const newRow = emptyRow + dRow;
    const newCol = emptyCol + dCol;

    if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
      const newState = state.map((row) => [...row]);
      newState[emptyRow][emptyCol] = state[newRow][newCol];
      newState[newRow][newCol] = 0;
      moves.push({
        state: newState,
        move: { from: [newRow, newCol], to: [emptyRow, emptyCol] },
      });
    }
  });

  return moves;
};

export const calculateHeuristic = (state, goalState) => {
  let misplacedCount = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (state[i][j] !== 0 && state[i][j] !== goalState[i][j]) {
        misplacedCount++;
      }
    }
  }
  return misplacedCount;
};

export const aStarSearch1 = async (initialState, goalState) => {
  const queue = new PriorityQueue({
    comparator: (a, b) =>
      calculateHeuristic(a.matriz, goalState) +
      a.deph -
      (calculateHeuristic(b.matriz, goalState) + b.deph),
  });

  let visited = new Set();
  let nodesExplored = 0;
  let startExecutionTime = Date.now();
  let path = [];
  let anterior = initialState;

  queue.queue({ matriz: initialState, deph: 0 });
  let notFound = true;

  while (queue.length > 0 && notFound) {
    const currentState = queue.dequeue();
    path.push({ from: anterior, to: currentState.matriz });
    anterior = currentState.matriz;
    visited.add(JSON.stringify(currentState.matriz));
    if (areStatesEqual(currentState.matriz, goalState)) {
      notFound = false;
    } else {
      const sons = generatePossibleMoves(currentState.matriz);
      sons.forEach((son) => {
        if (!visited.has(JSON.stringify(son.state)))
          queue.queue({ matriz: son.state, deph: currentState.deph + 1 });
      });
    }
    nodesExplored++;
  }

  let endExecutionTime = Date.now();

  return {
    found: !notFound,
    path: path,
    nodesExplored: nodesExplored,
    executionTime: endExecutionTime - startExecutionTime + "ms",
    message: notFound ? "Não encontrado em nivel 1" : "Encontrado em nivel 1",
  };
};

export const aStarSearch2 = async (initialState, goalState) => {
  const queue = new PriorityQueue({
    comparator: (a, b) => a.heuristic + a.deph - (b.heuristic + b.deph),
  });
  let visited = new Set();
  let nodesExplored = 0;
  let startExecutionTime = Date.now();
  let path = [];
  let anterior = initialState;

  // Heurística inicial (nível 2)
  let initialHeuristic = null;
  const initialMoves = generatePossibleMoves(initialState);
  initialMoves.forEach((move) => {
    const h = calculateHeuristic(move.state, goalState);
    if (initialHeuristic === null) {
      initialHeuristic = h;
    } else if (h < initialHeuristic) {
      initialHeuristic = h;
    }
  });

  queue.queue({ matriz: initialState, deph: 0, heuristic: initialHeuristic });
  let notFound = true;
  while (queue.length > 0 && notFound) {
    const currentState = queue.dequeue();
    path.push({ from: anterior, to: currentState.matriz });
    anterior = currentState.matriz;
    visited.add(JSON.stringify(currentState.matriz));
    nodesExplored++;
    if (areStatesEqual(currentState.matriz, goalState)) {
      notFound = false;
    } else {
      //heuristica do pai vai ser a heuristica menor dos filhos
      const sons = generatePossibleMoves(currentState.matriz);
      sons.forEach((son) => {

        if (!visited.has(JSON.stringify(son.state))) {
          let minHeuristic = null;
          const nivel2Sons = generatePossibleMoves(son.state);
          nivel2Sons.forEach((nivel2Son) => {
            const h = calculateHeuristic(nivel2Son.state, goalState);
            if (minHeuristic === null) {
              minHeuristic = h;
            } else if (h < minHeuristic) {
              minHeuristic = h;
            }
          });
          
          son.heuristic = minHeuristic;
          queue.queue({
            matriz: son.state,
            deph: currentState.deph + 1,
            heuristic: son.heuristic,
          });
        }
      });
    }
  }
  let endExecutionTime = Date.now();
  return {
    found: !notFound,
    path: path,
    nodesExplored: nodesExplored,
    executionTime: endExecutionTime - startExecutionTime + "ms",
    message: notFound ? "Não encontrado em nivel 2" : "Encontrado em nivel 2",
  };
};

// IMPLEMENTAR: Algoritmo BFS
export const bfsSearch1 = async (initialState, goalState, depth) => {
  console.log("Executando BFS com profundidade:", depth);
  console.log("Estado inicial:", initialState);
  console.log("Estado objetivo:", goalState);

  // TODO: Implementar BFS
  // Retorno de exemplo
  return {
    found: false,
    path: [],
    nodesExplored: 0,
    executionTime: 0,
    message: "BFS não implementado ainda",
  };
};

export const bfsSearch2 = async (initialState, goalState, depth) => {
  console.log("Executando BFS com profundidade:", depth);
  console.log("Estado inicial:", initialState);
  console.log("Estado objetivo:", goalState);

  // TODO: Implementar BFS
  // Retorno de exemplo
  return {
    found: false,
    path: [],
    nodesExplored: 0,
    executionTime: 0,
    message: "BFS não implementado ainda",
  };
};
