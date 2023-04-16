let equation = [];

let state = [];

let currentnum;

let paranthesiscount = 0;

let num = false;

let decimal = false;

let funct = false;

let perc = false;

let division = false;

let solutionCheck = false;

let warningcheck = false;

const numbers = document.querySelectorAll('.number');

const functions = document.querySelectorAll('.func');

const clear = document.querySelector('.clear');

clear.addEventListener('click',clearDisplay);

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
    if(perc || equation[equation.length - 1] == ")" && !currentnum) loadMultiplty();
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
    if(funct){
        equation.push(currentnum);
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
        if(perc){
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
    equation = [];
    currentnum = null
    let input = document.querySelector('.input');
    input.innerHTML = 0;
    stateChange('clear');
    previewOperation();
    return;
}

function loadMultiplty(){
    if(currentnum) equation.push(currentnum);
    currentnum = "x";
    stateChange('function');
    return;
}

function previewOperation(){
    let preview = [];
    for(let i = 0; i < equation.length; i++){
        preview.push(equation[i]);
    }
    let newnum = currentnum;
    if (!funct && preview.length){
        if(newnum) preview.push(newnum);
        let solution = operate(preview);
        solution = Math.round((solution + Number.EPSILON) * 100) / 100;
        if(solution.toString().length > 15) solution = expo(solution, 15);
        console.log(`hi solo ${solution} solution length ${solution.toString().length}`);
        loadSolution(solution.toLocaleString("en-US"), ".solution");
    }
    else{
        console.log("preview");
        loadSolution('', ".solution");
        return;
    }
}

function startOperation(){
    if (!funct && equation.length){
        if(currentnum) equation.push(currentnum);
        let solution = operate(equation);
        solution = Math.round((solution + Number.EPSILON) * 100) / 100;
        if(solution.toString().length > 15) solution = expo(solution, 15);
        console.log(`hi solo ${solution} solution length ${solution.toString().length}`);
        loadSolution(solution.toLocaleString("en-US").toUpperCase(), ".input");
        loadSolution('', ".solution");
        perc = false;
        solutionCheck = true;
        equation = [];
        currentnum = solution;
    }
    else{
        return;
    }
}

function numCheck(){
    if(currentnum) currentnum = currentnum.toString(); 
    if(!num){
        return false;
    }
    if(currentnum && num){
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
            num = false;
            currentnum = null;
            solutionCheck = !solutionCheck;
            break;
        case 'number':
            num = true;
            funct = false;
            break;
        case 'function':
            solutionCheck = false;
            decimal = false;
            num = false;
            funct = true;
            perc = false;
            break;
        case 'clear':
            decimal = false;
            num = false;
            funct = false;
            perc = false;
            solutionCheck = false;
            paranthesiscount = 0;
            break;
    }
}

function percentageCheck(e){
    if(num && !perc){
        equation.push((currentnum));
        currentnum = e.target.textContent.toString();
        perc = true;
        return;
    }
    else{
        return;
    }
}

function loadFunction(e){
    console.log('here func');
    if(e.target.textContent == "( )"){
        parenthesisLoader();
        if(equation.length){
            loadInput();
            previewOperation();
        } 
        return;
    }
    if(e.target.textContent == "%"){
        percentageCheck(e);
        loadInput();
        previewOperation();
        return;
    }
    if (!funct && currentnum){
        equation.push(currentnum);
        currentnum = null;
        currentnum = e.target.textContent.toString();
        if(e.target.textContent == "÷") {
            division = true;
        }
        else{
            division = false;
        }
        stateChange('function');
        loadInput();
        previewOperation();
        return;
    }
    else if(!funct && equation[equation.length -1] == ')'){
        currentnum = null;
        currentnum = e.target.textContent.toString();
        stateChange('function');
        loadInput();
        previewOperation();
        return;
    }
    else if(funct && (e.target.textContent != currentnum )){
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
    if(!paranthesiscount && num) loadMultiplty();
    if(funct && currentnum){
        equation.push(currentnum);
        currentnum = "(";
        equation.push(currentnum);
        currentnum = null;
        console.log(equation);
        paranthesiscount++;
        return;
    }
    console.log(`paraKing para: ${paranthesiscount} num: ${num}`);
    if (paranthesiscount && num){
        console.log(`paraKing para: ${paranthesiscount} num: ${num}`);
            if(currentnum) equation.push(currentnum);
            currentnum = ")";
            equation.push(currentnum);
            currentnum = null;
            paranthesiscount--;
            return;
    }


}

function loadSolution(value, destination){
    let display = document.querySelector(destination);
    display.innerHTML = value;
    return;
}

function loadInput(){
    let input = document.querySelector('.input');
    let display = loadDisplay();
    input.innerHTML = display;
    return;
}

function checkLength(){
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
    for(let i = equation.length - 1; i >= 0; i--){
        console.log(`current equation ${equation[i]} last equation ${equation[equation.length - 1]}`)
        if (equation[equation.length - 1] != ')' || currentnum){
            console.log("no para");
            pare1 = null;
            pare2 = null;
            break;
        }
        if(paracount == 0 && equation[i].toString() == "("){
            console.log('para accept');
            pare1 = i;
            pare2 = equation.length - 1;
            break;
        }
        if(i != equation.length - 1 && equation[i] == ")"){
            console.log("hi there");
            paracount++;
            continue;
        }
        if(paracount && equation[i] == "("){
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
    let display = '';
    let functcheck = false;
    let pareload = checkParenthesis();
    let functions = ['%','x','-','+','÷']
    for (let i = 0; i < equation.length; i++){
        if(pareload){
            if (i == pareload[0] || i == pareload[1]){
                console.log('check here');
                display = display + `<span class ="function">${equation[i]}</span>`;
                continue;
            }
        }
        for(let j = 0; j < functions.length; j++){
            if(equation[i] == functions[j]){
                display = display + `<span class ="function">${equation[i]}</span>`;
                functcheck = true;
            }
        }
        if(!functcheck){
            if(equation[i]== "(" || equation[i] == ")"){
                display = display + equation[i];
                continue;
            }
            let convert = Number(equation[i])
            display = display + `<span>${convert.toLocaleString("en-US")}</span>`;
        }
        functcheck = false;
    }
    if(currentnum){
        for (let i = 0; i < functions.length; i++){
            if(currentnum == functions[i]){
                display = display + `<span class ="function">${currentnum}</span>`;
                functcheck = true;
            }
        }
        if(!functcheck){
            let convert = Number(currentnum);
            display = display + `<span>${convert.toLocaleString("en-US")}</span>`;
        }
    }

    return display;
}

function decimalCheck(e){
    if(decimal){
        return;
    }
    else if(!decimal && funct){
        equation.push(currentnum);
        funct = !funct;
        decimal = !decimal;
        currentnum = 0 + e.target.textContent.toString();
        return;
    }
    else if(!decimal && !num){
        console.log(`here num`)
        decimal = !decimal; 
        console.log(currentnum);
        currentnum = 0 + e.target.textContent.toString();
        console.log(currentnum);
    }
    else{
        decimal = !decimal; 
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
    return a / b;
}