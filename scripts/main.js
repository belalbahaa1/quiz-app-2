// select elements
let countSpan = document.querySelector(".count span"),
  bulletsSpanContainer = document.querySelector(".bullets .spans"),
  quizArea = document.querySelector(".quiz-area"),
  answersArea = document.querySelector(".answer-area"),
  subBtn = document.querySelector(".submit-btn"),
  bullets = document.querySelector(".bullets"),
  resultsContainer = document.querySelector(".results"),
  countdownElement = document.querySelector(".countdown");

// set options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

// fetching the data from my "html_questions.json"
function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let qCount = questionsObject.length;

      // create bullets + set questions count
      createBullets(qCount);

      //add question data
      addQuestionsData(questionsObject[currentIndex], qCount);

      // start countdown
      countdown(5, qCount);

      // click on submit
      subBtn.onclick = () => {
        // get right answer
        let theRightAnswer = questionsObject[currentIndex].right_answer;

        // increase Index
        currentIndex++;

        // check the answer
        checkAnswer(theRightAnswer, qCount);

        // Remove Previous Question
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";

        //add question data
        addQuestionsData(questionsObject[currentIndex], qCount);

        // handle bullets class
        handleBullets();

        // start countdown
        clearInterval(countdownInterval);
        countdown(5, qCount);

        // show results
        showResults(qCount);
      };
    }
  };

  myRequest.open("GET", "html_questions.json", true);
  myRequest.send();
}

getQuestions();
// end fetching

function createBullets(num) {
  countSpan.innerHTML = num;

  // create bullet
  for (let i = 0; i < num; i++) {
    // create span
    let theBullet = document.createElement("span");
    // check if its first span or question
    if (i === 0) {
      theBullet.className = "on";
    }
    // append bullets to main bullet container
    bulletsSpanContainer.appendChild(theBullet);
  }
}

//

function addQuestionsData(obj, count) {
  if (currentIndex < count) {
    // create h2 question title
    let questionsTitle = document.createElement("h2");

    //create question text
    let questionText = document.createTextNode(obj.title);

    //append text to h2
    questionsTitle.appendChild(questionText);

    // append the h2 to the quiz area
    quizArea.appendChild(questionsTitle);

    // create the answers
    for (let i = 1; i <= 4; i++) {
      // create main answer div
      let mainDiv = document.createElement("div");

      // add class to main div
      mainDiv.className = "answer";

      // create radio input
      let radioInput = document.createElement("input");

      // add type + name + id + data-attribute
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      // make first option selected

      if (i === 1) {
        radioInput.checked = true;
      }

      // create label
      let theLabel = document.createElement("label");

      // add for Attribute
      theLabel.htmlFor = `answer_${i}`;

      // create label text
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);

      // add the text to label
      theLabel.appendChild(theLabelText);

      //add input + label to main div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      // append ever div to answers area
      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, count, qCount) {
  let answers = document.getElementsByName("question");
  let theChosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChosenAnswer = answers[i].dataset.answer;
    }
  }

  if (rAnswer === theChosenAnswer) {
    rightAnswers++;
  }
  qCount--;
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);

  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    subBtn.remove();
    bullets.remove();
    resultsContainer.classList.add("afterFinished");

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = ` <h2>
      <span class="perfect">Perfect</span> <br />
      You answered ${rightAnswers} from ${count}
    </h2> `;
    } else if (rightAnswers === count) {
      theResults = ` <h2>
      <span class="good">Good</span> <br />
      You answered ${rightAnswers} from ${count}
    </h2> `;
    } else {
      theResults = ` <h2>
      <span class="bad">Bad</span> <br />
      You answered ${rightAnswers} from ${count}
    </h2> `;
    }

    resultsContainer.innerHTML = theResults;
  }
}

function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes} : ${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        subBtn.click();
      }
    }, 1000);
  }
}
