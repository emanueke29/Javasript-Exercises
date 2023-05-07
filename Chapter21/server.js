const {createServer} = require("http");
const Router = require("./router.js");
const ecstatic = require("/Users/ema/node_modules/ecstatic"); //-> to handle static files (ex style.css, index.html)
//this static files are in a directory accessible by the server usually called "public"

const router = new Router();
const defaultHeaders = {"Content-Type":"text/plain"};


//The server

class SkillShareServer{
    constructor(talks){
        this.talks = talks;
        this.version = 0;
        this.waiting = [];

        let fileServer = ecstatic({root: "./public"});
        this.server = createServer((request,response)=>{
            let resolved = router.resolve(this,request);
            if(resolved){
                resolved
                    .catch(error => {
                        if(error.status != null) return error;
                        return {body: String(error),status:500};
                    })
                    .then(({body,status = 200, headers = defaultHeaders})=>{
                        response.writeHead(status, headers);
                        response.end(body);
                    })

            }
            //else is a request to a static file
            else{
                fileServer(request,response);
            }
        }); 
    }

    start(port){
        this.server.listen(port);
    }

    stop(){
        this.server.close();
    }
}

//The handler for requests

const talkPath = /^\/talks\/([^\/]+)$/;
//the "^" in square brackets means the beginning of a capture group
//In this case the capture group consists in every character, except "/", repeated 
//1 or more times until the next "/" character
//The characters in the capture group can be used later

//GET method

router.add("GET",talkPath,async (server,title)=>{
    if(title in server.talks){
        return {body: JSON.stringify(server.talks[title]),
                headers: {"Content-Type":"application/json"}};
    }
    else{
        return {status:404,body: `No talk '${title}' found`};
    }
});

//DELETE method

router.add("DELETE",talkPath,async (server,title)=>{
    if(title in server.talks){
        delete server.talks[title];
        server.updated();
    }
    else{
        return {status:204};
    }
});

//Retrieve content from a request body

function readStream(stream){
    return new Promise((resolve,reject)=>{
        let data = "";
        stream.on("error",reject);
        stream.on("data",chunk => {
            data += chunk.toString();
        });
        stream.on("end",()=>resolve(data));

    })
}

//PUT method

router.add("PUT",talkPath, async (server,title,request)=>{
    let requestBody = await readStream(request);
    let talk;
    try{
        talk = JSON.parse(requestBody);
    }
    catch(_){
        return {status:400,body:"Invalid JSON"};
    }

    if(!talk || typeof talk.presenter != "string" || typeof talk.summary != "string"){
        return {status:400,body:"Bad talk data"};
    }
    server.talks[title] = {title,presenter: talk.presenter, summary: talk.summary, comments: []};
    server.updated();
    return {status:204};

});

//POST method

router.add("POST",/^\/talks\/([^\/]+)\/comments$/,async (server,title,request)=>{
    let requestBody = await readStream(request);
    let comment;    
    try{
        comment = JSON.parse(requestBody);
    }
    catch(_){
        return {status:400,body:"Invalid JSON"};
    }

    if(!comment || typeof comment.author != "string" || typeof comment.message != "string" ){
        return {status:400,body:"Bad comment data"};
    }
    else if(title in server.talks){
        server.talks[title].comments.push(comment);
        server.updated();
        return {status:204};
    }
    else{
        return {status:404,body:`No talk ${title} found`};
    }
});

SkillShareServer.prototype.talkResponse = function(){
    let talks = [];
    for(title of Object.keys(this.talks)){
        talks.push(this.talks[title]);
    }
    return {
        body: JSON.stringify(talks),
        headers: {"Content-Type":"application/json", "ETag":`"${this.version}"`}
    };
};

//GET method part 2
//Implementation for conditional getting -> if the status doesn't change return it
router.add("GET",/^\/talks$/,async (server,request)=>{
    let tag = /"(.*)"/.exec(request.headers["if-none-match"]);
    let wait = /\bwait=(\d+)/.exec(request.headers["prefer"]);
    //[1] -> first match in the exec
    if(!tag || tag[1] != server.version){
        return server.talkResponse();
    }
    else if(!wait){
        //304 -> "Not modified"
        return {status:304};
    }
    else{
        return server.waitForChanges(Number(wait[1]));
    }
})

//Function for timeout

SkillShareServer.prototype.waitForChanges = function(time) {
    return new Promise(resolve => {
        //Adding the resolve function in the waiting list
        this.waiting.push(resolve);
        //After a timeout -> check if the resolve was solved (check if it is already 
        //in the array) -> if it is like this ->
        //delete the resolve function from the waiting list
        //304 -> "Not modified"
        setTimeout(()=>{
            if(!this.waiting.includes(resolve)) return;
            this.waiting = this.waiting.filter(r => r != resolve);
            resolve({status:304})
        },time*1000);

    })
}

//Registering a change 

SkillShareServer.prototype.updated = function(){
    this.version++;
    let response = this.talkResponse();
    this.waiting.forEach(resolve => resolve(response));
    this.waiting = [];
}

new SkillShareServer(Object.create(null)).start(8000);