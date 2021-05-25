// Example Game Scores
//calcScores('X X X X X X X X X XXX');

// Create JSON Object to store each ball throw
var balls = {};

//Create variable to hold game scores
var gameScores = "";

var curFrameBall = 0;
var curFrameBallLimit = 3;
var ballNum = 0;
var curFrame = 1;
var remPins = 10;
var ballStatus = "";

//Initialize Buttons
RenderButtons(remPins);

function RenderButtons(remPins){
    //Reset Pin Buttons
    document.getElementById("ballbuttons").innerHTML = "";
    document.getElementById("ballbuttons").innerHTML += "<button value='0' class='btnPins' onclick='ThrowBall(this.value);'>0</button> "
    
    for (let index = 1; index <= remPins; index++) {
        //Render Pin Buttons
        document.getElementById("ballbuttons").innerHTML += "<button value='" + index + "' class='btnPins' onclick='ThrowBall(this.value);'>" + index + "</button> "
    }
}

//Triggered by user input from buttons
function ThrowBall(pinScore) {
    ballNum++;
    curFrameBall++;
    var ballStatus = "";
    var getCurBallScore;

    //Record Ball Scores in JSON Object
    addBall(ballNum, pinScore);
    //addScore(curFrame, pinScore);

    if (curFrame < 10) {
        
        //Display Current Ball total in Frame
        if ((curFrameBall == 2)) {
            //Get values from ball array to determine spare
            var prevBall = 'ball' + (ballNum - 1);
            var curBall = 'ball' + ballNum;
            var getPrevBallScore = balls[prevBall];
            var getCurBallScore = balls[curBall];
            var curFrameTotal = (Number(getPrevBallScore) + Number(getCurBallScore));

            console.log("Current Ball Score: " + getCurBallScore + " Previous Ball Score:" + getPrevBallScore);
            var curFrameTotal = (Number(getCurBallScore) + Number(getPrevBallScore));

            if ((Number(getCurBallScore) + Number(getPrevBallScore)) == 10) {
                ballStatus = "spare";
                //console.log("Spare Ball Status: "+ballStatus);
                printBallScore(curFrame,curFrameBall,pinScore,ballStatus);
                //calcFrameTotals("frame" + curFrame, curFrameTotal, ballStatus, ballNum);
                addFrameScore("/ ",ballStatus);
            } else {
                ballStatus = "open";
                console.log("Open Ball Status: " + ballStatus);
                printBallScore(curFrame,curFrameBall,pinScore,ballStatus);
                //calcFrameTotals("frame" + curFrame, curFrameTotal, ballStatus, ballNum);
                addFrameScore(pinScore + " ", ballStatus);
            }
            remPins = 10;
            console.log("Resetting Frame Ball");
            curFrame++;
            advanceFrame(curFrame);
            curFrameBall = 0;
            // register raw frame total
            console.log("TEST FRAME TOTAL BUILD: " + (Number(getCurBallScore) + Number(getPrevBallScore)));

        } else if ((curFrameBall == 1) && (pinScore == 10)) {
            ballStatus = "strike";
            printBallScore(curFrame,curFrameBall,pinScore,ballStatus);
            // register initial frame total            
            //calcFrameTotals("frame" + curFrame, pinScore, ballStatus, ballNum);
            addFrameScore("X ", ballStatus);
            curFrame++;
            advanceFrame(curFrame);
            curFrameBall = 0;
        } else {
            addFrameScore(pinScore, ballStatus);
            // print score when first ball of frame is thrown
            printBallScore(curFrame,curFrameBall,pinScore,ballStatus);
            //Subtract remaining pins
            remPins = remPins - pinScore;
        }

        RenderButtons(remPins);
        
    } else {
        console.log("In Tenth Frame");
        if (curFrameBall <= curFrameBallLimit){
            //Get values from ball array to determine spare
            var prevBall = 'ball' + (ballNum - 1);
            var curBall = 'ball' + ballNum;
            var getPrevBallScore = balls[prevBall];
            var getCurBallScore = balls[curBall];
            var curFrameTotal = (Number(getPrevBallScore) + Number(getCurBallScore));
            // Handle unique scenarios of
            if (((curFrameBall == 1) || (curFrameBall == 2) || (curFrameBall == 3)) && (pinScore == 10)) {
                ballStatus = "strike";
                //add to Game score array when first throw is a strike
                printBallScore(curFrame,curFrameBall,pinScore,ballStatus);
                addFrameScore("X", ballStatus);
            } else if ((curFrameBall == 1) && (pinScore < 10)) {
                ballStatus = "";
                //add to Game score array if first ball is not a strike
                printBallScore(curFrame,curFrameBall,pinScore,ballStatus);
                addFrameScore(pinScore, ballStatus);
                 //Subtract remaining pins
                remPins = remPins - pinScore;
            } else if ((curFrameBall == 2) && (curFrameTotal == 10)) {
                ballStatus = "spare";
                //add to Game score array when second ball is spare
                printBallScore(curFrame,curFrameBall,pinScore,ballStatus);
                addFrameScore("/ ", ballStatus);
            } else if ((curFrameBall == 2) && (curFrameTotal < 10)) {
                ballStatus = "open";
                //add to Game score array when second ball is open frame and end game
                printBallScore(curFrame,curFrameBall,pinScore,ballStatus);
                addFrameScore(pinScore, ballStatus);
                curFrameBallLimit = 2;

            }
            if (curFrameBall == curFrameBallLimit) {
                alert("Game Over");
            }
            RenderButtons(remPins);
        } else {
            //alert("Game Over");
        }
    }
    calcScores(gameScores);
}

function advanceFrame(frameNum) {
    let prevFrameNum = (Number(frameNum) - 1);
    let prevElement = document.getElementById("frame" + prevFrameNum);
    let curElement = document.getElementById("frame" + frameNum);
    prevElement.classList.remove("active");
    curElement.classList.add("active");
}

//Build ball throw JSON object
function addBall(ballNum, score){
    //Register Ball Throw
    let ball = 'ball' + ballNum;
    console.log("key: " + ball);
    balls[ball] = score;

    let ballValue = balls[ball];
    console.log("Ball" + ballNum +": " + ballValue);
    //document.getElementById("balls").innerHTML += "Ball" + ballNum +": " + ballValue + "<br/>";
}

function printBallScore(curFrame,curFrameBall,pinScore,ballStatus) {
    frameRef = "frame" + curFrame;
    // Show Turn Display
    document.getElementById("curFrameBall").innerHTML = curFrameBall;
    document.getElementById("curFrame").innerHTML = curFrame;

    console.log("Ball Status: " + ballStatus);

    if (ballStatus == "strike") {
        if (curFrame < 10) {
        document.getElementById("frame" + curFrame + "-ball" + (curFrameBall + 1)).innerHTML = "X";
        } else {
            document.getElementById("frame" + curFrame + "-ball" + (curFrameBall)).innerHTML = "X";
        }
    } else if (ballStatus == "spare") {
        document.getElementById("frame" + curFrame + "-ball" + curFrameBall).innerHTML = "/";
    } else  {
        document.getElementById("frame" + curFrame + "-ball" + curFrameBall).innerHTML = pinScore;
    }
}

function addFrameScore(score, ballStatus) {
    gameScores += score;
    console.log("GAME SCORE ARRAY: " + gameScores);
}

// I got stuck in my original project, so I sought out some code to help me along.
//THE CODE IN THE FOLLOWING FUNCTIONS IS SOURCED FROM
// https://github.com/atahanozer/ProgrammingChallenges/blob/master/bowlingScoreCalculator.js
function calcScores(frames) {
    var framesArr = frames.split(' ').map((frame) => [...frame]);
    var result = 0;
    console.log(framesArr);
    for (var i=0; i < framesArr.length; i++) {
      var current = framesArr[i];
      if(current[0] === 'X' && i < 9) {
             
        result += 10 + getNextElementsScore(framesArr, i, 2);
        console.log("STRIKE");
        console.log(result);
        writeFrameScore(i, result);
       
      } else if(current.length === 2 && current[1] === '/' && i < 9) {
        result += 10 + getNextElementsScore(framesArr, i, 1);
        console.log("SPARE");
        console.log(result);
        writeFrameScore(i, result);
        return result;
  
      } else if(current.length === 3) {
        console.log("IN FRAME 10");
        result += getThreeRollScore(current);
        writeFrameScore(i, result);
      } else {
        result += getElementScore(current, 0) + getElementScore(current, 1);
        console.log("All Other Balls");
        console.log(result);
        writeFrameScore(i, result);
      }
    }
}
  
  function getNextElementsScore(framesArr, index, count) {
    var result = getElementScore(framesArr[index + 1], 0);
    var result2 = getElementScore(framesArr[index + 1], 1)
    
    if (framesArr[index + 1].length === 1) {
        console.log("Determine if the next frame is only one throw");
         console.log("If so, return result else...");
      return count === 1 ? result : result + getElementScore(framesArr[index + 2], 0);
    }
    console.log("Add Score in case of open frame: " + result + " " + result2);
    console.log(result);
    return count === 1 ? result : (result2 === 10 && result !== 10 ? result2 : result2 + result );
  }
      
  function getElementScore(frame, index) {
    if (frame[index] === 'X' || frame[index] === '/') {
      console.log("Determine Strike or Spare: " + frame);
      return 10;
    }
    return parseInt(frame[index]);
  }
  
  function getThreeRollScore(current) {
    var third = getElementScore(current, 2);
    var second = getElementScore(current, 1);
    var first = getElementScore(current, 0);
    return third === 10 && second !== 10 ? third + first : (second === 10 && first !== 10 ? third + second : first + second + third);
  }

  // END SOURCED CODE

  function writeFrameScore(i, result) {
    console.log("SCORE RESULT: " + result);
    //alert(result);
    if (result){
    console.log("Writing Frame Score");
    console.log("frame" + Number(i + 1));
    var curFrame = ("frame" + Number(i + 1));
    var curSquare = ("frame" + Number(i + 1).toString()) + "total";
    var curElement = document.getElementById(curSquare);
    curElement.innerHTML = " " + result;
    }
  }