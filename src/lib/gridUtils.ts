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

export const updateGrid = (grid: number[][]): number[][] => {
  const newGrid = grid.map(row => [...row]);
  for (let row = newGrid.length - 1; row >= 0; row--) {
    for (let col = 0; col < newGrid[0].length; col++) {
      if (newGrid[row][col] == 1) { 
        if (row + 1 < newGrid.length && newGrid[row + 1][col] == 0) {
          newGrid[row][col] = 0;
          newGrid[row + 1][col] = 1;
        } 
        else if (row + 1 < newGrid.length) {
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
  if (
    rowIndex >= 0 &&
    rowIndex < grid.length &&
    colIndex >= 0 &&
    colIndex < grid[0].length &&
    grid[rowIndex][colIndex] === 0
  ) {
    const newGrid = grid.map((r, i) => {
      if (i === rowIndex) {
        const newRow = [...r];
        newRow[colIndex] = 1;
        return newRow;
      }
      return [...r];
    });
    return newGrid;
  }
  return grid;
};
