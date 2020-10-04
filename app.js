document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector(".grid");
    let width = 16;
    let bombAmount = 40;
    if (window.screen.width <= 250) {
        width = 8;
        bombAmount = 12;
    }
    let flags = 0;
    let squares = [];
    let isGameOver = false;
    document.getElementById("bombs_count").innerText = bombAmount - flags;

    // create board
    const createBoard = () => {
        // get shuffled array with random bombs
        const bombsArray = Array(bombAmount).fill("bomb");
        const emptyArray = Array(width * width - bombAmount).fill("valid");
        const gamesArray = emptyArray.concat(bombsArray);
        const shuffledArray = gamesArray.sort(
            () => Math.floor(Math.random() * 100) % 2 == 0
        );

        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div");
            square.setAttribute("id", i);
            square.classList.add(shuffledArray[i]);
            grid.appendChild(square);
            squares.push(square);

            // normal click
            square.addEventListener("click", (event) => {
                click(event.target);
            });

            //cntrl and left click
            square.oncontextmenu = (ev) => {
                ev.preventDefault();
                addFlag(square);
            };
        }

        // add numbers
        for (let i = 0; i < squares.length; i++) {
            let total = 0;
            const isLeftEdge = i % width == 0;
            const isRightEdge = i % width == width - 1;

            if (squares[i].classList.contains("valid")) {
                if (
                    i > 0 &&
                    !isLeftEdge &&
                    squares[i - 1].classList.contains("bomb")
                )
                    total++;

                if (
                    i > width - 1 &&
                    !isRightEdge &&
                    squares[i + 1 - width].classList.contains("bomb")
                )
                    total++;

                if (i > width && squares[i - width].classList.contains("bomb"))
                    total++;

                if (
                    i > width + 1 &&
                    !isLeftEdge &&
                    squares[i - 1 - width].classList.contains("bomb")
                )
                    total++;

                if (
                    i < width * width - 1 &&
                    !isRightEdge &&
                    squares[i + 1].classList.contains("bomb")
                )
                    total++;

                if (
                    i < width * (width - 1) &&
                    !isLeftEdge &&
                    squares[i - 1 + width].classList.contains("bomb")
                )
                    total++;

                if (
                    i < width * (width - 1) - 2 &&
                    !isRightEdge &&
                    squares[i + 1 + width].classList.contains("bomb")
                )
                    total++;

                if (
                    i < width * (width - 1) - 1 &&
                    squares[i + width].classList.contains("bomb")
                )
                    total++;

                squares[i].setAttribute("data", total);
            }
        }
    };

    createBoard();

    // add flag with right click
    const addFlag = (square) => {
        if (isGameOver) return;
        if (!square.classList.contains("checked") && flags < bombAmount) {
            if (!square.classList.contains("flag")) {
                square.classList.add("flag");
                square.innerText = "🚩";
                flags++;
                checkForWin();
            } else {
                square.classList.remove("flag");
                square.innerText = "";
                flags--;
            }
        } else if (
            !square.classList.contains("checked") &&
            square.classList.contains("flag") &&
            flags == bombAmount
        ) {
            square.classList.remove("flag");
            square.innerText = "";
            flags--;
        }

        document.getElementById("bombs_count").innerText = bombAmount - flags;
    };

    // click on square actons
    const click = (square) => {
        let currentId = square.id;
        if (isGameOver) return;

        if (
            square.classList.contains("checked") ||
            square.classList.contains("flag")
        )
            return;

        if (square.classList.contains("bomb")) {
            gameOver(square);
        } else {
            let total = square.getAttribute("data");
            if (total != 0) {
                square.classList.add("checked");
                square.innerText = total;
                return;
            }
            checkSquare(square, currentId);
        }
        square.classList.add("checked");
    };

    // check neighbouring squares once square is clicked
    const checkSquare = (square, currentId) => {
        const isLeftEdge = currentId % width == 0;
        const isRightEdge = currentId % width == width - 1;

        setTimeout(() => {
            if (currentId > 0 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }

            if (currentId > width - 1 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 - width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }

            if (currentId > width) {
                const newId = squares[parseInt(currentId) - width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }

            if (currentId > width + 1 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 - width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }

            if (currentId < width * width - 2 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }

            if (currentId < width * (width - 1) && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }

            if (currentId < width * (width - 1) - 2 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }

            if (currentId < width * (width - 1) - 1) {
                const newId = squares[parseInt(currentId) + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
        }, 10);
    };

    const gameOver = () => {
        onGameOver(0);

        // show all bombs
        squares.forEach((square) => {
            if (
                square.classList.contains("bomb") &&
                !square.classList.contains("flag")
            ) {
                square.innerText = "💣";
                square.classList.add("danger");
            }

            if (
                square.classList.contains("valid") &&
                square.classList.contains("flag")
            ) {
                square.classList.add("danger");
            }
        });
    };

    const checkForWin = () => {
        let matches = 0;
        squares.forEach((square) => {
            if (
                square.classList.contains("flag") &&
                square.classList.contains("bomb")
            ) {
                matches++;
            }

            if (matches == bombAmount) {
                onGameOver(1);
            }
        });
    };

    const onGameOver = (status) => {
        const message =
            status == 0 ? "BOOM! Game Over 😟" : "Congratulations! YOU WON 🏆";
        const msg = document.querySelector(".message");
        msg.innerText = message;

        const retry = document.querySelector(".retry__text");
        retry.addEventListener("click", () => {
            window.location.reload();
        });
        retry.classList.remove("hide");
        retry.innerText = "New Game ▶";

        isGameOver = true;
    };
});
