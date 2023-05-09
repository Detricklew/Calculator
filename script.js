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
        return;
    }
    this.clearState = function (){
        this.equation = [];
        this.state = [];
        this.currentState = {
            paranthesiscount: 0,
            num: false,
            funct: false,
        };
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

const history = document.querySelector('.history');

const clearbuttton = document.querySelector('.clearbutton');

clearbuttton.addEventListener('click',clearHistory)

history.addEventListener('click',displayHistory);

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

function clearHistory(){
    displayHistory();
    equations = [];
    loadHistory();
    const equationcontainer = document.querySelector('.equationcontainer');
    equationcontainer.innerHTML = '';
    history.classList.remove('hover');
    history.src = 'images/clock-sleep.png'
    return;
}

function displayHistory(){
    if(!equations.length){
        return;
    }
    const historydisplay = document.querySelector(".equations");
    historydisplay.classList.toggle("show");
    if(history.getAttribute('src') == 'images/clock-active.png'){
        history.src = "images/calculatoricon.png";
        return;
    }
    else{
        history.src = "images/clock-active.png";
        return;
    }
}

function loadNumber(e){
    if(e.target.textContent == "="){
        startOperation();
        return;
    }
    if(percCheck(currentnum) || currentequation.equation[currentequation.equation.length - 1] == ")" && !currentnum) loadMultiplty();
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
        if(checkLength(currentnum,15)) return;
        decimalCheck(e);
        loadInput();
        previewOperation();
        return;
    }
    if(!currentnum){
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
        if(percCheck(currentnum)){
            stateChange('number');
        }
        if(checkLength(currentnum,15)){
            displayWarning("Can't enter more than 15 digits.");
            return;
        } ;
        if(isNaN(Number(currentnum.toString() + e.target.textContent.toString()))){
            displayWarning("Invalid format.");
            return;
        }
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
    currentequation.clearState();
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
    if(currentnum){
        if(isNaN(currentnum)){
            displayWarning('Invalid Format.');
            return;
        }
        currentequation.loadState();
    }
    currentnum = "x";
    stateChange('function');
    return;
}

function previewOperation(){
    let preview = [];
    let expocheck;
    for(let i = 0; i < currentequation.equation.length; i++){
        preview.push(currentequation.equation[i]);
    }
    let newnum = currentnum;
    if(newnum){
        expocheck = newnum.toString().includes('e');
    }else{
        expocheck = false;
    }
    if (!currentequation.currentState.funct && preview.length || expocheck && !solutionCheck){
        if(newnum) preview.push(newnum);
        let solution = operate(preview);
        if(division || isNaN(solution)){
            loadSolution('', ".solution");
            return;
        }
        solution = solution.toLocaleString("en-US").replaceAll(',','');
        if(solution.toString().includes('.')){
            solution = Math.round((Number(solution) + Number.EPSILON) * 100) / 100;
        }
        let truenum = solution.toLocaleString("en-US").replaceAll(',','');
        if(solution.toString().length > 15) solution = expo(solution, 8);
        if(truenum.toString().length > 15) solution = expo(Number(solution),8);
        if(truenum.toString().length <= 15) solution = Number(solution);
        loadSolution(solution.toLocaleString("en-US").toUpperCase(), ".solution");
    }
    else{
        loadSolution('', ".solution");
        return;
    }
}

function startOperation(){
    let newequation = [];
    let expocheck;
    for(let i = 0; i < currentequation.equation.length; i++){
        newequation.push(currentequation.equation[i]);
    }
    if(currentnum){
        expocheck = currentnum.toString().includes('e');
    }else{
        expocheck = false;
    }
    if (!currentequation.currentState.funct && currentequation.equation.length || expocheck){
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
        solution = solution.toLocaleString("en-US").replaceAll(',','');
        if(solution.toString().includes('.')){
            solution = Math.round((Number(solution) + Number.EPSILON) * 100) / 100;
        }
        let truenum = solution.toLocaleString("en-US").replaceAll(',','');
        if(solution.toString().length > 15) solution = expo(solution, 8);
        if(truenum.toString().length > 15) solution = expo(Number(solution),8);
        if(truenum.toString().length <= 15) solution = Number(solution);
        loadSolution(solution.toLocaleString("en-US").toUpperCase(), ".input");
        fontCheck(solution.toLocaleString("en-US").length);
        loadSolution('', ".solution");
        if(currentnum)currentequation.loadState();
        solutionCheck = true;
        currentequation.sum = solution;
        equations.push(currentequation);
        currentnum = null;
        loadHistory();
        currentequation = new equation;
        currentnum = solution;
        stateChange('number');
    }
    else{
        if(currentequation.equation.length){
            displayWarning("Invalid format used.");
        }
        return;
    }
}

function loadHistory(){
    history.classList.add('hover');
    if(history.src != 'images/calculatoricon.png'){
        history.src = 'images/clock-active.png';
    }
    const equationcontainer = document.querySelector('.equationcontainer');
    equationcontainer.innerHTML = '';
    for (let i = 0; i< equations.length; i++){
        let equationcontent = loadDisplay(equations[i]);
        const equation = document.createElement('div');
        const sum = document.createElement('div');
        equation.setAttribute('id', i);
        sum.setAttribute('id', i);
        equation.classList.add('equation','hover');
        sum.classList.add('sum','hover');

        equation.innerHTML = equationcontent;
        sum.textContent = equations[i].sum;
        equationcontainer.appendChild(equation);
        equationcontainer.appendChild(sum);

    }
    const newequations = document.querySelectorAll(`.equation`);
    const newsums = document.querySelectorAll(`.sum`);
    newequations.forEach(newequation=>{
        newequation.addEventListener('click',loadEquation);
    })
    newsums.forEach(newsum =>{
        newsum.addEventListener('click', loadSum);
    })
}

function mergeCheck(e,state){
    let mergevalue;
    if(state == "equation"){
        mergevalue = {
            value: equations[e.currentTarget.id].equation[0],
            state: equations[e.currentTarget.id].state[0]
        }
    }else{
        mergevalue = {
            value: equations[e.currentTarget.id].sum,
            state: {
                paranthesiscount: 0,
                num: true,
                funct: false,
            }
        }
    }
    let mainvalue;
    if(currentnum){
        mainvalue ={
            value: currentnum,
            state: currentequation.currentState
        }
    }else{
        mainvalue ={
            value: currentequation.equation[currentequation.equation.length-1],
            state: currentequation.state[currentequation.state.length-1]
        }
    }
    if(!mainvalue.value){
        return true;
    }
    if(mainvalue.state.funct){
        if(currentnum){
            currentequation.loadState();
            currentnum = null;
            return true;
        }else{
            return true;
        }
    }
    if(mainvalue.value == ")" || percCheck(mainvalue.value) || mergevalue.value == "("){
        loadMultiplty();
        currentequation.loadState();
        currentnum = null;
        return true;
    }

    if(mainvalue.value.toString().includes('.')){
        if(!mergevalue.value.toString().includes('.')){
            let lengthcheck = mainvalue.value.toString().split('.');
            lengthcheck = lengthcheck[1].toString() + mergevalue.value.toString();
            if(checkLength(lengthcheck,10)){
                displayWarning('Invalid format.');
                return false;
            }else{
                return true;
            }
        }else{
            displayWarning('Invalid format.');
            return false;
        }
    }
    if(mainvalue.state.num && mergevalue.state.num){
        if(isNaN(Number(mainvalue.value) + Number(mergevalue.value))){
            displayWarning('Invalid format.');
            return;
        }else{
            return true;
        }
    }


    return false;
}



function loadSum(e){
    if(mergeCheck(e,"sum")){
        let mergevalue = equations[e.currentTarget.id].sum;
        if(currentnum){
            if(checkLength(currentnum.toString() + mergevalue.toString(),15)){
                displayWarning("Can't enter more than 15 digits.");
                return;
            }else{
                currentnum = currentnum.toString() + mergevalue.toString();
                stateChange('number');
                loadInput();
                solutionCheck = false;
                previewOperation();
                return;
            }
        }else{
            currentnum = mergevalue;
            stateChange('number');
            loadInput();
            solutionCheck = false;
            previewOperation();
            return;
        }
    }
}

function loadEquation(e){
    if(mergeCheck(e,'equation')){
        let mergeequation = equations[e.currentTarget.id];
        let mainequation = currentequation;
        let newequation = new equation;
        let numChecker;

        for(let i = 0; i < mainequation.equation.length; i++){
            newequation.equation.push(mainequation.equation[i]);
        }
        for (let i = 0; i < mainequation.state.length; i++){
            newequation.state.push(mainequation.state[i]);
        }
        if(currentnum){
            if(checkLength(currentnum.toString() + mergeequation.equation[0].length,15)){
                displayWarning("Can't enter more than 15 digits.");
                return;
            }
            currentnum = currentnum.toString() + mergeequation.equation[0];
            newequation.equation.push(currentnum);
            currentnum = null;
            mainequation.loadState();
            newequation.state.push(mainequation.state[mainequation.state.length-1]);
            if(mergeequation.state[mergeequation.state.length-1].num && mergeequation.equation[mergeequation.equation.length-1] != ')'){
                numChecker = true;
            }
            for(let i = 1; i < mergeequation.equation.length; i++){
                if(numChecker && i == mergeequation.equation.length -1){
                    currentnum = mergeequation.equation[i];
                    continue;
                }
                newequation.equation.push(mergeequation.equation[i]);
            }
            for(let i = 1; i < mergeequation.state.length; i++){
                if(numChecker && i == mergeequation.equation.length -1){
                    newequation.currentState.num = mergeequation.state[i].num;
                    newequation.currentState.funct = mergeequation.state[i].funct;
                    continue;
                }
                newequation.state.push(mergeequation.state[i]);
            }
            newequation.currentState.paranthesiscount = mergeequation.state[mergeequation.state.length - 1].paranthesiscount + currentequation.state[currentequation.state.length-1].paranthesiscount;
            currentequation = newequation;
            loadInput();
            solutionCheck = false;
            previewOperation();
            return;
        }
        if(mergeequation.state[mergeequation.state.length-1].num && mergeequation.equation[mergeequation.equation.length-1] != ')'){
            numChecker = true;
        }
        for(let i = 0; i < mergeequation.equation.length; i++){
            if(numChecker && i == mergeequation.equation.length -1){
                currentnum = mergeequation.equation[i];
                continue;
            }
            newequation.equation.push(mergeequation.equation[i]);
        }
        for(let i = 0; i < mergeequation.state.length; i++){
            if(numChecker && i == mergeequation.equation.length -1){
                newequation.currentState.num = mergeequation.state[i].num;
                newequation.currentState.funct = mergeequation.state[i].funct;
                continue;
            }
            newequation.state.push(mergeequation.state[i]);
        }
        if(currentequation.state.paranthesiscount){
            newequation.currentState.paranthesiscount = mergeequation.state[mergeequation.state.length-1].paranthesiscount + currentequation.state[currentequation.state.length-1].paranthesiscount;
        }else{
            newequation.currentState.paranthesiscount = mergeequation.state[mergeequation.state.length-1].paranthesiscount;
        }
        currentequation = newequation;
        loadInput();
        solutionCheck = false;
        previewOperation();
        return;

    }else{
        return;
    }
}

function numCheck(){
    if(currentnum) currentnum = currentnum.toString(); 
    if(!currentequation.currentState.num){
        return false;
    }
    if(currentnum && currentequation.currentState.num){
        if(isNaN(currentnum)){
            displayWarning("Invalid format.");
            return;
        }
        if(currentnum.includes('-')){
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
            if(solutionCheck) solutionCheck = !solutionCheck;
            unloadState();
            unloadFunction();
            unloadNumber();
            loadInput();
            previewOperation();
            return;
        }
        else{
            if(solutionCheck) solutionCheck = !solutionCheck;
            let newnum = currentnum.toString().split('');
            newnum.pop();
            currentnum = newnum.toString().replaceAll(',','');
            loadInput();
            previewOperation();
            return;
        }
    }
    if(!currentnum){
        currentnum = currentequation.equation.pop();
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
            currentnum = newnum.toString().replaceAll(',','');
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
            return;
        }
    }
    return;
}

function unloadNumber(){
    if(!currentnum){
        if(currentequation.currentState.num && currentequation.equation[currentequation.equation.length-1] != ")" && currentequation.equation[currentequation.equation.length-1] != "("){
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

function percCheck(element){
    if(!element){
        return false;
    }
    let percCheck = element.toString();
    if(percCheck.includes('%')){
        return true;
    }
    else{
        return false;
    }
}


function loadFunction(e){
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
        if(isNaN(currentnum)){
            displayWarning('Invalid Format.');
            return;
        }
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
            if(isNaN(currentnum) && currentnum !='%'){
                displayWarning("Invalid format.");
                return;
            }
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
        backspace.classList.remove("hover");
        return;
    }
    else{
        backspace.src = 'images/backspace.png';
        backspace.classList.add("hover");
        return;
    }
}

function loadInput(){
    let input = document.querySelector('.input');
    let display = loadDisplay(currentequation);
    loadBackspaceImage();
    input.innerHTML = display;
    return;
}

function checkLength(number,length){
    if(!number){
        return false;
    }
    if(number.toString().length >= length){
        return true;
    }else{
        return false;
    }
}

function checkParenthesis(array){
    let pare1;
    let pare2;
    let paracount = 0;
    for(let i = array.equation.length - 1; i >= 0; i--){
        if (array.equation[array.equation.length - 1] != ')' || currentnum){
            pare1 = null;
            pare2 = null;
            break;
        }
        if(paracount == 0 && array.equation[i].toString() == "("){
            pare1 = i;
            pare2 = array.equation.length - 1;
            break;
        }
        if(i != array.equation.length - 1 && array.equation[i] == ")"){
            paracount++;
            continue;
        }
        if(paracount && array.equation[i] == "("){
            paracount--;
        }
    }
    if(!pare1 || !pare2){
        return null;
    }
    else{
        return [pare1,pare2];
    }
}

function loadDisplay(array){
    if(!currentnum && !array.equation.length){
        return 0;
    }
    let display = '';
    let functcheck = false;
    let pareload = checkParenthesis(array);
    let lengths = 0;
    let functions = ['%','x','-','+','÷']
    for (let i = 0; i < array.equation.length; i++){
        if(pareload){
            if (i == pareload[0] || i == pareload[1]){
                display = display + `<span class ="function">${array.equation[i]}</span>`;
                lengths++;
                continue;
            }
        }
        for(let j = 0; j < functions.length; j++){
            if(array.equation[i] == functions[j]){
                display = display + `<span class ="function">${array.equation[i]}</span>`;
                functcheck = true;
                lengths++;
            }
        }
        if(!functcheck){
            if(array.equation[i]== "(" || array.equation[i] == ")"){
                display = display + array.equation[i];
                lengths++;
                continue;
            }
            if(array.equation[i].toString().includes('.')){
                newnum1 = array.equation[i].toString().split('.');
                let convert = Number(newnum1[0]);
                convert = convert.toLocaleString("en-US");
                convert = convert + '.' + newnum1[1];
                if(convert.toString().length > 15) convert = expo(convert, 8);
                lengths += convert.length;
                display = display + `<span>${convert.toLocaleUpperCase()}</span>`;
                continue;
            }
            let convert = Number(array.equation[i]);
            convert = convert.toLocaleString("en-US");
            if(array.equation[i].toString().length > 15) convert = expo(convert, 8);
            lengths += array.equation[i].length;
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
            if(currentnum.toString().includes('.')){
                let newnum1 = currentnum.toString().split('.');
                let convert = Number(newnum1[0]);
                convert = convert.toLocaleString("en-US");
                convert = convert + '.' + newnum1[1];
  
                display = display + `<span>${convert.toLocaleUpperCase()}</span>`;
                fontCheck(lengths);
                return display;
            }
            let convert = Number(currentnum);
            if(convert.toString().length > 15) convert = expo(convert, 8);
            convert = convert.toLocaleString("en-US");
            display = display + `<span>${convert.toLocaleUpperCase()}</span>`;
        }
    }
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
        currentnum = 0 + e.target.textContent.toString();
        stateChange("number");
    }
    else{
        currentnum = currentnum + e.target.textContent.toString();
    }
}
function operate(array){
    if(array.length == 1) return array[0];
    //executing PEMDAS
    //parenthesis
    let parantheis = search(array, ['(']);
    if(parantheis[0]){
        let startIndex = parantheis[1];
        let endIndex = parenthesisSearch(array, startIndex);

        let newequation = parenthesisParser(array,startIndex,endIndex);


        let sum = operate(newequation);


        let finalequation = arrayBuilder(array, startIndex, endIndex, sum);

        return operate(finalequation);

    }
    //percentage

    let percentag = search(array,['%']);

    if(percentag[0]){
        let value = array[percentag[1]- 1];

        let percent = percentage(Number(value));

        let newequation = arrayBuilder(array,percentag[1]-1,percentag[1],percent);
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
        return operate(product);
    }

    //Add/Subtract
    let as = search(array,['+','-']);

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
        return operate(newequation);
    }

}



function search(array, items){
    for(let i = 0; i < array.length; i++){
        let indexString = array[i].toString();
        for(let j = 0; j < items.length; j++){
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
            paracount++;
        }
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