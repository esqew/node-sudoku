# node-sudoku
Enables NodeJS applications to asynchronously solve Sudoku puzzles, in addition to providing helpful Sudoku-related classes.

## Installation
Install from the latest `master` branch commit by running this command in your project directory:

    npm install --save git+https://github.com/esqew/node-sudoku.git

## Usage
Once installed, you can use the solving functionality by instantiating an instance of `SudokuBoard`, modifying the appropriate cells, and running `solve()`:

    const sudoku = new SudokuBoard();
    sudoku.cellAtCoordinates(1, 1) = new SudokuCell(9, false);
    await sudoku.solve();