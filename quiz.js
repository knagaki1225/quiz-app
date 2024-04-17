"use strict";

// 地理のクイズデータ
const data = [

    {
        question: "日本で一番面積の大きい都道府県は？",
        answers: ["北海道", "東京都", "沖縄県", "福岡県"],
        correct: "北海道"
    },

    {
        question: "日本で一番人口の多い都道府県は？",
        answers: ["北海道", "東京都", "沖縄県", "福岡県"],
        correct: "東京都"
    },

    {
        question: "日本で一番人口密度の高い都道府県は？",
        answers: ["北海道", "東京都", "沖縄県", "福岡県"],
        correct: "東京都"
    },
    {
        question: "日本で一番高い山は？",
        answers: ["岩手山", "富士山", "早池峰山", "北岳"],
        correct: "富士山"
    }

]

// 出題する問題数
const QUESTION_LENGTH = 4;
// 解答時間(ms)
const ANSWER_TIME_MS = 10000;
// インターバル時間(ms)
const INTERVAL_TIME_MS = 10;

// 解答の開始時間
let startTime = null;

// 解答中の経過時間
let elapsedTime = 0;

// インターバルID
let intervalId = null;

// 出題する問題データ
let questions = getRandomQuestions();

//　出題する問題のインデックス
let questionindex = 0;

// 正答数
let correctCount = 0;




// 要素一覧
const startPage = document.getElementById(`startPage`);
const questionPage = document.getElementById(`questionPage`);
const reusltPage = document.getElementById(`resultPage`);

const startButton = document.getElementById(`startButton`);

const questionNumber = document.getElementById(`questionNumber`);
const questionText = document.getElementById(`questionText`);
const optionButton = document.querySelectorAll(`#questionPage button`);
const questionProgress = document.getElementById(`questionProgress`);

const reusltMessage = document.getElementById(`resultMessage`);
const backButton = document.getElementById(`backButton`);

const dialog = document.getElementById(`dialog`);
const questionResult = document.getElementById(`questionResult`);
const nextButton = document.getElementById(`nextButton`);

// 処理

startButton.addEventListener(`click`, clickStartButton);

optionButton.forEach((button) => {
    button.addEventListener(`click`, clickOptionButton);
});

nextButton.addEventListener("click", clickNextButton);
backButton.addEventListener(`click`, clickBackButton);


// 関数一覧　

function questionTimeOver() {
    // 時間切れの場合は不正解とする
    questionResult.innerText = "×";
    // ダイアログのボタンのテキストを設定する
    if (isQuestionEnd()) {
        nextButton.innerText = "結果を見る";
    } else {
        nextButton.innerText = "次の問題へ";
    }
    // ダイアログ表示
    dialog.showModal();
}

function startProgress() {
    // 開始時間（タイムスタンプ）を取得する
    startTime = Date.now();
    // インターバルを開始する
    intervalId = setInterval(() => {
        // 現在の時刻（タイムスタンプ）を取得
        const currentTime = Date.now();
        // 経過時間を計算する
        const progress = ((currentTime - startTime) / ANSWER_TIME_MS) * 100;
        // progressバーに経過時間を反映（表示）する
        questionProgress.value = progress;
        // 経過時間が解答時間を超えた場合、インターバルが停止する
        if (startTime + ANSWER_TIME_MS <= currentTime) {
            stopProgress();
            questionTimeOver();
            return;
        }
        // 経過時間を更新（加算）する
        elapsedTime += INTERVAL_TIME_MS;
    }, INTERVAL_TIME_MS)
}

function stopProgress() {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

function reset() {
    // 出題する問題をランダムに取得する
    questions = getRandomQuestions();
    // 出題する問題のインデックスを初期化する
    questionindex = 0;
    // 正解数を初期化する
    correctCount = 0;
    // インターバルIDを初期化する
    intervalId = null;
    // 解答中の経過時間を初期化する
    elapsedTime = 0;
    // 開始時間を初期化する
    startTime = null;
    // ボタンを有効化する
    for (let i = 0; i < optionButton.length; i++) {
        optionButton[i].removeAttribute(`disabled`);
    }
}

function isQuestionEnd() {
    return questionindex + 1 === QUESTION_LENGTH;
}

function getRandomQuestions() {
    // 出題する問題のインデックスリスト
    const questionindexList = [];
    while (questionindexList.length !== QUESTION_LENGTH) {
        // 出題する問題のインデックスをランダムに生成する
        const index = Math.floor(Math.random() * data.length);
        // インデックスリストに含まれていない場合、インデックスリストに追加する
        if (!questionindexList.includes(index)) {
            questionindexList.push(index);
        }
    }
    // 出題する問題リストを取得する
    const questionList = questionindexList.map((index) => data[index]);
    return questionList;
}

function setResult() {
    // 正答率を計算する
    const accurary = Math.round((correctCount / QUESTION_LENGTH) * 100);
    // 正答率を表示する
    reusltMessage.innerText = `正答率: ${accurary}%`;
}

function setQuestion() {
    // 問題を取得
    const question = questions[questionindex];
    // 問題番号を表示
    questionNumber.innerText = `第${questionindex + 1}問`;
    // 問題文を表示
    questionText.innerText = question.question;
    // 選択肢を表示
    for (let i = 0; i < optionButton.length; i++) {
        optionButton[i].innerText = question.answers[i];
    }
}

// イベント関数の関数一覧

function clickOptionButton(event) {
    // 解答中の経過時間を停止する
    stopProgress();
    // すべての選択肢を無効化する
    optionButton.forEach((button) => {
        button.disabled = true;
    });
    // 選択した選択肢のテキストを取得する
    const optionText = event.target.innerText;
    // 正解のテキストを取得

    const correctText = questions[questionindex].correct;
    if (optionText === correctText) {
        correctCount += 1;
        questionResult.innerText = "〇"
    } else {
        questionResult.innerText = "×"
    }

    // 最後の問題かどうか判別
    if (isQuestionEnd()) {
        nextButton.innerText = "結果を見る";
    } else {
        nextButton.innerText = "次の問題へ";
    }

    // ダイアログの表示
    dialog.showModal();
}

function clickStartButton() {
    // クイズをリセットする
    reset();
    // 問題画面に問題を設定
    setQuestion();
    // 解答の計算を開始する
    startProgress();
    // スタート画面を非表示にする
    startPage.classList.add(`hidden`);
    // 問題画面を表示にする
    questionPage.classList.remove(`hidden`);
    // 結果画面を非表示にする
    reusltPage.classList.add(`hidden`);
}

function clickNextButton() {
    if (isQuestionEnd()) {

        // 正答率を設定する
        setResult();
        // ダイアログを閉じる
        dialog.close();
        // スタート画面を非表示にする
        startPage.classList.add(`hidden`);
        // 問題画面を非表示にする
        questionPage.classList.add(`hidden`);
        // 結果画面を表示にする
        reusltPage.classList.remove(`hidden`);

    } else {
        questionindex++;
        // 問題画面に問題を設定
        setQuestion();
        // 回答中の経過時間を初期化する
        intervalId = null;
        // すべての選択肢を有効化する
        elapsedTime = 0;
        for (let i = 0; i < optionButton.length; i++) {
            optionButton[i].removeAttribute(`disabled`);
        }
        // ダイアログを閉じる
        dialog.close();
        // 解答の計算を開始する
        startProgress();
    }
}


function clickBackButton() {

    // スタート画面を表示にする
    startPage.classList.remove(`hidden`);
    // 問題画面を非表示にする
    questionPage.classList.add(`hidden`);
    // 結果画面を非表示にする
    reusltPage.classList.add(`hidden`);
}