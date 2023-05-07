
//Actions

function handleAction(state,action) {
    if(action.type == "setUser"){
        localStorage.setItem("userName",action.user);
        return Object.assign({},state,{user:action.user});
    }
    else if(action.type == "setTalks"){
        return Object.assign({},state,{talks: action.talks});
    }
    else if(action.type == "newTalk"){
        fetchOk(talkUrl(action.title),{
            method: "PUT",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({
                presenter: state.user,
                summary: state.summary
            })
        }).cath(reportError);
    }
    else if(action.type == "deleteTalk"){
        fetchOk(talkUrl(action.talk),{method: "DELETE"}).cath(reportError);
    }
    else if(action.type == "newComment"){
        fetchOk(talkUrl(action.talk) + "/comments",{
            method:"POST",
            headers: {"Content-Type":"application/JSON"},
            body: JSON.stringify({
                author: state.user,
                message: action.message
            })
        }).cath(reportError);
    }
    return state;
}

function fetchOk(url,options){
    return fetch(url,options).then(response => {
        if(response.status < 400) return response;
        else throw new Error(response.statusText);
    });
}

function talkUrl(title){
    return "talks/" + encodeURIComponent(title);
}

function reportError(error){
    alert(String(error));
}

//Rendering Components

function renderUserField(name,dispatch){
    return elt("label",{},"Your name",elt("input",{type: "text",value:name,onchange(event){
        dispatch({type:"setUser",user:event.target.value});
    }}));
}

function elt(type, props, ...children) {
    let dom = document.createElement(type);
    if (props) Object.assign(dom, props);
    for (let child of children) {
      if (typeof child != "string") dom.appendChild(child);
      else dom.appendChild(document.createTextNode(child));
    }
    return dom;
  }

  function renderTalk(talk, dispatch) {
    return elt(
      "section", {className: "talk"},
      elt("h2", null, talk.title, " ", elt("button", {
        type: "button",
        onclick() {
          dispatch({type: "deleteTalk", talk: talk.title});
        }
      }, "Delete")),
      elt("div", null, "by ",
          elt("strong", null, talk.presenter)),
      elt("p", null, talk.summary),
      ...talk.comments.map(renderComment),
      elt("form", {
        onsubmit(event) {
          event.preventDefault();
          let form = event.target;
          dispatch({type: "newComment",
                    talk: talk.title,
                    message: form.elements.comment.value});
          form.reset();
        }
      }, elt("input", {type: "text", name: "comment"}), " ",
         elt("button", {type: "submit"}, "Add comment")));
  }

  function renderComment(comment) {
    return elt("p", {className: "comment"},
               elt("strong", null, comment.author),
               ": ", comment.message);
  }

  function renderTalkForm(dispatch) {
    let title = elt("input", {type: "text"});
    let summary = elt("input", {type: "text"});
    return elt("form", {
      onsubmit(event) {
        event.preventDefault();
        dispatch({type: "newTalk",
                  title: title.value,
                  summary: summary.value});
        event.target.reset();
      }
    }, elt("h3", null, "Submit a Talk"),
       elt("label", null, "Title: ", title),
       elt("label", null, "Summary: ", summary),
       elt("button", {type: "submit"}, "Submit"));
  }

async function pollTalks(){
    let tag = undefined;
    for(;;){
        let response;
        try {
            response = await fetchOk("/talks",{
                headers: tag && {"If-None-Match":tag,"Prefer":"wait=90"} //this means 
                //that if tag != undefined -> include object headers
                //         else -> it's not included
            })
        }
        catch(e){
            console.log("Request failed: " + e);
            await new Promise(resolve => setTimeout(resolve,500));
            continue;
        }
        if(response.status == "304") continue; //Jump to the next iteration
        tag = response.headers.get("Etag");
        update(await response.json);
    }
}

class SkillShareApp{
    constructor(state,dispatch){
        this.dispatch = dispatch;
        this.talkDOM = elt("div", {className: "talks"});
        this.dom = elt("div", null,
                        renderUserField(state.user, dispatch),
                        this.talkDOM,
                        renderTalkForm(dispatch));
        this.syncState(state);
    }

    syncState(state){

        //if there are updates between the talks in the state and the talks in
        //the application -> update

        if(state.talks != this.talks){
            this.talkDOM.textContent = ""; //empty the DOM
            for(let talk of state.talks){ //Rewrite the whole DOM
                this.talk.appendChild(renderTalk(talk,this.dispatch));
            }
            this.talks = state.talks; //Update the application talks
        }
    }
}

function runApp(){
    let user = localStorage.getItem("userName") || "Anon"; //Default -> anon
    let state, app;

    function dispatch(action){
        state = handleAction(state,action); //Update the current state
    }
    pollTalks(talks=>{
        if(!app){
            state = {user,talks};
            app = new SkillShareApp(state,dispatch);
            document.body.appendChild(app.dom);
        }
        else{
            dispatch({type:"setTalks",talks});
        }
    }).catch(reportError);
}

runApp();