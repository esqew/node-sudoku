# node-sudoku
Enables NodeJS applications to asynchronously solve Sudoku puzzles, in addition to providing helpful Sudoku-related classes.

## Installation
Install from the latest `master` branch commit by running this command in your project directory:

    npm install --save git+https://github.com/esqew/node-sudoku.git

## Usage
Once installed, you can use the solving functionality by instantiating an instance of `SudokuBoard`, modifying the appropriate cells, and running `solve()`:

    const {SudokuBoard, SudokuCell} = require('node-sudoku');
    const sudoku = new SudokuBoard();
    sudoku.cellAtCoordinates(1, 1) = new SudokuCell(9, false);
    await sudoku.solve();

## Test
Due to the low complexity and quick turnaround I've opted to include a rudimentary `test.js` file which doesn't leverage any additional testing framework dependency but instead functions as more of a demonstration on how to use the library while also ensuring that a known-good board is solvable with the code in its current state. In a future iteration, I plan to add Jest-based tests to ensure that not only the solver functionality works as expected but to achieve full coverage of the classes themselves.

Running the test is as simple as `npm run test`.