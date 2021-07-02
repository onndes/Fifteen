"use strict";
const field = document.querySelector(".field"),
    dist = 147,
    modalWin = document.querySelector(".modal-window-win"),
    boxStopWatch = document.querySelector("#stopwatch"),
    newStyle = document.querySelector(".new-style"),
    head = document.querySelector("head");

const linkStyle = document.createElement("link");
linkStyle.rel = "stylesheet";
linkStyle.href = "css/style-new-disign.css";
linkStyle.id = "linkStyle";

if (localStorage.getItem("triggerNewStyle") != "new") {
    localStorage.setItem("triggerNewStyle", "old");
}
let getStyle = localStorage.getItem("triggerNewStyle");

function functionChangeStyle() {
    if (localStorage.getItem("triggerNewStyle") === "old") {
        head.append(linkStyle);
        localStorage.setItem("triggerNewStyle", "new");
    } else if (localStorage.getItem("triggerNewStyle") === "new") {
        localStorage.setItem("triggerNewStyle", "old");
        document.querySelector("#linkStyle").remove();
    }
}
function onOldStyle() {
    localStorage.setItem("triggerNewStyle", "old");
    if (document.querySelector("#linkStyle")) {
        document.querySelector("#linkStyle").remove();
    }
}
function onNewStyle() {
    head.append(linkStyle);
    localStorage.setItem("triggerNewStyle", "new");
}
if (getStyle === "old") {
    onOldStyle();
} else if (getStyle === "new") {
    onNewStyle();
}

newStyle.addEventListener("click", functionChangeStyle);

let counerStopTimer = 0;
const checkPosition = {};

function nowGanerateGame() {
    const spanStep = document.querySelector("#step");
    const position = {};
    let randomArrNum = [];
    let counterStep = 0;

    spanStep.textContent = counterStep;

    generateRandomNumArr();

    function generateHTMLSquare(id) {
        const square = document.createElement("div"),
            p = document.createElement("p");
        p.classList.add("text-number");
        p.textContent = id;
        square.append(p);
        square.classList.add("square", `square-${id}`);
        square.id = `el-${id}`;
        field.append(square);
    }

    function generateRandomNumArr() {
        for (let i = 0; i < 15; i++) {
            let num = generateRandomNum();
            let triger = false;
            randomArrNum.forEach((el) => {
                if (el === num) {
                    triger = true;
                    i--;
                }
            });
            if (triger === false) {
                randomArrNum.push(num);
            }
        }
        if (checkPositionWin(randomArrNum)) {
            randomArrNum = [];
            generateRandomNumArr();
        }
    }

    function creatingSquares() {
        randomArrNum.forEach((el) => {
            generateHTMLSquare(el);
        });
    }
    creatingSquares();

    function generateRandomPositonTopWidth() {
        for (let i = 1, d = 0; i <= 4; i++, d += dist) {
            position[`p${i}`] = [0, d];
            position[`p${i + 4}`] = [dist, d];
            position[`p${i + 8}`] = [dist * 2, d];
            position[`p${i + 12}`] = [dist * 3, d];

            checkPosition[`pos${i}`] = [false, 0, d];
            checkPosition[`pos${i + 4}`] = [false, dist, d];
            checkPosition[`pos${i + 8}`] = [false, dist * 2, d];
            checkPosition[`pos${i + 12}`] = [false, dist * 3, d];
        }
    }
    generateRandomPositonTopWidth();

    let squareEl = document.querySelectorAll(".square");
    field.addEventListener("click", handleClickSquereEl);
    field.addEventListener("click", handleClickStartStopWatch, { once: true });

    function randomPlacement() {
        for (let i = 1; i <= 15; i++) {
            squareEl[i - 1].style.cssText = `top: ${position["p" + i][0]}px; 
                                      left: ${position["p" + i][1]}px`;
        }
    }
    randomPlacement();

    function checkEmptyPositionTest() {
        for (let key in checkPosition) {
            checkPosition[key][0] = false;
            squareEl.forEach((el) => {
                let top = parseInt(window.getComputedStyle(el).top);
                let left = parseInt(window.getComputedStyle(el).left);
                if (checkPosition[key][1] == top && checkPosition[key][2] == left) {
                    checkPosition[key][0] = true;
                }
            });
        }
    }
    checkEmptyPositionTest();

    function handleClickStartStopWatch() {
        stopWatch();
    }

    function handleClickSquereEl(e) {
        let maxDistTop = parseInt(window.getComputedStyle(e.target.parentElement).top);
        let maxDistLeft = parseInt(window.getComputedStyle(e.target.parentElement).left);
        for (let key in checkPosition) {
            if (checkPosition[key][0] === false) {
                if (
                    checkPosition[key][1] - maxDistTop <= dist &&
                    checkPosition[key][1] - maxDistTop >= -dist &&
                    checkPosition[key][2] - maxDistLeft <= dist &&
                    checkPosition[key][2] - maxDistLeft >= -dist
                ) {
                    if (maxDistTop == checkPosition[key][1] || maxDistLeft == checkPosition[key][2]) {
                        e.target.parentElement.style.top = `${checkPosition[key][1]}px`;
                        e.target.parentElement.style.left = `${checkPosition[key][2]}px`;
                        checkEmptyPositionTest();
                        checkWin();
                        counterStep++;
                        spanStep.textContent = counterStep;
                        return;
                    }
                }
            }
        }
    }
}
nowGanerateGame();

function checkWin() {
    let trigger = 0;
    let c = 15;
    for (let i = 1; i <= c; i++) {
        let el = document.querySelector(`#el-${i}`);
        let top = parseInt(window.getComputedStyle(el).top);
        let left = parseInt(window.getComputedStyle(el).left);
        if (checkPosition[`pos${i}`][1] == top && checkPosition[`pos${i}`][2] == left) {
            trigger++;
        } else {
            trigger;
        }
    }

    if (trigger == c) {
        counerStopTimer++;
        const pauseAlertWin = setTimeout(() => {
            modalWin.classList.add("show");
        }, 0);
        const btnNewGame = document.querySelector(".modal-window-win__text-2");
        btnNewGame.addEventListener("click", () => {
            modalWin.classList.remove("show");
            window.location.reload();
            // field.innerHTML = "";
            // nowGanerateGame();
        });
    }
}

function generateRandomNum(col = 16) {
    const num = Math.floor(Math.random() * (col - 1) + 1);
    return num;
}

function checkPositionWin(randomArrNum) {
    let checkNum = 0;
    let couneter = 0;
    randomArrNum.forEach((el, idx) => {
        for (let i = idx; i <= 15; i++) {
            if (el > randomArrNum[i]) {
                couneter++;
            }
        }
    });
    if (couneter % 2 == 1) {
        return 1;
    }
    return 0;
}
const btnNewGame = document.querySelector("#btn-generation");
btnNewGame.addEventListener("click", () => {
    window.location.reload();
    // field.innerHTML = "";
    // nowGanerateGame();
});

function stopWatch() {
    let seconds = 0;
    let minutes = 0;
    let hourse = 0;
    const timer = setInterval(() => {
        if (counerStopTimer) clearInterval(timer);

        seconds++;
        // minutes = 0;
        // hourse = 0;
        if (seconds >= 60) {
            minutes++;
            seconds = 0;
        }
        if (minutes >= 60) {
            hourse++;
            minutes = 0;
            seconds = 0;
        }
        if (seconds < 10) seconds = `0${seconds}`;
        if (minutes < 10) minutes = `0${minutes - 0}`;
        if (hourse < 10) hourse = `0${hourse - 0}`;
        boxStopWatch.textContent = `${hourse}:${minutes}:${seconds}`;
    }, 1000);
}
