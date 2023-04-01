//Page 73

function wrapper(target){

    function find(current, history){
        if(current==target){
            return history;
        }   
        if(current>target){
            return null;
        }
        else{
            return find(current+5,`(${history}+5)`) || find(current*3,`(${history})*3`);
        }
    }
    return find(1,"1");
}

console.log(wrapper(24));

