document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector(".grid");
    let width = 16;
    let height = 16;
    let bombAmount = 40;
    if (window.screen.width <= 500) {
        width = 8;
        height = 12;
        bombAmount = 15;
    }
    let total = width * height;
    let flags = 0;
    let squares = [];
    let isGameOver = false;
    document.getElementById("bombs_count").innerText = bombAmount - flags;
    document.querySelector(".head").addEventListener("click", () => {
        createBoard();
    });
    let mySound;

    // create board
    const createBoard = () => {
        // get shuffled array with random bombs
        const bombsArray = Array(bombAmount).fill("bomb");
        const emptyArray = Array(width * height - bombAmount).fill("valid");
        const gamesArray = emptyArray
            .slice(0, parseInt((total - bombAmount) / 2))
            .concat(bombsArray.slice(0, parseInt(bombAmount / 2)))
            .concat(emptyArray.slice(parseInt((total - bombAmount) / 2)))
            .concat(bombsArray.slice(parseInt(bombAmount / 2)));
        console.log(gamesArray);
        const shuffledArray = gamesArray.sort(
            () => Math.floor(Math.random() * 100) % 2 == 0
        );

        for (let i = 0; i < width * height; i++) {
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
                // left
                if (
                    i > 0 &&
                    !isLeftEdge &&
                    squares[i - 1].classList.contains("bomb")
                )
                    total++;

                // top right
                if (
                    i > width - 1 &&
                    !isRightEdge &&
                    squares[i + 1 - width].classList.contains("bomb")
                )
                    total++;

                // top
                if (i > width && squares[i - width].classList.contains("bomb"))
                    total++;

                // top left
                if (
                    i > width + 1 &&
                    !isLeftEdge &&
                    squares[i - 1 - width].classList.contains("bomb")
                )
                    total++;

                // right
                if (
                    i < width * height - 1 &&
                    !isRightEdge &&
                    squares[i + 1].classList.contains("bomb")
                )
                    total++;

                // bottom left
                if (
                    i < width * (height - 1) &&
                    !isLeftEdge &&
                    squares[i - 1 + width].classList.contains("bomb")
                )
                    total++;

                // bottom right
                if (
                    i < width * (height - 1) - 2 &&
                    !isRightEdge &&
                    squares[i + 1 + width].classList.contains("bomb")
                )
                    total++;

                // bottom
                if (
                    i < width * (height - 1) - 1 &&
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

        if (!isGameOver) {
            document.getElementById("bombs_count").innerText =
                bombAmount - flags;
        }
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
                let colour = "";
                switch (total * 1) {
                    case 1:
                        colour = "blue";
                        break;
                    case 2:
                        colour = "green";
                        break;
                    case 3:
                        colour = "red";
                        break;
                    case 4:
                        colour = "dark-blue";
                        break;
                    case 5:
                        colour = "brown";
                        break;
                    case 6:
                        colour = "cyan";
                        break;
                    case 8:
                        colour = "grey";
                        break;
                    default:
                        break;
                }
                square.classList.add(colour);
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

    const playSound = async (status) => {
        const audioFile = status == 1 ? "winner.mp3" : "sad.mp3";
        const context = new AudioContext();
        const source = context.createBufferSource();
        const request = new XMLHttpRequest();
        request.open("GET", audioFile, true);
        request.responseType = "arraybuffer";

        request.onload = () => {
            const audioData = request.response;
            console.log(audioData);

            context.decodeAudioData(audioData, (buffer) => {
                source.buffer = buffer;
                source.connect(context.destination);
                source.start(0);
            });
        };

        request.send();
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

        playSound(status);

        const retry = document.querySelector(".retry__text");
        retry.addEventListener("click", () => {
            window.location.reload();
        });
        retry.classList.remove("hide");
        retry.innerText = "New Game ▶";

        isGameOver = true;
    };
});
