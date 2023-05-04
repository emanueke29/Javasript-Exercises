const {statSync, readdirSync, readFileSync, sep} = require("fs");

let regex = new RegExp (process.argv[2]);
let files = process.argv.slice(3);

for(let arg of files){
    search(arg);
}
function search(file){

    let stats = stateSync(f);
    if(stats.isDirectory()){
        for(let f of readdirSync(file)){
            search(file + sep + f);
        }
    }
    else if(regex.test(readFileSync(file))){
        console.log(file);
    }

}

