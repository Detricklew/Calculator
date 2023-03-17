let equation = [];

function operate(array){
    if(array.length = 1) return array[0];
    //executing PEMDAS
    //parenthesis
    let parantheis = search(array, ['(']);
    if(parantheis[0]){
        let startIndex = parantheis[1];
        let endIndex = parenthesisSearch(array, startIndex);

        array[startIndex] = array[startIndex].replace('(','');
    
        if(array[endIndex].toString().includes(')')){
            array[endIndex]= array[endIndex].replace(')','')
        }

        let newequation = parenthesisParser(array,startIndex,endIndex);

        let sum = operate(newequation);

        let finalequation = arrayBuilder(array, startIndex, endIndex, sum);

        return operate(finalequation);

    }

}



function search(array, items){
    for(let i = 0; i < array.length; i++){
        let indexString = array[i].toString();
       items.forEach(item =>{
        if(indexString.includes(item)){
            return [true, i];
        }
       })
    }

    return [false];
}

function parenthesisParser(array, start, stop){

    if (start == stop){
        return [array[start]];
    }
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

    if(start == stop) return [array[start]];
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

function parenthesisSearch(array, startIndex){
    let paracheck = false;
    if(array[startIndex].includes(')')){
        return startIndex;
    }

    for(let i = startIndex+1; i < array.length; i++){
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