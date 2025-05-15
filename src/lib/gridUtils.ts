export const createGrid = (rows: number, cols: number): number[][] => {
  const grid_data: number[][] = [];
  for (let i = 0; i < rows; i++) {
    const row_data = [];
    for (let j = 0; j < cols; j++) {
      row_data.push(0);
    }
    grid_data.push(row_data);
  }
  return grid_data;
};

export const getDiagonals = (grid: number[][], row: number, col: number): number[] => {
  var leftRight: number[] = [0, 0];
  if (row + 1 < grid.length) {
    if (col - 1 >= 0 && grid[row + 1][col - 1] == 0) {
      leftRight[0] = 1;
    }
    if (col + 1 < grid[0].length && grid[row + 1][col + 1] == 0) {
      leftRight[1] = 1;
    }
  }
  return leftRight;
};

export const updateGrid = (grid: number[][]): number[][] => {
  // Create a deep copy of the grid to avoid modifying the original array directly
  // Svelte's reactivity relies on assignments, so returning a new array is crucial.
  const newGrid = grid.map(row => [...row]);

  for (let row = newGrid.length - 1; row >= 0; row--) {
    for (let col = 0; col < newGrid[0].length; col++) {
      if (newGrid[row][col] == 1) { // If current cell is sand
        // Check directly below
        if (row + 1 < newGrid.length && newGrid[row + 1][col] == 0) {
          newGrid[row][col] = 0;
          newGrid[row + 1][col] = 1;
        } 
        // Check diagonals if directly below is blocked or also sand
        else if (row + 1 < newGrid.length) { // Ensure there is a row below
          const canMoveLeft = col - 1 >= 0 && newGrid[row + 1][col - 1] == 0;
          const canMoveRight = col + 1 < newGrid[0].length && newGrid[row + 1][col + 1] == 0;

          if (canMoveLeft && canMoveRight) {
            if (Math.random() < 0.5) {
              newGrid[row][col] = 0;
              newGrid[row + 1][col - 1] = 1;
            } else {
              newGrid[row][col] = 0;
              newGrid[row + 1][col + 1] = 1;
            }
          } else if (canMoveLeft) {
            newGrid[row][col] = 0;
            newGrid[row + 1][col - 1] = 1;
          } else if (canMoveRight) {
            newGrid[row][col] = 0;
            newGrid[row + 1][col + 1] = 1;
          }
        }
      }
    }
  }
  return newGrid;
};

export const createSandAtCell = (grid: number[][], rowIndex: number, colIndex: number): number[][] => {
  // Ensure rowIndex and colIndex are within bounds and cell is empty
  if (
    rowIndex >= 0 &&
    rowIndex < grid.length &&
    colIndex >= 0 &&
    colIndex < grid[0].length &&
    grid[rowIndex][colIndex] === 0
  ) {
    // Create a new grid with the new sand particle for Svelte's reactivity
    const newGrid = grid.map((r, i) => {
      if (i === rowIndex) {
        const newRow = [...r];
        newRow[colIndex] = 1;
        return newRow;
      }
      return [...r]; // Ensure all rows are new arrays for consistent immutability
    });
    return newGrid;
  }
  return grid; // Return the original grid if no change is made
};
