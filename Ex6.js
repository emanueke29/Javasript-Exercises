

function countBs(string){
    let count = 0;
    for(let i=0;i<string.length -1 ;i++){
        if(string[i]==="B"){
            count++;
        }
    }
    return count;
}

function countChar(string,char){
    let count = 0;
    for(let i = 0;i < string.length;i++){
        if(string[i]===char){
            count++;
        }
    }
    return count;
}

console.log(countBs("Beanies"));
console.log(countChar("Beanies","e"));