let board = [];
let words_to_search = [];
let notFoundWords = [];
let FoundWords = {};
let highlightedCells = [];
let algo_chosen = 0;

function generateTable() {
    board = [];
    notFoundWords = [];
    highlightedCells = [];
    algo_chosen = document.getElementById("algo_chosen").value;

    if (algo_chosen !== "1" && algo_chosen !== "2") {
        alert("Please choose an algorithm");
        return
    }

    // Get the number of rows, columns, and matrix data from the inputs
    const rowsInput = document.getElementById('rows');
    const colsInput = document.getElementById('cols');
    const matrixDataInput = document.getElementById('matrixData');

    const rows = parseInt(rowsInput.value, 10);
    const cols = parseInt(colsInput.value, 10);
    const matrixData = matrixDataInput.value.trim();

    // Clear previous table
    const tableContainer = document.getElementById('table-container');
    tableContainer.innerHTML = '';

    // Validate input
    if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) {
        alert('Please enter valid positive integers for rows and columns.');
        return;
    }

    // Split matrix data into rows
    const rowsData = matrixData.split('\n');

    // Validate the number of rows
    if (rowsData.length !== rows) {
        alert('Number of rows in matrix data does not match the specified number of rows.');
        return;
    }

    // Create table and header
    const table = document.createElement('table');
    table.classList.add('table', 'table-bordered', 'table-striped', 'mt-4', 'bg-dark', 'text-light');
    const headerRow = document.createElement('tr');

    for (let j = 0; j <= cols; j++) {
        const headerCell = document.createElement('th');
        headerCell.classList.add('text-center');
        if (j === 0) {
            headerCell.textContent = '';
        } else {
            headerCell.textContent = 'Column ' + j;
        }
        headerCell.id = `header-${j}`;
        headerRow.appendChild(headerCell);
    }

    table.appendChild(headerRow);

    // Create table rows and cells
    for (let i = 1; i <= rows; i++) {
        const row = document.createElement('tr');
        const headerCell = document.createElement('th');
        headerCell.classList.add('text-center');
        headerCell.textContent = 'Row ' + i;
        headerCell.id = `header-${i}`;
        row.appendChild(headerCell);

        const rowData = rowsData[i - 1].split(' ');

        // Validate the number of columns in each row
        if (rowData.length !== cols) {
            alert(`Number of columns in row ${i} does not match the specified number of columns.`);
            return;
        }

        let curr_board_row = [];
        for (let j = 1; j <= cols; j++) {
            const cell = document.createElement('td');
            cell.classList.add('text-center');
            cell.textContent = rowData[j - 1];
            curr_board_row.push(rowData[j - 1]);
            cell.id = `data-${i}-${j}`;
            row.appendChild(cell);
        }

        board.push(curr_board_row);
        table.appendChild(row);
    }

    // Append the table to the container
    tableContainer.appendChild(table);

    // Create and append a label and textarea after the table
    const textareaLabel = document.createElement('label');
    textareaLabel.classList.add('mt-4', 'text-light');
    textareaLabel.textContent = 'Words to find:';
    textareaLabel.htmlFor = 'words-textarea'; // Use htmlFor instead of for
    document.getElementById('textarea-container').appendChild(textareaLabel);

    const textarea = document.createElement('textarea');
    textarea.classList.add('form-control', 'bg-dark', 'text-light');
    textarea.placeholder = 'Enter text here';
    textarea.id = 'words-textarea'; // Assigning an id to the textarea
    document.getElementById('textarea-container').appendChild(textarea);

    const submitButton = document.createElement('button');
    submitButton.classList.add('btn', 'btn-primary', 'mt-3');
    submitButton.textContent = 'Submit';
    submitButton.addEventListener('click', make_words_array);
    document.getElementById('textarea-container').appendChild(submitButton);
}

// Function that will extract the words from textarea provided for entering words.
function make_words_array() {
    console.log(algo_chosen)
    const wordsTextarea = document.getElementById('words-textarea');
    words_to_search = [];
    words_to_search = wordsTextarea.value.split(',').map(word => word.trim());

    // Clear previous not found words and reset highlighted cells
    notFoundWords = [];
    FoundWords = {};
    resetHighlightedCells();

    // Call the search function for each word
    for (const word of words_to_search) {
        let ans = [];
        if (algo_chosen === "1") {
            ans = searchWord_1(board, word);
        }
        else if (algo_chosen === "2") {
            ans = searchWord_2(board, word);
        }
        if (ans.length !== 0) {
            FoundWords[word] = ans;
        } else {
            notFoundWords.push(word);
        }
    }

    // Display not found words
    const notFoundContainer = document.getElementById('not-found-container');
    notFoundContainer.innerHTML = '';
    if (notFoundWords.length > 0) {
        const notFoundLabel = document.createElement('label');
        notFoundLabel.classList.add('mt-4', 'text-danger');
        notFoundLabel.textContent = 'Words not found:';
        notFoundContainer.appendChild(notFoundLabel);

        const notFoundList = document.createElement('ul');
        for (const word of notFoundWords) {
            const listItem = document.createElement('li');
            listItem.textContent = word;
            notFoundList.appendChild(listItem);
        }
        notFoundContainer.appendChild(notFoundList);
    }

    // Display found words
    const FoundContainer = document.getElementById('found-container');
    FoundContainer.innerHTML = '';

    const foundKeys = Object.keys(FoundWords);
    if (foundKeys.length > 0) {
        const FoundLabel = document.createElement('label');
        FoundLabel.classList.add('mt-4', 'text-success');
        FoundLabel.textContent = 'Words found:';
        FoundContainer.appendChild(FoundLabel);

        const FoundList = document.createElement('ul');
        FoundContainer.appendChild(FoundList);

        for (const word of foundKeys) {
            const listItem = document.createElement('li');
            listItem.textContent = word;
            FoundList.appendChild(listItem);

            // Add an event listener to highlight the word's path when clicked
            listItem.addEventListener('click', function () {
                const path = FoundWords[word];
                highlightWord(path, 'blue');
            });
        }
    }
}

// Function to reset the highlighted cells
function resetHighlightedCells() {
    for (const cell of highlightedCells) {
        const [x, y] = cell;
        const cellElement = document.getElementById(`data-${x}-${y}`);
        cellElement.style.backgroundColor = '';
    }
    highlightedCells = [];
}

// Function to highlight the word on the board
function highlightWord(path, color) {
    resetHighlightedCells();
    for (const cell of path) {
        const [x, y] = cell;
        const cellElement = document.getElementById(`data-${x}-${y}`);
        cellElement.style.backgroundColor = color;
        highlightedCells.push([x, y]);
    }
}
