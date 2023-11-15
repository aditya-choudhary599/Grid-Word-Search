// Algorithm 1 : For search word
function searchWord_1(board, word) {
    let m = board.length;
    let n = board[0].length;
    let directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    for (let i = 0; i < m; i += 1) {
        for (let j = 0; j < n; j += 1) {
            for (const direction of directions) {
                let x = i, y = j, index = 0, ans = [];

                while (x >= 0 && x < m && y >= 0 && y < n && index < word.length && word[index] === board[x][y]) {
                    ans.push([x + 1, y + 1]);
                    index += 1;
                    x += direction[0];
                    y += direction[1];
                }

                if (index === word.length) {
                    return ans;
                }
            }
        }
    }

    return [];
}

// Algorithm 2 : For Search word
function searchWord_2(board, word) {
    let m = board.length;
    let n = board[0].length;
    let directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    let vis = [];
    for (let i = 0; i < m; i += 1) {
        let curr_row = [];
        for (let j = 0; j < n; j += 1) {
            curr_row.push(false);
        }
        vis.push(curr_row);
    }

    function dfs(i, j, word) {
        if (i < 0 || i >= m || j < 0 || j >= n || vis[i][j] === true) {
            return [];
        }

        if (word.length === 1 && word[0] === board[i][j]) {
            return [[i + 1, j + 1]];
        }

        vis[i][j] = true;
        for (const direction of directions) {
            let x = i + direction[0];
            let y = j + direction[1];

            if (x >= 0 && x < m && y >= 0 && y < n && word[1] === board[x][y]) {
                let ans = dfs(x, y, word.slice(1));
                if (ans.length !== 0) {
                    ans.push([i + 1, j + 1]);
                    return ans;
                }
            }
        }

        vis[i][j] = false;
        return [];
    }

    for (let i = 0; i < m; i += 1) {
        for (let j = 0; j < n; j += 1) {
            if (word[0] === board[i][j]) {
                let ans = dfs(i, j, word);
                if (ans.length !== 0) {
                    return ans;
                }
            }
        }
    }

    return [];
}