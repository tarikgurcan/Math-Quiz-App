// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');
//Buttons
const rightBtn=document.querySelector(".right")
const wrongBtn=document.querySelector(".wrong")
const againBtn=document.querySelector(".play-again")

// Equations
let questionsAmount = 0;
let equationsArray = [];
let playerguess=[]

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

let valueY=0;

//Time

let timerInterval;
let timePlayed=0;
let baseTime=0;
let penaltyTime=0;
let finalTime=0;
let finalTimeDisplay="0.0s"


eventListeners();

function eventListeners(){
    startForm.addEventListener("click",selectedItem)
    startForm.addEventListener("submit",decideQuestionAmount)
    rightBtn.addEventListener("click",()=>select(true))
    wrongBtn.addEventListener("click",()=>select(false))
    gamePage.addEventListener("click",timer)
    againBtn.addEventListener("click",playAgain)

}

function playAgain(){
    gamePage.addEventListener("click",timer)
    scorePage.hidden=true;
    splashPage.hidden=false;
    equationsArray=[];
    playerguess=[];
    valueY=0;   

}

function selectedItem(e){
    radioContainers.forEach((radioEl)=>{
        radioEl.classList.remove("selected-label")
    })
    const selectedLabel=e.target.parentElement;
    if(selectedLabel.children.length===3){
        selectedLabel.classList.add("selected-label")
        questionsAmount=e.target.value
    }
}

function gameStart(){
    itemContainer.textContent=""; 
    const topSpace=document.createElement("div")
    topSpace.className="height-240"
    const selectedItem=document.createElement("div")
    selectedItem.className="selected-item"
    itemContainer.append(topSpace,selectedItem)
    createEquations();
    equationsToDom();
    const bottomSpace=document.createElement("div")
    bottomSpace.className="height-500"
    itemContainer.appendChild(bottomSpace)
}

function countDownStart(){
    countdown.textContent="3"
    setTimeout(()=>{
        countdown.textContent="2"
    },1000)
    setTimeout(()=>{
        countdown.textContent="1"
    },2000)
    setTimeout(()=>{
        countdown.textContent="GO!"
    },3000)
    
}

function decideQuestionAmount(e){
    if(questionsAmount){
        showCountdown()
    }

    e.preventDefault();
}

//Navigate splash Page to Countdown Page
function showCountdown(){
    countdownPage.hidden=false;
    splashPage.hidden=true;
    countDownStart();
    gameStart();
    setTimeout(()=>{
        showGamePage();
    },4000)
}

function createEquations(){
    const correctEquations = Math.floor(Math.random()*questionsAmount)+1;
    const wrongEquations = questionsAmount-correctEquations;


    for(let i =0;i<correctEquations;i++){
        firstNumber=Math.floor(Math.random()*9)+1
        secondNumber=Math.floor(Math.random()*9)+1
        const equationValue=firstNumber*secondNumber;
        const equation=`${firstNumber}x${secondNumber}=${equationValue}`
        const equationObject={value:equation,evaluated:"true"}
        equationsArray.push(equationObject)
    }
    for(let i =0;i<wrongEquations;i++){
        firstNumber=Math.floor(Math.random()*9)+1
        secondNumber=Math.floor(Math.random()*9)+1
        const randomnumber=Math.floor(Math.random()*9)
        const equationValue=firstNumber*secondNumber;
        wrongFormat[0]=`${firstNumber+randomnumber}x${secondNumber}=${equationValue}`
        wrongFormat[1]=`${firstNumber}x${secondNumber+randomnumber}=${equationValue}`
        wrongFormat[2]=`${firstNumber}x${secondNumber}=${equationValue+randomnumber}`
        const equation=wrongFormat[Math.floor(Math.random()*3)]
        const equationObject={value:equation,evaluated:"false"}
        equationsArray.push(equationObject)
    }


}

function equationsToDom(){

    equationsArray.forEach((equations=>{
        let div=document.createElement("div")
        div.className="item"
        let equationText=document.createElement("h1")
        equationText.textContent=equations.value;
        div.appendChild(equationText)
        itemContainer.appendChild(div)
    }))
}

function showGamePage(){
    gamePage.hidden=false;
    countdownPage.hidden=true
}

function select(guess){
    valueY+=80;
    itemContainer.scroll(0,valueY)
    return guess?playerguess.push("true"):playerguess.push("false")

}

function timer(){
    timePlayed=0;
    penaltyTime=0;
    finalTime=0;
    timerInterval=setInterval(addTime,100)
    gamePage.removeEventListener("click",timer)
}

function addTime(){
    timePlayed+=0.1
    endTimer();
}

const endTimer=()=>{
    if(playerguess.length===Number(questionsAmount)){
        clearInterval(timerInterval)

        const falseAnswers=playerguess.filter((data,index)=>{
            return data!==equationsArray[index].evaluated
            
        })
        penaltyTime=falseAnswers.length*0.5
        finalTime=timePlayed+penaltyTime
        scoresToDOM();
    }
}

function scoresToDOM(){
    finalTimeDisplay=finalTime.toFixed(1);
    baseTime=timePlayed.toFixed(1);
    penaltyTime=penaltyTime.toFixed(1);
    finalTimeEl.textContent=`${finalTimeDisplay}s`
    baseTimeEl.textContent=`Base Time is ${baseTime}`
    penaltyTimeEl.textContent=`Penalty Time: ${penaltyTime}`
    itemContainer.scrollTo({top:0,behavior:"instant"})
    showScorePage();

}

function showScorePage(){
    gamePage.hidden=true;
    scorePage.hidden=false;
}
