<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { createGrid, updateGrid, createSandAtCell } from "./lib/gridUtils";

  const REFRESHRATE_MS = 6.944444444; // 144 FPS

  let isMouseDown = false;
  let currentCell: { rowIndex: number; colIndex: number } | null = null;
  let width = 80;
  let height = 90;
  let grid: number[][] = createGrid(height, width);
  let updateInterval: number;
  
  const placeSandAtCell = (rowIndex: number, colIndex: number) => {
    grid = createSandAtCell(grid, rowIndex, colIndex);
  };

  const handleMouseDown = () => {
    isMouseDown = true;
  };

  const handleMouseEnter = (rowIndex: number, colIndex: number) => {
    currentCell = { rowIndex, colIndex };
  };

  const handleMouseUp = () => {
    isMouseDown = false;
  };

  const resetGrid = () => {
    grid = createGrid(height, width);
  };

  onMount(() => {
    updateInterval = setInterval(() => {
      if (isMouseDown && currentCell) {
        placeSandAtCell(currentCell.rowIndex, currentCell.colIndex);
      }
      grid = updateGrid(grid);
    }, REFRESHRATE_MS);
  });

  onDestroy(() => {
    clearInterval(updateInterval);
  });
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<main 
  on:mouseup={handleMouseUp} 
  on:mousedown={handleMouseDown}
>
  <table class="sand-table">
    <tbody>
      {#each grid as row, rowIndex}
        <tr>
          {#each row as cell, colIndex}
            <td
              class="sand-cell {cell === 1 ? 'filled' : ''}"
              on:mouseenter={() => handleMouseEnter(rowIndex, colIndex)}
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