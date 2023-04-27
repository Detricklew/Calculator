function equation(){
    this.equation = [];

    this.state = [];

    this.sum;

    this.currentState = {
        paranthesiscount: 0,
        num: false,
        funct: false,
    }
    this.loadState = function (){
        let newstate = {};
        this.equation.push(currentnum);
        newstate.paranthesiscount = this.currentState.paranthesiscount;
        newstate.num = this.currentState.num;
        newstate.funct = this.currentState.funct;
        this.state.push(newstate);
    }
}

let currentequation = new equation;

let equations = [];


let currentnum;


let division = false;

let solutionCheck = false;

let warningcheck = false;

const backspace = document.querySelector('.backspace');

const numbers = document.querySelectorAll('.number');

const functions = document.querySelectorAll('.func');

const clear = document.querySelector('.clear');

clear.addEventListener('click',clearDisplay);

backspace.addEventListener('click',loadBackspace);

function expo(x, f) {
    return Number.parseFloat(x).toExponential(f);
  }

functions.forEach(funct =>{
    funct.addEventListener('click',loadFunction);
})

numbers.forEach(action =>{
    action.addEventListener('click',loadNumber);
});

function loadNumber(e){
    if(e.target.textContent == "="){
        startOperation();
        return;
    }
    if(percCheck() || currentequation.equation[currentequation.equation.length - 1] == ")" && !currentnum) loadMultiplty();
    if(e.target.textContent == "+/-"){
        let check = numCheck();
        if(check){
            loadInput();
            previewOperation();
        }
        return;
    }
    if(e.target.textContent == '.'){
        if(solutionCheck){
            stateChange('solution');
        }
        if(checkLength()) return;
        decimalCheck(e);
        loadInput();
        previewOperation();
        return;
    }
    if(!currentnum){
        console.log(`num is false`);
        currentnum = e.target.textContent;
        stateChange('number');
        loadInput();
        previewOperation();
        return;
    }
    if(currentequation.currentState.funct){
        currentequation.loadState();
        currentnum = e.target.textContent;
        stateChange('number')
        loadInput();
        previewOperation();
        return;
    }
    else{
        if(solutionCheck){
            stateChange('solution');
            currentnum = e.target.textContent;
            stateChange('number');
            loadInput();
            previewOperation();
            return;
        }
        if(percCheck()){
            stateChange('number');
        }
        console.log('solutionchack');
        if(checkLength()){
            let check = displayWarning("Can't enter more than 15 digits.");
            if(!check){
                displayWarning("Can't enter more than 15 digits.");
            }
            return;
        } ;
        currentnum = currentnum.toString() + e.target.textContent.toString();
        loadInput();
        previewOperation();
        return;
    }
}

function displayWarning(warning){
    if (warningcheck){
        return;
    }
    display = document.querySelector(".warning");
    if(display.classList.contains("show")){
        display.classList.remove("show");
    }
    display.innerHTML = warning;
    display.classList.toggle("show");
    warningcheck = true;
    window.setTimeout(function(){
        display.classList.remove("show");
        warningcheck = false;

    },4000);
    return;
}

function clearDisplay(){
    currentequation.equation = [];
    currentnum = null
    let input = document.querySelector('.input');
    input.innerHTML = 0;
    stateChange('clear');
    previewOperation();
    fontCheck(0);
    loadBackspaceImage();
    return;
}

function loadMultiplty(){
    if(currentnum) currentequation.loadState();
    currentnum = "x";
    stateChange('function');
    return;
}

function previewOperation(){
    let preview = [];
    for(let i = 0; i < currentequation.equation.length; i++){
        preview.push(currentequation.equation[i]);
    }
    let newnum = currentnum;
    if (!currentequation.currentState.funct && preview.length){
        if(newnum) preview.push(newnum);
        let solution = operate(preview);
        if(division || isNaN(solution)){
            loadSolution('', ".solution");
            return;
        }
        solution = Math.round((solution + Number.EPSILON) * 100) / 100;
        if(solution.toString().length > 15) solution = expo(solution, 15);
        console.log(`hi solo ${solution} solution length ${solution.toString().length}`);
        loadSolution(solution.toLocaleString("en-US").toUpperCase(), ".solution");
    }
    else{
        console.log("preview");
        loadSolution('', ".solution");
        return;
    }
}

function startOperation(){
    let newequation = [];
    for(let i = 0; i < currentequation.equation.length; i++){
        newequation.push(currentequation.equation[i]);
    }
    if (!currentequation.currentState.funct && currentequation.equation.length){
        if(currentnum) newequation.push(currentnum);
        let solution = operate(newequation);
        if(division){
            displayWarning("Can't divide by zero.");
            division = false;
            return;
        }
        if(isNaN(solution)){
            displayWarning("Invalid format used.");
            return;
        }
        solution = Math.round((solution + Number.EPSILON) * 100) / 100;
        if(solution.toString().length > 15) solution = expo(solution, 15);
        console.log(`hi solo ${solution} solution length ${solution.toString().length}`);
        loadSolution(solution.toLocaleString("en-US").toUpperCase(), ".input");
        fontCheck(solution.toLocaleString("en-US").length);
        loadSolution('', ".solution");
        currentequation.equation.push(currentnum);
        solutionCheck = true;
        equations.push(currentequation);
        currentequation = new equation;
        currentnum = solution;
    }
    else{
        if(currentequation.equation.length){
            displayWarning("Invalid format used.");
        }
        return;
    }
}

function numCheck(){
    if(currentnum) currentnum = currentnum.toString(); 
    if(!currentequation.currentState.num){
        return false;
    }
    if(currentnum && currentequation.currentState.num){
        if(currentnum.includes('-')){
            console.log('hey');
             currentnum = currentnum.replace('-','');
            return true;
        }
        else{
            currentnum = '-' + currentnum;
            return true;
        }

    }
}

function stateChange(state){
    switch(state){
        case 'solution':
            currentequation.currentState.num = false;
            currentnum = null;
            solutionCheck = !solutionCheck;
            break;
        case 'number':
            currentequation.currentState.num = true;
            currentequation.currentState.funct = false;
            break;
        case 'function':
            solutionCheck = false;
            currentequation.currentState.num = false;
            currentequation.currentState.funct = true;
            break;
        case 'clear':
            currentequation.currentState.num = false;
            currentequation.currentState.funct = false;
            solutionCheck = false;
            currentequation.currentState.paranthesiscount = 0;
            break;
    }
}
function loadBackspace(){
    if(!currentequation.equation.length && !currentnum){
        return;
    }
    if(currentnum){
        if(currentnum.toString().length == 1){
            currentnum = null;
            unloadState();
            unloadFunction();
            unloadNumber();
            loadInput();
            previewOperation();
            return;
        }
        else{
            let newnum = currentnum.toString().split('');
            newnum.pop();
            currentnum = newnum.toString().replace(',','');
            console.log(`backspace num ${currentnum}`);
            loadInput();
            previewOperation();
            return;
        }
    }
    if(!currentnum){
        currentnum = currentequation.equation.pop();
        console.log(`currentnum pop ${currentnum}`);
        currentequation.state.pop();
        if(currentnum.toString().length == 1){
            currentnum = null;
            unloadState();
            unloadFunction();
            unloadNumber();
            loadInput();
            previewOperation();
            return;
        }
        else{
            let newnum = currentnum.toString().split('');
            newnum.pop();
            currentnum = newnum.toString().replace(',','');
            console.log(`backspace num ${currentnum}`);
            loadInput();
            previewOperation();
            return;
    }
}
}

function unloadFunction(){
    let functions = ['%','x','-','+','÷']
    for(let i = 0; i < functions.length; i++ ){
        if(currentequation.equation[currentequation.equation.length - 1] == functions[i]){
            currentnum = currentequation.equation.pop();
            currentequation.state.pop();
            console.log(`function found`);
            return;
        }
    }
    return;
}

function unloadNumber(){
    if(!currentnum){
        if(currentequation.currentState.num){
            currentnum = currentequation.equation.pop();
            currentequation.state.pop();
            return;
        }
    }
    return;
}

function unloadState(){
    if(!currentequation.state.length){
        currentequation.currentState.paranthesiscount = 0;
        currentequation.currentState.num = false;
        currentequation.currentState.funct = false;
        return;
    }
    else{
        let index = currentequation.state.length - 1;
        currentequation.currentState.paranthesiscount = currentequation.state[index].paranthesiscount;
        currentequation.currentState.num = currentequation.state[index].num;
        currentequation.currentState.funct = currentequation.state[index].funct;
    }

}

function percentageCheck(){
    if(!currentnum){
        if(currentequation.equation[currentequation.equation.length -1] == '%'){
            return true;
        }else{
            return false;
        }
    }
    let percCheck = currentnum.toString();
    if(currentequation.currentState.num && !percCheck.includes('%')){
        return true;
    }
    else{
        return false;
    }
}

function percCheck(){
    if(!currentnum){
        return false;
    }
    let percCheck = currentnum.toString();
    if(percCheck.includes('%')){
        return true;
    }
    else{
        return false;
    }
}


function loadFunction(e){
    console.log('here func');
    if(e.target.textContent == "( )"){
        parenthesisLoader();
        if(currentequation.equation.length){
            loadInput();
            previewOperation();
        } 
        return;
    }
    if(e.target.textContent == "%"){
        if(percentageCheck()){
            currentequation.loadState();
            currentnum = e.target.textContent.toString();
            loadInput();
            previewOperation();
            return;
        }
        else{
            return;
        }

    }
    if (!currentequation.currentState.funct && currentnum){
        currentequation.loadState();
        currentnum = null;
        currentnum = e.target.textContent.toString();
        stateChange('function');
        loadInput();
        previewOperation();
        return;
    }
    else if(!currentnum && currentequation.currentState.num){
        currentnum = e.target.textContent.toString();
        stateChange('function');
        loadInput();
        previewOperation();
        return;
    }
    else if(!currentequation.currentState.funct && currentequation.equation[currentequation.equation.length -1] == ')'){
        currentnum = null;
        currentnum = e.target.textContent.toString();
        stateChange('function');
        loadInput();
        previewOperation();
        return;
    }
    else if(currentequation.currentState.funct && (e.target.textContent != currentnum)){
        if(e.target.textContent == "÷") {
            division = true;
        }
        else{
            division = false;
        }
        currentnum = e.target.textContent.toString();
        loadInput();
        previewOperation();
        return;
    }
    else{
        return;
    }
}

function parenthesisLoader(){
    if(!currentequation.currentState.paranthesiscount && currentequation.currentState.num) loadMultiplty();
    if(currentequation.currentState.funct && currentnum){
        currentequation.loadState();
        currentnum = "(";
        currentequation.currentState.paranthesiscount++;
        currentequation.loadState();
        currentnum = null;
        return;
    }
    if (currentequation.currentState.paranthesiscount && currentequation.currentState.num){
            if(currentnum) currentequation.loadState();
            currentnum = ")";
            currentequation.currentState.paranthesiscount--;
            currentequation.loadState();
            currentnum = null;
            return;
    }


}

function loadSolution(value, destination){
    let display = document.querySelector(destination);
    if(destination == ".input"){
        display.innerHTML = `<span class ="function">${value}</span>`;
        return;
    }
    display.innerHTML = value;
    return;
}

function loadBackspaceImage(){
    const backspace = document.querySelector('.backspace');
    if(!currentnum && !currentequation.equation.length){
        backspace.src = 'images/backspace-sleep.png';
        return;
    }
    else{
        backspace.src = 'images/backspace.png';
        return;
    }
}

function loadInput(){
    let input = document.querySelector('.input');
    let display = loadDisplay();
    loadBackspaceImage();
    input.innerHTML = display;
    return;
}

function checkLength(){
    if(!currentnum){
        return false;
    }
    if(currentnum.toString().length == 15){
        return true;
    }else{
        return false;
    }
}

function checkParenthesis(){
    let pare1;
    let pare2;
    let paracount = 0;
    console.log(`equation length = ${equation.length}`);
    for(let i = currentequation.equation.length - 1; i >= 0; i--){
        console.log(`current equation ${currentequation.equation[i]} last equation ${currentequation.equation[currentequation.equation.length - 1]}`)
        if (currentequation.equation[currentequation.equation.length - 1] != ')' || currentnum){
            console.log("no para");
            pare1 = null;
            pare2 = null;
            break;
        }
        if(paracount == 0 && currentequation.equation[i].toString() == "("){
            console.log('para accept');
            pare1 = i;
            pare2 = currentequation.equation.length - 1;
            break;
        }
        if(i != currentequation.equation.length - 1 && currentequation.equation[i] == ")"){
            console.log("hi there");
            paracount++;
            continue;
        }
        if(paracount && currentequation.equation[i] == "("){
            paracount--;
        }
    }
    console.log(`para1 = ${pare1} para2 = ${pare2}`);
    if(!pare1 || !pare2){
        return null;
    }
    else{
        return [pare1,pare2];
    }
}

function loadDisplay(){
    if(!currentnum && !currentequation.equation.length){
        return 0;
    }
    let display = '';
    let functcheck = false;
    let pareload = checkParenthesis();
    let lengths = 0;
    let functions = ['%','x','-','+','÷']
    for (let i = 0; i < currentequation.equation.length; i++){
        if(pareload){
            if (i == pareload[0] || i == pareload[1]){
                console.log('check here');
                display = display + `<span class ="function">${currentequation.equation[i]}</span>`;
                lengths++;
                continue;
            }
        }
        for(let j = 0; j < functions.length; j++){
            if(currentequation.equation[i] == functions[j]){
                display = display + `<span class ="function">${currentequation.equation[i]}</span>`;
                functcheck = true;
                lengths++;
            }
        }
        if(!functcheck){
            if(currentequation.equation[i]== "(" || currentequation.equation[i] == ")"){
                display = display + currentequation.equation[i];
                lengths++;
                continue;
            }
            let convert = Number(currentequation.equation[i]);
            convert = convert.toLocaleString("en-US");
            let check = currentequation.equation[i].toString().split('');
            if(check[check.length - 1] == '.'){
                convert = convert + '.';
            }
            if(convert.toString().length > 15) convert = expo(convert, 15);
            lengths += currentequation.equation[i].length;
            display = display + `<span>${convert.toLocaleUpperCase()}</span>`;
        }
        functcheck = false;
    }
    if(currentnum){
        for (let i = 0; i < functions.length; i++){
            if(currentnum == functions[i]){
                display = display + `<span class ="function">${currentnum}</span>`;
                functcheck = true;
                lengths++;
            }
        }
        if(!functcheck){
            lengths += currentnum.toString().length;
            let convert = Number(currentnum);
            convert = convert.toLocaleString("en-US");
            let check = currentnum.toString().split('');
            if(check[check.length - 1] == '.'){
                convert = convert + '.';
            }
            if(convert.toString().length > 15) convert = expo(convert, 15);
            display = display + `<span>${convert.toLocaleUpperCase()}</span>`;
        }
    }
    console.log(`length here ${lengths}`);
    fontCheck(lengths);


    return display;
}

function fontCheck(length){
    let font = document.querySelector('.input');
    if(length > 13 && length < 19){
        font.style.cssText = "font-size: 28px;";
        return;
    }
    else if(length >= 19){
        font.style.cssText = "font-size: 24px;";
        return;
    }else{
        font.style.cssText = "";
        return;
    }
}

function decimalCheck(e){
    if(currentnum){
        let check = currentnum.toString();
        if(check.includes('.')){
            return;
        }
    }
    if(currentequation.currentState.funct){
        currentequation.loadState();
        currentequation.currentState.funct = !currentequation.currentState.funct;
        currentnum = 0 + e.target.textContent.toString();
        stateChange("number");
        return;
    }
    else if(!currentequation.currentState.num){
        console.log(`here num`)
        console.log(currentnum);
        currentnum = 0 + e.target.textContent.toString();
        stateChange("number");
        console.log(currentnum);
    }
    else{
        currentnum = currentnum + e.target.textContent.toString();
    }
}
function operate(array){
    if(array.length == 1) return array[0];
    //executing PEMDAS
    console.log(array);
    //parenthesis
    let parantheis = search(array, ['(']);
    if(parantheis[0]){
        let startIndex = parantheis[1];
        let endIndex = parenthesisSearch(array, startIndex);

        console.log(`end index ${endIndex}`);


        let newequation = parenthesisParser(array,startIndex,endIndex);

        console.log(`parenthesis newequation ${newequation}`)

        let sum = operate(newequation);

        console.log(`parenthesis sum ${sum} startindex= ${startIndex} endindex= ${endIndex}`)

        let finalequation = arrayBuilder(array, startIndex, endIndex, sum);

        console.log(`parenthesis final ${finalequation}`)

        return operate(finalequation);

    }
    //percentage

    let percentag = search(array,['%']);

    console.log(percentag[0]);

    if(percentag[0]){
        let value = array[percentag[1]- 1];

        let percent = percentage(Number(value));

        let newequation = arrayBuilder(array,percentag[1]-1,percentag[1],percent);
        console.log(`parcentage array ${newequation}`);
        return operate(newequation);
    }

    //multiply/divide

    let md = search(array,['x','÷']);
    let pd;

    if(md[0]){
        switch(md[2]){
            case 'x':
                pd = multiply(Number(array[md[1]-1]),Number(array[md[1]+1]));
                break;
            case '÷':
                pd = divide(Number(array[md[1]-1]),Number(array[md[1]+1]));
        }

        let product = arrayBuilder(array,md[1]-1, md[1]+1,pd);
        console.log(`multiply/divide array ${product}`);
        return operate(product);
    }

    //Add/Subtract
    let as = search(array,['+','-']);
    console.log(`add/subtract ${as}`);

    let sum;

    if(as[0]){
        switch(as[2]){
            case '+':
                sum = add(Number(array[as[1]-1]),Number(array[as[1]+1]));
                break;
            case '-':
                sum = subtract(Number(array[as[1]-1]),Number(array[as[1]+1]));
        }

        let newequation = arrayBuilder(array,as[1]-1,as[1]+1,sum);
        console.log(`add currentnum.toString() + /subtract new equation ${newequation}`)
        return operate(newequation);
    }

}



function search(array, items){
    for(let i = 0; i < array.length; i++){
        let indexString = array[i].toString();
        for(let j = 0; j < items.length; j++){
            console.log(`${items[j]} = ${indexString}`);
            let test = indexString.includes(items[j]);
            console.log(test);
            if(indexString == items[j]){
            return [true, i, items[j]];
            }
        }
    }

    return [false];
}

function parenthesisParser(array, start, stop){

    let newArray = [];

    if (array[stop] != ")"){
        for(let i = 0; i < array.length; i++){
            if(i > start){
                newArray.push(array[i]);
            }
            else{
                continue;
            }
        }
        return newArray;
    }

    for(let i = 0; i < array.length; i++){
        if(i > start && i < stop){
            newArray.push(array[i]);
        }
        else{
            continue;
        }
    }

    return newArray;
}

function arrayBuilder(array, start, stop, newValue){

    let newArray =[];

    for(let i = 0; i < array.length; i++){
        if(i >= start && i < stop){
            continue;
        }
        else if(i == stop){
            newArray.push(newValue);
        }
        else{
            newArray.push(array[i]);
        }
    }

    return newArray;
}

function parenthesisSearch(array, startIndex){
    let paracount = 0;


    for(let i = startIndex+1; i < array.length; i++){
        let indexString = array[i].toString();


        if(indexString == "("){
            console.log(`here`)
            paracount++;
        }
        console.log(`check paracheck = ${paracount}  index = ${indexString.includes(')')} indice = ${i} array length = ${array.length}`)
        if(!paracount && indexString == ")"){
            return i;
        }
        if (paracount && indexString == ")"){
            paracount--;
        }
        if(i == array.length - 1){
            return i;
        }
    }
}

function percentage(a){
    return a / 100;
}

function add(a,b){
    return a + b;
}

function subtract(a,b){
    return a - b;
}

function multiply(a,b){
    return a*b;
}

function divide(a,b){
    if(b == 0){
        division = true;
    }
    return a / b;
}