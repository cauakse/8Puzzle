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

const misplacedCountHeuristic = (state, goalState) => {
  let misplacedCount = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (state[i][j] !== 0 && state[i][j] !== goalState[i][j]) {
        misplacedCount++;
      }
    }
  }
  return misplacedCount;
}

const manhattanDistanceHeuristic = (state, goalState) => {
  let totalDistance = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const value = state[i][j];
      //achar qual o lugar ele deveria estar
      for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
          if (goalState[x][y] === value) {
            //calcular a distancia manhattan
            const distance = Math.abs(i - x) + Math.abs(j - y);
            totalDistance += distance;
          }
        }
      }
    }
  }
  return totalDistance;
}

const calculateHeuristic = (state, goalState, heuristicType) => {
  if (heuristicType === 'misplaced') {
    return misplacedCountHeuristic(state, goalState);
  } else { // 'manhattan'
    return manhattanDistanceHeuristic(state, goalState);
  }
};

export const aStarSearch1 = async (initialState, goalState, heuristic) => {
  const queue = new PriorityQueue({
    comparator: (a, b) =>
      calculateHeuristic(a.matriz, goalState, heuristic) +
      a.deph -
      (calculateHeuristic(b.matriz, goalState, heuristic) + b.deph),
  });

  let visited = new Set();
  let nodesExplored = 0;
  let startExecutionTime = Date.now();
  let path = [];

  queue.queue({ matriz: initialState, deph: 0, parent: null });
  let notFound = true;

  while (queue.length > 0 && notFound) {
    const currentState = queue.dequeue();
    visited.add(JSON.stringify(currentState.matriz));
    if (areStatesEqual(currentState.matriz, goalState)) {
      path = reconstructPath(currentState.parent);
      notFound = false;
    } else {
      const sons = generatePossibleMoves(currentState.matriz);
      sons.forEach((son) => {
        if (!visited.has(JSON.stringify(son.state)))
          queue.queue({ matriz: son.state, deph: currentState.deph + 1, parent: currentState });
      });
    }
    nodesExplored++;
  }

  let endExecutionTime = Date.now();
  path.push(goalState);
  return {
    found: !notFound,
    path: path,
    nodesExplored: nodesExplored,
    executionTime: endExecutionTime - startExecutionTime + "ms",
    message: notFound ? "Não encontrado em nivel 1" : "Encontrado em nivel 1",
  };
};

const reconstructPath = (node) => {
  const path = [];
  let current = node;
  while (current !== null) {
    path.unshift(current.matriz); // Adiciona o estado no início do array
    current = current.parent;
  }
  return path;
};

export const aStarSearch2 = async (initialState, goalState, heuristic) => {
  const queue = new PriorityQueue({
    comparator: (a, b) => a.heuristic + a.deph - (b.heuristic + b.deph),
  });
  let visited = new Set();
  let nodesExplored = 0;
  let startExecutionTime = Date.now();
  let path = [];
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

  queue.queue({ matriz: initialState, deph: 0, heuristic: initialHeuristic, parent: null });
  let notFound = true;
  while (queue.length > 0 && notFound) {
    const currentState = queue.dequeue();
    visited.add(JSON.stringify(currentState.matriz));
    nodesExplored++;
    if (areStatesEqual(currentState.matriz, goalState)) {
      path = reconstructPath(currentState.parent);
      notFound = false;
    } else {
      //heuristica do pai vai ser a heuristica menor dos filhos
      const sons = generatePossibleMoves(currentState.matriz);
      sons.forEach((son) => {

        if (!visited.has(JSON.stringify(son.state))) {
          let minHeuristic = null;
          const nivel2Sons = generatePossibleMoves(son.state);
          nivel2Sons.forEach((nivel2Son) => {
            const h = calculateHeuristic(nivel2Son.state, goalState, heuristic);
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
            parent: currentState,
          });
        }
      });
    }
  }
  let endExecutionTime = Date.now();
  path.push(goalState);
  return {
    found: !notFound,
    path: path,
    nodesExplored: nodesExplored,
    executionTime: endExecutionTime - startExecutionTime + "ms",
    message: notFound ? "Não encontrado em nivel 2" : "Encontrado em nivel 2",
  };
};

// IMPLEMENTAR: Algoritmo Best First Search (nível 1 e nível 2)
export const bfsSearch1 = async (initialState, goalState, heuristic) => {
  const queue = new PriorityQueue({
    comparator: (a, b) =>
      calculateHeuristic(a.matriz, goalState, heuristic) -
      calculateHeuristic(b.matriz, goalState, heuristic),
  });

  let visited = new Set();
  let nodesExplored = 0;
  let startExecutionTime = Date.now();
  let path = [];

  queue.queue({ matriz: initialState, parent: null });
  let notFound = true;

  while (queue.length > 0 && notFound) {
    const currentState = queue.dequeue();
    visited.add(JSON.stringify(currentState.matriz));

    if (areStatesEqual(currentState.matriz, goalState)) {
      path = reconstructPath(currentState.parent);
      notFound = false;
    } else {
      const sons = generatePossibleMoves(currentState.matriz);
      sons.forEach((son) => {
        if (!visited.has(JSON.stringify(son.state))) {
          queue.queue({ matriz: son.state, parent: currentState });
        }
      });
    }
    nodesExplored++;
  }

  let endExecutionTime = Date.now();
  path.push(goalState);
  return {
    found: !notFound,
    path: path,
    nodesExplored: nodesExplored,
    executionTime: endExecutionTime - startExecutionTime + "ms",
    message: notFound ? "Não encontrado em Best-First nível 1" : "Encontrado em Best-First nível 1",
  };
};

export const bfsSearch2 = async (initialState, goalState, heuristic = "manhattan") => {
  const queue = new PriorityQueue({
    comparator: (a, b) => a.heuristic - b.heuristic,
  });

  let visited = new Set();
  let nodesExplored = 0;
  let startExecutionTime = Date.now();
  let path = [];

  // caso inicial já seja objetivo
  if (areStatesEqual(initialState, goalState)) {
    return {
      found: true,
      path: [goalState],
      nodesExplored: 0,
      executionTime: "0ms",
      message: "Encontrado em Best-First nível 2",
    };
  }

  // calcular heurística inicial usando lookahead nível 2:
  // para cada filho do inicial, pega o menor h() entre os filhos desse filho
  let initialHeuristic = null;
  const initialMoves = generatePossibleMoves(initialState);
  initialMoves.forEach((move) => {
    const nivel2Sons = generatePossibleMoves(move.state);
    let minHForMove = null;
    nivel2Sons.forEach((n2) => {
      const h = calculateHeuristic(n2.state, goalState, heuristic);
      if (minHForMove === null || h < minHForMove) minHForMove = h;
    });
    // fallback: se não houver filhos de nível 2 (raro), usa h do próprio filho
    if (minHForMove === null) {
      minHForMove = calculateHeuristic(move.state, goalState, heuristic);
    }
    if (initialHeuristic === null || minHForMove < initialHeuristic) initialHeuristic = minHForMove;
  });

  if (initialHeuristic === null) {
    initialHeuristic = calculateHeuristic(initialState, goalState, heuristic);
  }

  queue.queue({ matriz: initialState, heuristic: initialHeuristic, parent: null });
  let notFound = true;

  while (queue.length > 0 && notFound) {
    const currentState = queue.dequeue();
    visited.add(JSON.stringify(currentState.matriz));

    if (areStatesEqual(currentState.matriz, goalState)) {
      path = reconstructPath(currentState.parent);
      notFound = false;
      break;
    }

    const sons = generatePossibleMoves(currentState.matriz);
    sons.forEach((son) => {
      const key = JSON.stringify(son.state);
      if (!visited.has(key)) {
        // calcula heurística do 'son' como o menor h() entre os filhos do son (nível 2)
        const nivel2Sons = generatePossibleMoves(son.state);
        let minHeuristic = null;
        nivel2Sons.forEach((n2) => {
          const h = calculateHeuristic(n2.state, goalState, heuristic);
          if (minHeuristic === null || h < minHeuristic) minHeuristic = h;
        });
        if (minHeuristic === null) {
          minHeuristic = calculateHeuristic(son.state, goalState, heuristic);
        }
        son.heuristic = minHeuristic;
        queue.queue({
          matriz: son.state,
          heuristic: son.heuristic,
          parent: currentState,
        });
      }
    });

    nodesExplored++;
  }

  let endExecutionTime = Date.now();
  path.push(goalState);
  return {
    found: !notFound,
    path: path,
    nodesExplored: nodesExplored,
    executionTime: endExecutionTime - startExecutionTime + "ms",
    message: notFound ? "Não encontrado em Best-First nível 2" : "Encontrado em Best-First nível 2",
  };
};

