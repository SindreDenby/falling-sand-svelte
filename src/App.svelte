<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { createGrid, updateGrid, createSandAtCell as importedCreateSandAtCell } from "./lib/gridUtils"

  let isMouseDown = false;
  let currentCellInterval: number | null = null;
  const SAND_CREATION_INTERVAL_MS = 0; // Adjust for sand creation rate (e.g., 75ms)

  const placeSandAtCell = (rowIndex: number, colIndex: number) => {
    grid = importedCreateSandAtCell(grid, rowIndex, colIndex);
  };

  const stopCellInterval = () => {
    if (currentCellInterval) {
      clearInterval(currentCellInterval);
      currentCellInterval = null;
    }
  };

  const startCellInterval = (rowIndex: number, colIndex: number) => {
    stopCellInterval(); // Clear any existing interval
    placeSandAtCell(rowIndex, colIndex); // Create sand once immediately
    currentCellInterval = setInterval(() => {
      placeSandAtCell(rowIndex, colIndex);
    }, SAND_CREATION_INTERVAL_MS);
  };

  const handleMouseDown = (rowIndex: number, colIndex: number) => {
    isMouseDown = true;
    startCellInterval(rowIndex, colIndex);
  };

  const handleMouseEnter = (rowIndex: number, colIndex: number) => {
    if (isMouseDown) {
      // If dragging into a new cell, restart the interval for the new cell
      startCellInterval(rowIndex, colIndex);
    }
  };

  const handleMouseUp = () => {
    isMouseDown = false;
    stopCellInterval();
  };

  // Stop interval if mouse leaves a cell while pressed, before entering another
  const handleMouseLeaveCell = () => {
    if (isMouseDown) {
      stopCellInterval();
    }
  };

  let width = 60;
  let height = 100;
  let grid: number[][] = createGrid(height, width);
  let gameUpdateInterval: number;

  const resetGrid = () => {
    grid = createGrid(height, width);
  };

  onMount(() => {
    gameUpdateInterval = setInterval(() => {
      grid = updateGrid(grid);
    }, 0);
  });

  onDestroy(() => {
    clearInterval(gameUpdateInterval);
    stopCellInterval(); // Clear sand creation interval
  });
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<main on:mouseup={handleMouseUp} on:mouseleave={handleMouseUp}>
  <table class="sand-table">
    <tbody>
      {#each grid as row, rowIndex}
        <tr>
          {#each row as cell, colIndex}
            <td
              class="sand-cell {cell === 1 ? 'filled' : ''}"
              on:mousedown={() => handleMouseDown(rowIndex, colIndex)}
              on:mouseenter={() => handleMouseEnter(rowIndex, colIndex)}
              on:mouseleave={handleMouseLeaveCell}
            ></td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
  <button on:click={resetGrid}>Reset Grid</button>
</main>

<style>
  .sand-table {
  border-collapse: collapse;
  margin: 20px auto;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
}

.sand-cell {
  width: 4px;
  height: 4px;
  border: 1px solid #333;
  background-color: #1e1e1e;
}

  .sand-cell.filled {
    background-color: #ffffff;
  }

  .sand-cell:hover {
    background-color: #3a3a3a;
  }
</style>