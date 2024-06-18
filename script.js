function findOuterBracketIndices (str) {
    let index = 0;
    let openBracketCounter = 0;
    let closedBracketCounter = 0;
    let arr = [];

    for (index; index < str.length; index++) {
        if (str.at(index) === "(") {
            openBracketCounter++;
            if (openBracketCounter === 1) { arr.push(index); }
        } else if (str.at(index) === ")") {
            closedBracketCounter++;
            if (openBracketCounter === closedBracketCounter) { 
                arr.push(index); 
                openBracketCounter = 0;
                closedBracketCounter = 0;
            }
        }
    }

    return arr;
}

function calculate (calculation) {
    var parts = calculation.match(
        /(?:\-?[\d\.]+)|[-\+\*\/]|\s+/g
    );

    if( calculation !== parts.join("") ) {
        throw new Error("couldn't parse calculation")
    }

    parts = parts.map(Function.prototype.call, String.prototype.trim);
    parts = parts.filter(Boolean);

    var nums = parts.map(parseFloat);

    var processed = [];
    for(var i = 0; i < parts.length; i++){
        if( nums[i] === nums[i] ){
            processed.push( nums[i] );
        } else {
            switch( parts[i] ) {
                case "+":
                    continue;
                case "-":
                    processed.push(nums[++i] * -1);
                    break;
                case "*":
                    processed.push(processed.pop() * nums[++i]);
                    break;
                case "/":
                    processed.push(processed.pop() / nums[++i]);
                    break;
                default:
                    throw new Error("unknown operation: " + parts[i]);
            }
        }
    }

    return processed.reduce(function(result, elem){
        return result + elem;
    });
}

String.prototype.replaceBetween = function(start, end, what) {
    return this.substring(0, start) + what + this.substring(end);
};

function checkBrackets(str) {
    for (let i = 0; i < str.length; i++) {
        if (str.at(i) === "(") {
            return true;
        }
    }

    return false;
}

Number.prototype.round = function(places) {
    return +(Math.round(this + "e+" + places)  + "e-" + places);
}

function check(expr){
    const holder = []
    const openBrackets = ['(','{','[']
    const closedBrackets = [')','}',']']
    for (let letter of expr) { 
        if(openBrackets.includes(letter)){ 
            holder.push(letter)
        }else if(closedBrackets.includes(letter)){ 
            const openPair = openBrackets[closedBrackets.indexOf(letter)]
            if(holder[holder.length - 1] === openPair){ 
                holder.splice(-1,1) 
            }else{ 
                holder.push(letter)
                break 
            }
        }
    }
    return (holder.length === 0) 
}

function compute(expression) {
    expression = expression.replaceAll("×", "*");
    expression = expression.replaceAll("÷", "/");
    expression = expression.replaceAll("–", "-");

    if (checkBrackets(expression)) {
        arr = findOuterBracketIndices(expression);
        expression = expression.replaceBetween(arr[0], arr[1] + 1, compute(expression.substring(arr[0] + 1, arr[1])));
    }

    return calculate(expression);
}

function evaluateSingle(expression) {
    return parseFloat(compute(expression)).toFixed(2);
}

function replaceAllBracketExpr(expression, computedArr) {
    for (let i = 0; i < computedArr.length; i++) {
        let arr = findOuterBracketIndices(expression);
        expression = expression.replaceBetween(arr[0], arr[1] + 1, computedArr[i]);
    }

    return expression;
}

String.prototype.replaceAt = function(index, replacement) {
    let extra = this.substring(index + 1, this.length);
    return this.substring(0, index) + replacement + extra;
}

function evaluate(expr) {
    let str = expr;
    let originalArr = findOuterBracketIndices(expr);
    let arr = findOuterBracketIndices(expr);
    let computedArr = [];
    let operatorArr = [];
    for (let i = 0; i < arr.length; i += 2) {
        expr = str.substring(arr[i], arr[i + 1] + 1);
        let evaluatedExpr = evaluateSingle(expr);
        computedArr.push(evaluatedExpr);
    }

    for(let i = 0; i < str.length; i++) {
        if ((str.at(i) === "(") && ")0123456789".includes(str.at(i - 1)) && i - 1 >= 0) {
            str = str.replaceAt(i, " * (");
        }
    }

    return evaluateSingle(replaceAllBracketExpr(str, computedArr));
}

function buttonClicked(text) {
    let expression = document.querySelector(".input").textContent;
            
    if (expression === "0") { expression = ""; }

    if (followsRules(expression + text.currentTarget.param)) { expression += text.currentTarget.param; }
    document.querySelector(".input").textContent = expression;
}

function display() {
    let buttons = Array.from(document.querySelectorAll("button"));

    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].classList.contains("equals") || buttons[i].classList.contains("orange-bg")) {
            buttons.splice(i, 1);
        }
    }

    buttons.splice(3, 1);

    buttons.forEach((button) => {
        button.addEventListener("click", buttonClicked);
        button.param = button.textContent;
    });
}

function del() {
    let displayExpr = document.querySelector(".input").textContent;
        
    if (displayExpr === "0") {}
    else if (displayExpr.at(-1) === " ") { displayExpr = displayExpr.substring(0, displayExpr.length - 3); }
    else { displayExpr = displayExpr.substring(0, displayExpr.length - 1); }

    if (displayExpr === "") { displayExpr = 0; }

    document.querySelector(".input").textContent = displayExpr;
}

function ac() {
    document.querySelector(".input").textContent = "0";

    let resultDiv = document.querySelector(".result");
    resultDiv.textContent = "";
    if (resultDiv.classList.contains("raised-box")) { resultDiv.classList.remove("raised-box"); }
}

function clear() {
    document.querySelector("#DEL").addEventListener("click", del);

    document.querySelector("#AC").addEventListener("click", ac);
}

function ans() {
    let div = document.querySelector(".result");
    let expression = document.querySelector(".input").textContent;
            
    if (expression === "0") { expression = ""; }

    let ans = div.textContent.slice(2);

    if (+ans.replace("–", "-") < 1e+18) { expression = expression + "(" + (+ans.replace("–", "-")).toPrecision().replace("-", "–") + ")"; }
    document.querySelector(".input").textContent = expression;
}

function inputAns() {
    let div = document.querySelector(".result");

    div.addEventListener("click", ans);
}

function followsRules(str) {
    if (str.length > 300) { return false; }
    
    disallowedStrings = ["+÷", "+/", "+*", "+×", "–÷", "–/", "–*", "–×", 
        "÷÷", "÷/", "÷*", "÷×", "÷+", "÷–", "/÷", "//", "/*", "/×", "/+", "/–", 
        "*÷", "*/", "**", "*×", "*+", "*–", "×÷", "×/", "×*", "××", "×+", "×–", "()", 
        "+)", "–)", "×)", "÷)", "*)", "/)", ".+", ".–", ".×", ".÷", ".*", "./", ".)", ".(",").", 
        "/0", "÷0"];

    if (disallowedStrings.some(substring=>str.replace(/\s/g, "").includes(substring))) {
        return false;
    }

    let dotFlag = false;
    let bracketAfterDot = false;
    for (let i = 0; i < str.length; i++) {
        if (str.at(i) === ".") { 
            if (dotFlag && !bracketAfterDot) {
                return false;
            }

            dotFlag = true; 
        }

        if (str.at(i) === " ") { dotFlag = false; }
        if (str.at(i) === "(") { bracketAfterDot = true; }
    }

    let openBracket = false;
    for (let i = 0; i < str.length; i++) {
        if (str.at(i) === "(") { 
            openBracket = true;
        }

        if (str.at(i) === ")" && !openBracket) { return false; }
    }

    return true;
}

function keyboard() {
    document.addEventListener("keydown", (e) => {
        let keyCode = e.key;

        if (keyCode === "+") {
            e.currentTarget.param = " + ";
        } else if (keyCode === "-") {
            e.currentTarget.param = " – ";
        } else if (keyCode === "*") {
            e.currentTarget.param = " × ";
        } else if (keyCode === "/") {
            e.currentTarget.param = " ÷ ";
        } else {
            e.currentTarget.param = keyCode;
        }

        if ("0123456789.()+-*/".includes(keyCode)) {
            buttonClicked(e);
        } else if (keyCode === "Backspace") {
            del();
        } else if (keyCode === "Escape") {
            ac();
        } else if (keyCode === "Enter") {
            enter();
        }
    });
}

function alertWrong() {
    let target = document.querySelector(".input");

    target.style.backgroundColor = "red";
    target.style.marginLeft='8px';
    setTimeout(function(){target.style.marginLeft='0px';},100);
    setTimeout(function(){target.style.marginLeft='8px';},200);
    setTimeout(function(){target.style.marginLeft='0px';},300);

    setTimeout(function () {
            target.style.backgroundColor = "darkorange";
    }, 1000);

    document.querySelector(".result").textContent = "ERROR";
}

function enter() {
    let expression = document.querySelector(".input").textContent;
    let resultDiv = document.querySelector(".result");

    try {
        let evaluatedExpr = evaluate(expression);

        if (!check(expression) || evaluatedExpr === "Infinity" || evaluatedExpr === "-Infinity") {
            alertWrong();
        } else {
            resultDiv.classList.add("raised-box");
            resultDiv.textContent = "= " + evaluatedExpr;
        }
    } catch(err) {
        alertWrong();
    }
}

function equals() {
    let equalsButton = document.querySelector(".equals");

    equalsButton.addEventListener("click", enter);
}

display();
clear();
inputAns();
keyboard();
equals();
