<template>
  <div id="minefield-block" @click="showNumber" @contextmenu="flagHandler($event)"
       v-bind:class="{'grey': !clicked,
                      'light-grey': clicked,
                      'light-blue': numberOfAdjacentMines === 1,
                      'blue': numberOfAdjacentMines === 2,
                      'dark-blue': numberOfAdjacentMines === 3,
                      'orange': numberOfAdjacentMines === 4,
                      'dark-orange': numberOfAdjacentMines === 5,
                      'red': numberOfAdjacentMines === 6,
                      'red-background': numberOfAdjacentMines === 'X'}">
    <div class="number" v-if="clicked && numberOfAdjacentMines !== 0">
      {{numberOfAdjacentMines}}
    </div>
    <div class="flag" v-if="!clicked && flagged">
      <img src="@/assets/flag.png" alt="flag">
    </div>
  </div>
</template>

<script>
export default {
  name: "MinefieldBlock",
  props: {
    hasMine: Boolean,
    rowIndex: Number,
    columnIndex: Number,
    computedBackgroundColor: String,
    index: Number
  },
  data() {
    return {
      numberOfAdjacentMines: 0,
      clicked: false,
      flagged: false
    }
  },
  methods: {
    showNumber() {
      if (!this.clicked && !this.flagged) {
        this.clicked = true;
        const number = this.$parent.handleGetNumberOfAdjacentMines(this);
        if (number === -1) {
          this.numberOfAdjacentMines = 'X';
        } else {
          this.numberOfAdjacentMines = number;
        }
      }
    },
    flagHandler: function(e) {
      if (!this.clicked && !this.flagged) {
        this.$emit('flagged', 1)
        this.flagged = true;
      } else if (!this.clicked && this.flagged) {
        this.$emit('flagged', -1)
        this.flagged = false;
      }
      e.preventDefault();
    }
  }
}
</script>

<style scoped>
#minefield-block {
  width: 10px;
  height: 10px;
  border: 1px solid;
  padding: 10px;
  box-shadow: -3px -3px darkslategrey inset, 3px 3px lightgray inset;
  font-weight: bold;
  font-family: "Arial Black",serif;
  display: flex;
  justify-content: center;
  align-items: center;
}
img {
  max-height: 17px;
}
#minefield-block:hover {
  background-color: #ce4141;
}
.grey {
  background-color: grey;
}
.light-grey {
  background-color: #bababa;
  box-shadow: none!important;
  border-color: grey!important;
}
.dark-blue {
  color: darkblue;
}
.blue {
  color: blue;
}
.light-blue {
  color: #27829b;
}
.orange {
  color: #ab7e1c;
}
.dark-orange {
  color: #936a19;
}
.red {
  color: #9b2424;
}
.red-background {
  color: white;
  background-color: #9b2424;
}
</style>
