const pattern = "012,345,678,036,147,258,048,246,435,453,471,417,408,480".split(",");
const boxes = document.querySelectorAll('.box');
let header = document.querySelector('.header');
let wrappedDiv = document.querySelector('.wrapper');
let resultDiv = document.querySelector('.result');
let winnerName = document.querySelector('.winnerName');
let score = document.querySelectorAll('.sepScore h5 .score');
let total = document.querySelector('.total');
let scorePerWin = document.querySelector('.scorePerWin');
let switchAI = document.querySelector('.label');
let switchOnOff = document.querySelector('#switch');
let switchBar = document.querySelector('.switchOnOff');
let scoreValueZ = 0,
  scoreValueX = 0;
let turn = 0;
let stoppingTurn = 0;
let zero = '';
let x = '';

window.onload = () => {
  scoreValueZ = Number(localStorage.getItem("valueZ"));
  scoreValueX = Number(localStorage.getItem("valueX"));
  score[0].innerHTML = scoreValueZ;
  score[1].innerHTML = scoreValueX;
}

function letter(text, inner) {
  let words = "";
  let counter = -1;
  setInterval(() => {
    counter++;
    if (text.length > counter) {
      words += text[counter];
      document.querySelector(inner).innerHTML = words;
    }
  }, 50);
  return words;
};

boxes.forEach((v, i) => {
  v.onclick = () => {
    if (turn === 0) {
      stoppingTurn++;
      turn = 1;
      zero += (i).toString();
      v.innerHTML = "◯";
      header.innerHTML = letter("Now X's turn!", ".header");
      v.style.pointerEvents = "none";
      winner(zero, x);
    } else {
      stoppingTurn++;
      turn = 0;
      x += (i).toString();
      v.innerHTML = "⛌";
      header.innerHTML = letter("Now O's turn!", ".header");
      v.style.pointerEvents = "none";
      winner(zero, x);
    }
  }
});

function winner(zero, x) {
  let zeroMatch = '';
  let xMatch = '';
  pattern.forEach(v => {
    if (zero.includes(v[0]) && zero.includes(v[1]) && zero.includes(v[2])) {
      zeroMatch = v;
    } else if (x.includes(v[0]) && x.includes(v[1]) && x.includes(v[2])) {
      xMatch = v;
    }
  });
  if (zeroMatch.length === 3) {
    winnerName.innerHTML = '◯ wins';
    resultDiv.style.display = "block";
    wrappedDiv.style.filter = "blur(5px)";
    scoreValueZ += 10;
    score[0].innerHTML = scoreValueZ;
    total.innerHTML = `Total Score: ${scoreValueX + scoreValueZ}`;
    localStorage.setItem("valueZ", scoreValueZ);
  } else if (xMatch.length === 3) {
    winnerName.innerHTML = '⛌ wins';
    resultDiv.style.display = "block";
    wrappedDiv.style.filter = "blur(5px)";
    scoreValueX += 10;
    total.innerHTML = `Total Score: ${scoreValueX + scoreValueZ}`;
    score[1].innerHTML = scoreValueX;
    localStorage.setItem("valueX", scoreValueX);
  } else if (stoppingTurn === 9) {
    header.innerHTML = letter("Game Over!", ".header");
    winnerName.innerHTML = 'No Winner';
    resultDiv.style.display = "block";
    wrappedDiv.style.filter = "blur(5px)";
    scorePerWin.innerHTML = "Your Score : 00";
  }
}

function newStart() {
  localStorage.removeItem("valueZ");
  localStorage.removeItem("valueX");
  location.reload();
}

function keepPlay() {
  location.reload();
}

function scoreBoard() {
  resultDiv.style.display = "block";
  total.innerHTML = `Total Score: ${scoreValueX + scoreValueZ}`;
  scorePerWin.innerHTML = "Your Score : 00";
}

switchAI.onclick = () => {
  switchOnOff.onclick = () => {
    if (switchOnOff.checked) {
      let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      let randomArrIndex = 9;
      switchBar.innerHTML = letter('Activated', ".switchOnOff");
      header.innerHTML = letter("Your turn - ◯!", ".header");

      boxes.forEach((v, i) => {
        v.onclick = () => {
          stoppingTurn++;
          zero += (i).toString();
          v.innerHTML = "◯";
          header.innerHTML = letter("AI's turn - ⛌!", ".header");
          v.style.pointerEvents = "none";
          winner(zero, x);
          if (arr.includes(i)) {
            let findIndex = arr.indexOf(i);
            arr.splice(findIndex, 1);
          }
          setTimeout(() => {
            AI();
          }, 2000);
        }
      });

      function AI() {
        randomArrIndex -= 2;
        if (randomArrIndex < 0) {
          randomArrIndex++;
        }

        //randomArr
        let randomArr = "";
        arr.forEach((v, i) => {
          for (let i = -1; i < arr.length; i++) {
            let ran = Math.floor(Math.random() * arr.length);
            randomArr += arr[ran];
          }
        });
        randomArr = randomArr.split("").filter((v, i, arr) => {
          return arr.indexOf(v) === i;
        });
        // randomArr--

        boxes[randomArr[randomArrIndex]].innerHTML = "⛌";
        boxes[randomArr[randomArrIndex]].style.animation = "lightFlipping 2.5s linear infinite alternate";
        boxes[randomArr[randomArrIndex]].style.pointerEvents = "none";
        stoppingTurn++;
        header.innerHTML = letter("Your turn - ◯!", ".header");
        x += ([randomArr[randomArrIndex]]).toString();
        winner(zero, x);
        if (arr.includes(Number(randomArr[randomArrIndex]))) {
          let findIndex = arr.indexOf(Number(randomArr[randomArrIndex]));
          arr.splice(findIndex, 1);
        }
      }
    } else {
      switchBar.innerHTML = "";
    }
  }
}
