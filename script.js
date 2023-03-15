let equation = [];

function operate(){
    
}

function paranthesisParser(array, start, stop){
    let newArray = [];

    for(let i = 0; i < array.length; i++){
        if(i >= start && i <= stop){
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
        else if(i = stop){
            newArray.push(newValue);
        }
        else{
            newArray.push(array[i]);
        }
    }

    return newArray;
}

function paranthesisSearch(array, startIndex){
    let paracheck = false;

    for(let i = startIndex; i < array.length; i++){
        if(array[i].includes("(")){
            paracheck = true;
        }
        if(!paracheck && array[i].includes(')')){
            return i;
        }
        else if (paracheck && array[i].includes(')')){
            paracheck = false;
        }
        if(i = array.length - 1){
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