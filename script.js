let equation = [];

let input;
do{
    input = prompt('input equation');
    if(input != '='){
        equation.push(input);
    }
}
while(input != '=');

console.log(equation);

let final = operate(equation);

console.log(final);

function operate(array){
    if(array.length == 1) return array[0];
    //executing PEMDAS
    
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
        let value = array[percentag[1]].replace('%','');

        let percent = percentage(Number(value));

        let newequation = arrayBuilder(array,percentag[1],percentag[1],percent);
        console.log(`parcentage array ${newequation}`);
        return operate(newequation);
    }

    //multiply/divide

    let md = search(array,['X','÷']);
    let pd;

    if(md[0]){
        switch(md[2]){
            case 'X':
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
        console.log(`add/subtract new equation ${newequation}`)
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
            if(indexString.includes(items[j])){
            return [true, i, items[j]];
            }
        }
        
       
    }

    return [false];
}

function parenthesisParser(array, start, stop){

    if (start == stop){
        return [array[start]];
    }
    let newArray = [];

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
    let paracheck = false;
    if(array[startIndex].includes(')')){
        return startIndex;
    }

    for(let i = startIndex+1; i < array.length; i++){
        let indexString = array[i].toString();


        if(indexString.includes("(")){
            console.log(`here`)
            paracheck = true;
        }
        console.log(`check paracheck = ${paracheck}  index = ${indexString.includes(')')} indice = ${i} array length = ${array.length}`)
        if(!paracheck && indexString.includes(')')){
            return i;
        }
        else if (paracheck && indexString.includes(')')){
            paracheck = false;
        }
        else if(i == array.length - 1){
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