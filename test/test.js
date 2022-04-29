const {SudokuBoard, SudokuCell} = require('../node-sudoku');

const sudoku = SudokuBoard.fromSampleBoard();
console.dir(sudoku.solve());