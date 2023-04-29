//JSON

fetch("https://eloquentjavascript.net/author",{
    method: "GET",
    headers:{
        "Accept": "application/json"
    }
}).then(response => response.text())
.then(data=>console.log(data))
.catch(error=>console.log(error));

//plaintext

fetch("https://eloquentjavascript.net/author",{
    method: "GET",
    headers:{
        "Accept": "text/plain"
    }
}).then(response => response.text())
.then(data=>console.log(data))
.catch(error=>console.log(error));

//html

fetch("https://eloquentjavascript.net/author",{
    method: "GET",
    headers:{
        "Accept": "text/html"
    }
}).then(response => response.text())
.then(data=>console.log(data))
.catch(error=>console.log(error));

//rainbows+unicorns

fetch("https://eloquentjavascript.net/author",{
    method: "GET",
    headers:{
        "Accept": "application/rainbows+unicorns"
    }
}).then(response => response.text())
.then(data=>console.log(data))
.catch(error=>console.log(error));
