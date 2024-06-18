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

    return evaluateSingle(replaceAllBracketExpr(str, computedArr));
}

// don't allow repeated math operators
// don't allow repeated dots in a single number
// after equals clicked, check() if brackets are violated --> if yes, alert
// if ans > e+18, don't input --> otherwise input (+ans).toPrecision()
// max chars: 300