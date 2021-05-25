//Initialize gameScore Object to store framescores
var gameScore;
gameScore = {
    "frame1" : [],
    "frame2" : [],
    "frame3" : [],
    "frame4" : [],
    "frame5" : [],
    "frame6" : [],
    "frame7" : [],
    "frame8" : [],
    "frame9" : [],
    "frame10" : [],
};

// Create JSON Object to store each ball throw
var balls = {};

//Create array to hold frame score totals and scenario
// "frame1" : [10, "strike"];
var frameTotals = {};

var curFrameBall = 0;
var ballNum = 0;
var curFrame = 1;
var remPins = 10;
var ballStatus = "";

RenderButtons(remPins);

function RenderButtons(remPins){
    //Reset Pin Buttons
    document.getElementById("ballbuttons").innerHTML = "";
    document.getElementById("ballbuttons").innerHTML += "<button value='0' class='btnPins' onclick='throwBall(this.value);'>0</button> "
    
    for (let index = 1; index <= remPins; index++) {
        //Render Pin Buttons
        document.getElementById("ballbuttons").innerHTML += "<button value='" + index + "' class='btnPins' onclick='throwBall(this.value);'>" + index + "</button> "
    }
}

//Triggered by user input from buttons
function throwBall(pinScore) {
    ballNum++;
    curFrameBall++;
    var ballStatus = "";
    var getCurBallScore;

    //Record Scores in JSON Object
    addBall(ballNum, pinScore);
    addScore(curFrame, pinScore);

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
                printFrameScore(curFrame,curFrameBall,pinScore,ballStatus);
                calcFrameTotals("frame" + curFrame, curFrameTotal, ballStatus, ballNum);
            } else {
                ballStatus = "open";
                console.log("Open Ball Status: " + ballStatus);
                printFrameScore(curFrame,curFrameBall,pinScore,ballStatus);
                calcFrameTotals("frame" + curFrame, curFrameTotal, ballStatus, ballNum);
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
            printFrameScore(curFrame,curFrameBall,pinScore,ballStatus);
            // register initial frame total            
            calcFrameTotals("frame" + curFrame, pinScore, ballStatus, ballNum);
            curFrame++;
            advanceFrame(curFrame);
            curFrameBall = 0;
        } else {
            // print score when first ball of frame is thrown
            printFrameScore(curFrame,curFrameBall,pinScore,ballStatus);
            //Subtract remaining pins
            remPins = remPins - pinScore;
        }

        RenderButtons(remPins);
        tallyScore(frameTotals, curFrame);
        
    } else {
        alert("In Tenth Frame");
    }
    
}

function advanceFrame(frameNum) {
    let prevFrameNum = (Number(frameNum) - 1);
    let prevElement = document.getElementById("frame" + prevFrameNum);
    let curElement = document.getElementById("frame" + frameNum);
    prevElement.classList.remove("active");
    curElement.classList.add("active");
}

//Build main game score JSON object
function addScore(curFrame, score){
    let frame = 'frame' + curFrame;
    console.log("key: " + frame);
    gameScore[frame].push(score);

    let get_frame = 'frame' + curFrame;
    let get_value = gameScore[get_frame];
    console.log("Frame Score Check: " + get_value);
    showScore(gameScore);
    
}

//Build ball throw JSON object
function addBall(ballNum, score){
    //Register Ball Throw
    let ball = 'ball' + ballNum;
    console.log("key: " + ball);
    balls[ball] = score;

    let ballValue = balls[ball];
    console.log("Ball" + ballNum +": " + ballValue);
    document.getElementById("balls").innerHTML += "Ball" + ballNum +": " + ballValue + "<br/>";
}

function printFrameScore(curFrame,curFrameBall,pinScore,ballStatus) {
    frameRef = "frame" + curFrame;
    // Show Turn Display
    document.getElementById("curFrameBall").innerHTML = curFrameBall;
    document.getElementById("curFrame").innerHTML = curFrame;

    console.log("Ball Status: " + ballStatus);

    if (ballStatus == "strike") {
        document.getElementById("frame" + curFrame + "-ball" + (curFrameBall + 1)).innerHTML = "X";
    } else if (ballStatus == "spare") {
        document.getElementById("frame" + curFrame + "-ball" + curFrameBall).innerHTML = "/";
    } else  {
        document.getElementById("frame" + curFrame + "-ball" + curFrameBall).innerHTML = pinScore;
    }
}
function showScore(gameScore){
    console.log(gameScore);
    document.getElementById("arraytest").innerHTML = "<h4>ScoreCard Test</h4>";
    for (var key in gameScore) {
        if ((gameScore.hasOwnProperty(key)) && (gameScore[key] != "")) {
        document.getElementById("arraytest").innerHTML += key + ": " + gameScore[key] + "<br/> ";
        }
    }
}
function showFrameTotals(frameTotals){
    console.log(frameTotals);
    document.getElementById("frametotalsarray").innerHTML = "<h4>Raw Frame Totals</h4>";
    for (var key in frameTotals) {
        if ((frameTotals.hasOwnProperty(key)) && (frameTotals[key] != "")) {
        document.getElementById("frametotalsarray").innerHTML += key + ": " + frameTotals[key][0] + " " + frameTotals[key][1] + " " + frameTotals[key][2] + "<br/> ";
        }
    }
}

function tallyScore(frameTotals){

    document.getElementById("scorearray").innerHTML = "<h3>Score Array</h3>";
    //Loop through analyze scenario and build score for each frame
    let currentFrame = "frame" + Number(curFrame - 1);
    let previousFrame = "frame" + Number(curFrame - 2);
    console.log("previous: " + frameTotals[previousFrame][0]);
 
    for (var key in frameTotals) {
        if (frameTotals.hasOwnProperty(key)) {
            var framePosKey = key.replace("frame", "");
            var prevElement = document.getElementById("frame" + (framePosKey - 1) + "total");
            var curElement = document.getElementById(key + "total");

            if (frameTotals[key][1] == "strike") {
                console.log("It's a Strike!");
                //Get Values of next two balls for calculation in spare/strike scenario
                let nextBall = "ball" + (Number(frameTotals[key][2] + 1));
                let nextTwoBalls = "ball" + (Number(frameTotals[key][2] + 2));

                //Show current frame score if the next two balls are available
                if (balls[nextTwoBalls] != null) {
                    // Account for condition of first frame so we don't try to factor in previous frame score
                    console.log("in Ball Loop");
                    if (curFrame == 1) {
                        curElement.innerHTML = Number(frameTotals[currentFrame][0]) + Number(balls[nextBall]) + Number(balls[nextTwoBalls]);
                    } else {
                        let accFrameScore = Number(frameTotals[currentFrame][0]) + Number(balls[nextBall]) + Number(balls[nextTwoBalls]);
                        curElement.innerHTML = accFrameScore;
                    }
                    
                } else {
                    console.log("Can't calculate frame score yet.")
                    //Do not try to show score in frame
                }
            } else if (frameTotals[key][1] == "spare"){
                console.log("It's a Spare!");
                if (nextBall != null) {
                    // Account for condition of first frame so we don't try to factor in previous frame score
                    if (curFrame == 1) {
                        curElement.innerHTML = Number(frameTotals[currentFrame][0]) + Number(balls[nextBall]);
                    } else {
                        let accFrameScore = Number(frameTotals[currentFrame][0]) + Number(balls[nextBall]);
                        curElement.innerHTML = accFrameScore;
                    }
                } else {
                    //Do not try to show score in frame
                }
                
            } else {
                console.log("Schucks..It's an Open Frame.");
                //Add both balls of current frame
                //curElement.innerHTML = Number(frameTotals[currentFrame][0]);
            }
            
        document.getElementById("scorearray").innerHTML += key + " " + frameTotals[key] + "<br/> ";
        }
    }
}


function calcFrameTotals(curFrame, total, frameStatus, ballRefNum) {
    frameTotals[curFrame] = [total, frameStatus, ballRefNum];
    console.log("CURRENT FRAME TOTAL: " + frameTotals[curFrame]);
    showFrameTotals(frameTotals);
    
    // tally score
    // if (frameTotals[curFrame][0] == 10) 

    // Loop through and 
    // Check frame scenario
    // Determine bonus points
    // Accumulate frame totals
    //totalScore = (Number(totalScore) + Number(total));
}

function isStrike(frame){
    //Receive the frame value (example: 4,3) then add the numbers
var result = frame.toString().match(/\d+/g).reduce(function(a,b) {return +a + +b;});
    if((frame.toString().length == 2) && (Number(result) == 10)) {
        return true;
    } else {
        return false;
    }
}

function isSpare(frame){
var result = frame.toString().match(/\d+/g).reduce(function(a,b) {return +a + +b;});
if ((frame.toString().length > 2) && (Number(result) == 10)) {
    return true;
} else {
    return false;
}
}

function isOpen(frame){
var result = frame.toString().match(/\d+/g).reduce(function(a,b) {return +a + +b;});

if ((frame.toString().length > 2) && (Number(result) < 10)) {
return true;
} else {
return false;
}
}

