
size = 8;
let str="";
for(let i=0;i<size;i++){
    str="";
    if(i%2==0){
        for(let j=0;j<size/2;j++){
            str+=" #";
        }
        console.log(str);
    }
    else{
        for(let j=0;j<size/2;j++){
            str+="# ";
        }
        console.log(str);
    }
}


