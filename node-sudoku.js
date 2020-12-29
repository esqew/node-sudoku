'use strict';

class SudokuBoard {
    constructor() {
        this.board = new Array(81).fill().map(_ => new SudokuCell(null));
    }

    static fromMultidimensionalArrayOfValues(inputArray) {
        const newBoard = new SudokuBoard();
        for (var row = 0; row < inputArray.length; row++) {
            for (var col = 0; col < inputArray[row].length; col++) {
                newBoard.cellAtCoordinates(row + 1, col + 1).value = inputArray[row][col];
            }
        }
        return newBoard;
    }

    static fromArrayOfValues(inputArray) {
        if (inputArray.length !== 81 || !inputArray instanceof Array) throw new Error(`fromArrayOfValues takes an Array of length = 81`);
        const newBoard = new SudokuBoard();
        newBoard.board = inputArray.map(_ => new SudokuCell(_, _ === null ? true : false));
        return newBoard;
    }

    static fromSampleBoard() {
        return SudokuBoard.fromArrayOfValues([5, 3, 4, null, null, 8, null, 1, null, null, null, null, null, null, 2, null, 9, null, null, null, null, null, null, 7, 6, null, 4, null, null, null, 5, null, null, 1, null, null, 1, null, null, null, null, null, null, null, 3, null, null, 9, null, null, 1, null, null, null, 3, null, 5, 4, null, null, null, null, null, null, 8, null, 2, null, null, null, null, null, null, 6, null, 7, null, null, 3, 8, 2]);
    }

    static fromJSONString(jsonString) {
        throw new SyntaxError(`fromJSONString not yet implemented`)
    }

    cellAtPosition(position) {
        return this.cellAtIndex(position - 1)
    }

    cellAtIndex(index) {
        return this.board[index];
    }

    cellAtCoordinates(rowNumber, columnNumber) {
        if (rowNumber < 1 ||
            rowNumber > 9 ||
            columnNumber < 1 ||
            columnNumber > 9) throw new RangeError(`One or more of the arguments provided to cellAtCoordinates() is out of the valid range for the board. Cells can only exist within the 9x9 grid`);

        return this.cellAtIndex(((rowNumber - 1) * 9)+(columnNumber - 1));
    }

    _cellsAreVaild(cellValues) {
        var validValues = [...Array(9).keys()].map(ele => ++ele);
        for (var cellValue of cellValues) {
            if (validValues.includes(cellValue))
                validValues.splice(validValues.indexOf(cellValue), 1);
            else if (cellValue === null) continue;
            else return false;
        }
        return true;
    }

    getRow(rowNumber, values = false) {
        var rowIndex = rowNumber - 1; // translate provided row `number` to a zero-indexed row `index`
        return this.board.filter((value, index) => index >= rowIndex * 9 && index < (rowIndex + 1) * 9).map(element => values ? element.value : element);
    }

    getColumn(columnNumber, values = false) {
        var columnIndex = columnNumber - 1; // translate provided column `number` to a zero-indexed column `index`
        return this.board.filter((value, index) => index === columnIndex || index % 9 == columnIndex).map(element => values ? element.value : element);
    }

    getSubgrid(subgridNumber, values = false) {
        return this.board.filter((value, index) => this.getSubgridNumberForCellAtIndex(index) === subgridNumber).map(element => values ? element.value : element);
    }

    getSubgridNumberForCellAtIndex(cellIndex) {
        const rowIndex = Math.floor(cellIndex / 9);
        const colIndex = (cellIndex % 9);
        return (Math.floor(rowIndex / 3) * 3 + Math.floor(colIndex / 3)) + 1;
    }

    rowIsValid(rowNumber) {
        return this._cellsAreVaild(this.getRow(rowNumber, true));
    }

    columnIsValid(columnNumber) {
        return this._cellsAreVaild(this.getColumn(columnNumber, true));
    }

    subgridIsValid(subgridNumber) {
        return this._cellsAreVaild(this.getSubgrid(subgridNumber, true));
    }

    cellAtIndexIsValid(cellIndex) {
        return  this.rowIsValid(Math.floor((cellIndex / 9) + 1)) &&
                this.columnIsValid(Math.floor((cellIndex % 9) + 1)) &&
                this.subgridIsValid(this.getSubgridNumberForCellAtIndex(cellIndex)) &&
                this.board[cellIndex].value !== null;
    }

    validValuesForCellAtIndex(cellIndex) {
        var validValues = new Array(9).fill().map((value, index) => index + 1);
        [
            this.getRow(Math.floor((cellIndex / 9) + 1), true),
            this.getColumn(Math.floor((cellIndex % 9) + 1), true),
            this.getSubgrid(this.getSubgridNumberForCellAtIndex(cellIndex), true)
        ].forEach((value, index, array) => {
            value.forEach(number => {
                if (validValues.includes(number)) validValues.splice(validValues.indexOf(number), 1);
            });
        });
        return validValues;
    }

    toMultidimensionalArray() {
        var returnArray = new Array(9).fill().map(_ => []);
        for (var i = 0; i < this.board.length; i++) {
            returnArray[Math.floor(i / 9)].push(this.cellAtIndex(i));
        }
        return returnArray;
    }

    toJSON() {
        return this.board.map(cell => cell.toJSON());
    }

    solve() {
        return this.solveUsingBruteforce();
    }

    solveUsingBruteforce() {
        var currentCellIndex = 0;
        while (currentCellIndex < this.board.length) {
            var currentCell = this.cellAtIndex(currentCellIndex);
            
            if (!currentCell.editable) {
                do {
                    ++currentCellIndex;
                    currentCell = this.cellAtIndex(currentCellIndex);
                } while (currentCellIndex < 81 && !currentCell.editable);
                if (currentCellIndex === 81) {
                    if (this.isSolved) break;
                    else throw new Error(`Can't solve this puzzle as provided.`);
                }
            }

            if (currentCell.value === 9) {
                currentCell.value = null;
                do {
                    --currentCellIndex;
                    if (currentCellIndex < 0) throw new Error(`Couldn't find a solution to the puzzle as provided.`);
                    currentCell = this.cellAtIndex(currentCellIndex);
                } while (!currentCell.editable);
            } else {
                if (currentCell.value === null) currentCell.value = 1;
                else ++currentCell.value;

                if (this.cellAtIndexIsValid(currentCellIndex)) ++currentCellIndex;
            }
        }
        return this.board;
    }

    get solved() {
        if (this.board.filter(cell => cell.value === null).length > 0) return false;
        for (var i = 0; i < 9; i++) {
            if (![this.rowIsValid(i), this.columnIsValid(i), this.subgridIsValid(i)].every(value => value === true)) return false;
        }
        return true;
    }

    get isSolved() {
        return this.solved;
    }
}

class SudokuCell {
    constructor(initialValue, editable = true) {
        this._editable = editable;
        this._value = initialValue;
    }

    static fromJSON(jsonObject) {
        throw new SyntaxError(`fromJSON method not yet implemented`);
    }

    toJSON() {
        return {
            "value" :   this._value,
            "editable": this._editable
        };
    }

    set value(newValue) {
        if (isNaN(newValue)) throw new TypeError(`SudokuCell.value can only be set to a number`);
        else if (newValue !== null && (newValue < 1 || newValue > 9)) throw new RangeError(`SudokuCell.value can only be a number between 1 and 9 (inclusive), or null`);
        else this._value = newValue;
        return;
    }

    get value() {
        return this._value;
    }

    set editable(newValue) {
        if (!!newValue)
        this._editable = !!newValue;
        return;
    }

    get editable() {
        return this._editable;
    }

    /**
     * Returns a boolean of whether or not the cell instance is editable
     * @alias editable
     */
    get isEditable() {
        return this.editable;
    }
}

module.exports = {SudokuBoard, SudokuCell};