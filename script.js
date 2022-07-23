var currentQuizz;

function chooseQuizz() {
  let chooseQuizz = document.querySelectorAll(".choosing-quizz > div");
  chooseQuizz.forEach((x) => {
    if (x.classList.contains("js-quizz")) {
      x.onclick = () => {
        currentQuizz = "js_quizz.json";
        quizzFetching("js_quizz.json");
        closeChooseQuizz();
      };
    } else {
      x.onclick = () => {
        currentQuizz = "html_quizz.json";
        quizzFetching("html_quizz.json");
        closeChooseQuizz();
      };
    }
  });
  function closeChooseQuizz() {
    document.querySelector(".choosing-quizz").style.transition = "0.3s";
    document.querySelector(".choosing-quizz").style.opacity = 0;
    setTimeout(() => {
      document.querySelector(".choosing-quizz").remove();
    }, 100);
  }
}

chooseQuizz();

async function quizzFetching(dir) {
  try {
    let data = await fetch(dir);
    let res = shuffling(await data.json());
    appending(res);
  } catch (r) {
    console.log(r);
  }
}

// Current Quizz
let currentQues = 0;

function appending(quizz) {
  // Timing
  let timer = document.querySelector(".timer");
  let min = 2,
    sec = 59;
  timer.textContent = `0${min}:${sec}`;
  let quizzTimer = setInterval(() => {
    if (sec === 0) {
      if (min === 0) {
        document.querySelector(".fails").textContent++;
        document.querySelectorAll(".ans").forEach((a) => {
          if (a.textContent === quizz[currentQues]["right_answer"]) {
            a.style = "background-color: #01a091;";
          }
        });
        let doneQuizz = document.getElementById("done");
        let lis = document.querySelectorAll("ul li");
        doneQuizz.classList.add("clicked");
        setTimeout(() => {
          lis[currentQues].classList.add("wrong-ans");
          if (lis[currentQues]) lis[currentQues].classList.remove("curr-ans");
          currentQues++;
          if (lis[currentQues]) lis[currentQues].classList.add("curr-ans");
          appending(quizz);
        }, 1500);
        clearInterval(quizzTimer);
      } else {
        min--;
        sec = 59;
      }
    } else if (sec < 9) {
      sec--;
      timer.textContent = `0${min}:0${sec}`;
    } else {
      sec--;
      timer.textContent = `0${min}:${sec}`;
    }
  }, 1000);

  //
  if (currentQues < quizz.length) {
    // If There Were Done Question Before
    if (document.getElementById("done").classList.contains("clicked")) {
      document.getElementById("done").classList.remove("clicked");
    }
    // Questions Counter
    let questionsCounter = document.querySelector(".number-of-questions");
    questionsCounter.textContent = `${currentQues + 1}/${quizz.length}`;
    // Question
    let questionBody = document.querySelector(".ques");
    let questionText = document.createTextNode(quizz[currentQues]["question"]);
    questionBody.textContent = "";
    questionBody.appendChild(questionText);

    // Answers And Shuffling It
    let allAnswers = [
      quizz[currentQues]["choice_1"],
      quizz[currentQues]["choice_2"],
      quizz[currentQues]["choice_3"],
      quizz[currentQues]["choice_4"],
    ];
    allAnswers = shuffling(allAnswers);
    let ansBodies = document.querySelectorAll(".ans");
    for (let i = 0; i < allAnswers.length; i++) {
      ansBodies[i].textContent = "";
      ansBodies[i].style = "";
      if (ansBodies[i].classList.contains("active")) {
        ansBodies[i].classList.remove("active");
      }
      let text = document.createTextNode(allAnswers[i]);
      ansBodies[i].appendChild(text);
    }

    // Clicking Answers
    let answers = document.querySelectorAll(".ans");
    if (currentQues === 0) {
      answers.forEach((ans) => {
        ans.addEventListener("click", (e) => {
          if (!document.getElementById("done").classList.contains("clicked")) {
            if (e.target.classList.contains("active"))
              e.target.classList.remove("active");
            else {
              answers.forEach((ans) => {
                if (ans.classList.contains("active"))
                  ans.classList.remove("active");
              });
              e.target.classList.add("active");
            }
          }
        });
      });
    }

    // Question List
    if (currentQues === 0) {
      let questionList = document.querySelector(".questions-list");
      for (let i = 0; i < quizz.length; i++) {
        let li = document.createElement("li");
        if (i === 0) li.classList.add("curr-ans");
        questionList.appendChild(li);
      }
    }
    let lis = document.querySelectorAll(".questions-list li");

    // Clicking Done
    let wrongAnsCounter = document.querySelector(".fails");
    let rightAnsCounter = document.querySelector(".success");
    let doneQuizz = document.getElementById("done");
    doneQuizz.addEventListener("click", () => {
      clearInterval(quizzTimer);
      let chosed = document.querySelector(".ans.active");
      if (!doneQuizz.classList.contains("clicked")) {
        if (!chosed) {
          wrongAnsCounter.textContent++;
          lis[currentQues].classList.add("wrong-ans");
          answers.forEach((ans) => {
            if (ans.textContent === quizz[currentQues]["right_answer"])
              ans.style = "background-color: #01a091";
          });
        } else if (chosed.textContent !== quizz[currentQues]["right_answer"]) {
          wrongAnsCounter.textContent++;
          lis[currentQues].classList.add("wrong-ans");
          chosed.style = "background-color: #f32e1f";
          answers.forEach((ans) => {
            if (ans.textContent === quizz[currentQues]["right_answer"])
              ans.style = "background-color: #01a091";
          });
        } else {
          rightAnsCounter.textContent++;
          lis[currentQues].classList.add("right-ans");
          chosed.style = "background-color: #01a091";
        }
        doneQuizz.classList.add("clicked");
        setTimeout(() => {
          if (lis[currentQues]) lis[currentQues].classList.remove("curr-ans");
          currentQues++;
          if (lis[currentQues]) lis[currentQues].classList.add("curr-ans");
          appending(quizz);
        }, 1500);
      }
    });
  } else {
    endingScreen(document.querySelector(".success").textContent, quizz.length);
  }
}

function endingScreen(rightAns, all) {
  let div = document.createElement("div");
  div.classList.add("ending");
  let header = document.createElement("h3");
  let precentage = document.createElement("h2");
  let precentText = document.createTextNode(`${(rightAns / all) * 100}%`);
  precentage.appendChild(precentText);
  div.appendChild(precentage);
  if ((rightAns / all) * 100 > 80) {
    header.textContent += "You Are A Legend!";
  } else if ((rightAns / all) * 100 > 50) {
    header.textContent += "You Can Do It Better!";
  } else {
    header.textContent += "You Should Try Again!";
  }
  let repeatBtn = document.createElement("div");
  repeatBtn.classList.add("repeat");
  repeatBtn.innerHTML = `<div class="btn"> Repeat</div> <span></span>`;
  div.style.opacity = "0";
  div.appendChild(header);
  div.appendChild(repeatBtn);
  document.body.appendChild(div);
  setTimeout(() => {
    div.style = "";
    repeatBtn.addEventListener("click", () => {
      location.reload();
    });
  }, 250);
}

function shuffling(arr) {
  let i = 0;
  while (i < 10) {
    let t1 = Math.floor(Math.random() * arr.length);
    let t2 = Math.floor(Math.random() * arr.length);
    [arr[t1], arr[t2]] = [arr[t2], arr[t1]];
    i++;
  }
  return arr;
}
