<template>
  <div id="minefield">
    <div class="row">
      <p>Difficulty: {{ $route.params.difficulty }}</p>
      <p>Number of mines: {{ numberOfMines - numberOfFlags }}</p>
      <p>Number of closed block: {{ (minefieldColumnCount * minefieldRowCount) - numberOfFlags - numberOfClickedMines }}</p>
      <button @click="$router.go(0)">Go</button>
    </div>
    <div class="minefieldGrid" v-for="(rows) of listOfMineBlocks" v-bind:key="rows">
      <div class="minefieldGrid" v-for="(mineBlock) of rows" v-bind:key="mineBlock">
        <minefield-block
            @flagged="onFlaggedChild"
            :row-index="mineBlock.rowIndex"
            :column-index="mineBlock.columnIndex"
            :index="minefieldRowCount * mineBlock.rowIndex + mineBlock.columnIndex"
            :ref="setMineBlockRef">
        </minefield-block>
      </div>
    </div>
  </div>
</template>

<script>
import MinefieldBlock from "@/components/MinefieldBlock";

export default {
  name: "Minefield",
  components: {
    MinefieldBlock
  },
  data() {
    return {
      minefieldRowCount: 0,
      minefieldColumnCount: 0,
      numberOfMines: 0,
      listOfMineBlocks: [],
      numberOfMineBlocks: 0,
      firstClick: true,
      mineBlockRefs: [],
      numberOfFlags: 0,
      numberOfClickedMines: 0
    }
  },
  methods: {
    setMineBlockRef(mineBlock) {
      if (mineBlock && this.mineBlockRefs.length <= this.numberOfMineBlocks) {
        this.mineBlockRefs.push(mineBlock);
      }
    },
    onFlaggedChild(incrementor) {
      const inc = incrementor;
      this.numberOfFlags += inc;
    },
    setupDifficulty() {
      const difficulty = this.$route.params.difficulty;
      if (difficulty === 'easy') {
        this.minefieldRowCount = 5;
        this.minefieldColumnCount = 5;
        this.numberOfMines = 5;
      } else if (difficulty === 'medium') {
        this.minefieldRowCount = 10;
        this.minefieldColumnCount = 10;
        this.numberOfMines = 20;
      } else if (difficulty === 'hard') {
        this.minefieldRowCount = 20;
        this.minefieldColumnCount = 20;
        this.numberOfMines = 70;
      } else if (difficulty === 'very-hard') {
        this.minefieldRowCount = 16;
        this.minefieldColumnCount = 30;
        this.numberOfMines = 99;
      }
      this.numberOfMineBlocks = this.minefieldRowCount * this.minefieldColumnCount;
    },
    createMineBlocks() {
      for (let i = 0; i < this.minefieldRowCount; i++) {
        let tempListOfMines = [];
        for (let j = 0; j < this.minefieldColumnCount; j++) {
          tempListOfMines.push({
            hasMine: false,
            rowIndex: i,
            columnIndex: j
          });
        }
        this.listOfMineBlocks.push(tempListOfMines);
      }
    },
    addMinesToMineBlocks(firstIndexRow, firstIndexColumn) {
      for (let i = 0; i < this.numberOfMines; i++) {
        const randomIntRow = Math.floor(Math.random() * this.minefieldRowCount);
        const randomIntColumn = Math.floor(Math.random() * this.minefieldColumnCount);
        if (this.listOfMineBlocks[randomIntRow][randomIntColumn].hasMine ||
            (firstIndexRow === randomIntRow && firstIndexColumn === randomIntColumn)) {
          i--;
        } else {
          this.listOfMineBlocks[randomIntRow][randomIntColumn].hasMine = true;
        }
      }
      this.firstClick = false;
    },
    clickOnMineBlock(mineBlock) {
      if (this.firstClick) {
        this.addMinesToMineBlocks(mineBlock.rowIndex, mineBlock.columnIndex);
      }
      this.numberOfClickedMines++;
    },
    checkIfLostOrWon(mineBlock) {
      if (mineBlock.hasMine) {
        alert('You lost')
        for (let i = 0; i < this.minefieldRowCount; i++) {
          for (let j = 0; j < this.minefieldColumnCount; j++) {
            if (this.listOfMineBlocks[i][j].hasMine) {
              this.findRefByIndex(i,j).numberOfAdjacentMines = "X";
              this.findRefByIndex(i,j).clicked = true;
            }
          }
        }
      } else {
        let yeet = true;
        for (let i = 0; i < this.mineBlockRefs.length; i++) {
          if (!this.listOfMineBlocks[this.mineBlockRefs[i].rowIndex][this.mineBlockRefs[i].columnIndex].hasMine && yeet) {
            yeet = this.mineBlockRefs[i].clicked;
          }
        }
        if (yeet) {
          alert('You won')
          this.$router.push('/')
        }
      }
    },
    calculateNumberOfNearbyMines(mineBlock) {
      let numberOfAdjacentMines = 0;
      if (this.listOfMineBlocks[mineBlock.rowIndex - 1]) {
        if (this.listOfMineBlocks[mineBlock.rowIndex - 1][mineBlock.columnIndex - 1]) {
          if (this.listOfMineBlocks[mineBlock.rowIndex - 1][mineBlock.columnIndex - 1].hasMine) {
            numberOfAdjacentMines++;
          }
        }
        if (this.listOfMineBlocks[mineBlock.rowIndex - 1][mineBlock.columnIndex]) {
          if (this.listOfMineBlocks[mineBlock.rowIndex - 1][mineBlock.columnIndex].hasMine) {
            numberOfAdjacentMines++;
          }
        }
        if (this.listOfMineBlocks[mineBlock.rowIndex - 1][mineBlock.columnIndex + 1]) {
          if (this.listOfMineBlocks[mineBlock.rowIndex - 1][mineBlock.columnIndex + 1].hasMine) {
            numberOfAdjacentMines++;
          }
        }
      }
      if (this.listOfMineBlocks[mineBlock.rowIndex][mineBlock.columnIndex - 1]) {
        if (this.listOfMineBlocks[mineBlock.rowIndex][mineBlock.columnIndex - 1].hasMine) {
          numberOfAdjacentMines++;
        }
      }
      if (this.listOfMineBlocks[mineBlock.rowIndex][mineBlock.columnIndex + 1]) {
        if (this.listOfMineBlocks[mineBlock.rowIndex][mineBlock.columnIndex + 1].hasMine) {
          numberOfAdjacentMines++;
        }
      }
      if (this.listOfMineBlocks[mineBlock.rowIndex + 1]) {
        if (this.listOfMineBlocks[mineBlock.rowIndex + 1][mineBlock.columnIndex - 1]) {
          if (this.listOfMineBlocks[mineBlock.rowIndex + 1][mineBlock.columnIndex - 1].hasMine) {
            numberOfAdjacentMines++;
          }
        }
        if (this.listOfMineBlocks[mineBlock.rowIndex + 1][mineBlock.columnIndex]) {
          if (this.listOfMineBlocks[mineBlock.rowIndex + 1][mineBlock.columnIndex ].hasMine) {
            numberOfAdjacentMines++;
          }
        }
        if (this.listOfMineBlocks[mineBlock.rowIndex + 1][mineBlock.columnIndex + 1]) {
          if (this.listOfMineBlocks[mineBlock.rowIndex + 1][mineBlock.columnIndex + 1].hasMine) {
            numberOfAdjacentMines++;
          }
        }
      }
      if (numberOfAdjacentMines === 0) {
        this.showOtherMineBlocks(mineBlock);
      }
      return numberOfAdjacentMines;
    },
    findRefByIndex(row, column) {
      for (let i = 0; i < this.mineBlockRefs.length; i++) {
        if (this.mineBlockRefs[i].rowIndex === row && this.mineBlockRefs[i].columnIndex === column) {
          return this.mineBlockRefs[i];
        }
      }
    },
    showOtherMineBlocks(mineBlock) {
      if (this.findRefByIndex(mineBlock.rowIndex - 1, mineBlock.columnIndex - 1)) {
        this.findRefByIndex(mineBlock.rowIndex - 1, mineBlock.columnIndex - 1).showNumber();
      }
      if (this.findRefByIndex(mineBlock.rowIndex - 1, mineBlock.columnIndex)) {
        this.findRefByIndex(mineBlock.rowIndex - 1, mineBlock.columnIndex).showNumber();
      }
      if (this.findRefByIndex(mineBlock.rowIndex - 1, mineBlock.columnIndex + 1)) {
        this.findRefByIndex(mineBlock.rowIndex - 1, mineBlock.columnIndex + 1).showNumber();
      }
      if (this.findRefByIndex(mineBlock.rowIndex, mineBlock.columnIndex - 1)) {
        this.findRefByIndex(mineBlock.rowIndex, mineBlock.columnIndex - 1).showNumber();
      }
      if (this.findRefByIndex(mineBlock.rowIndex, mineBlock.columnIndex + 1)) {
        this.findRefByIndex(mineBlock.rowIndex, mineBlock.columnIndex + 1).showNumber();
      }
      if (this.findRefByIndex(mineBlock.rowIndex + 1, mineBlock.columnIndex - 1)) {
        this.findRefByIndex(mineBlock.rowIndex + 1, mineBlock.columnIndex - 1).showNumber();
      }
      if (this.findRefByIndex(mineBlock.rowIndex + 1, mineBlock.columnIndex)) {
        this.findRefByIndex(mineBlock.rowIndex + 1, mineBlock.columnIndex).showNumber();
      }
      if (this.findRefByIndex(mineBlock.rowIndex + 1, mineBlock.columnIndex + 1)) {
        this.findRefByIndex(mineBlock.rowIndex + 1, mineBlock.columnIndex + 1).showNumber();
      }
    },
    handleGetNumberOfAdjacentMines(mineBlock) {
      if (this.listOfMineBlocks[mineBlock.rowIndex][mineBlock.columnIndex].hasMine) {
        this.checkIfLostOrWon(this.listOfMineBlocks[mineBlock.rowIndex][mineBlock.columnIndex]);
        return -1;
      }
      this.clickOnMineBlock(mineBlock);
      this.checkIfLostOrWon(mineBlock);
      return this.calculateNumberOfNearbyMines(mineBlock);
    }
  },
  mounted() {
    this.setupDifficulty();
    this.createMineBlocks();
  }
}
</script>

<style>
.minefieldGrid {
  display: flex;
  justify-content: left;
}
.row {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
button {
  max-height: 20px;
  cursor: pointer;
}
</style>
