const {SudokuBoard, SudokuCell} = require('../sudoku-solver');

const sudoku = SudokuBoard.fromSampleBoard();
console.dir(sudoku.solve());

return;