
const specialForms = Object.create(null);

//Identifying expressions 

function parseExpression(program) {
    program = skipSpace(program);
    let match, expr;
    if (match = /^"([^"]*)"/.exec(program)) {
      expr = {type: "value", value: match[1]};
    } else if (match = /^\d+\b/.exec(program)) {
      expr = {type: "value", value: Number(match[0])};
    } else if (match = /^[^\s(),#"]+/.exec(program)) {
      expr = {type: "word", name: match[0]};
    } else {
      throw new SyntaxError("Unexpected syntax: " + program);
    }
    //expr -> first expr found
    //program -> last part skipping the first expr
    return parseApply(expr, program.slice(match[0].length));
}

function skipSpace(string) {
    //Skipping comments and white spaces
    let skippable = string.match(/^(\s|#.*)*/);
    return string.slice(skippable[0].length);
  }

function parseApply(expr, program) {
    program = skipSpace(program);
    if (program[0] != "(") {
        return {expr: expr, rest: program};
    }
    //Delete "("
    program = skipSpace(program.slice(1));
    //Creating apply object
    expr = {type: "apply", operator: expr, args: []};
    while (program[0] != ")") {
        let arg = parseExpression(program);
        expr.args.push(arg.expr);
        program = skipSpace(arg.rest);
        if (program[0] == ",") {
        program = skipSpace(program.slice(1));
        } else if (program[0] != ")") {
        throw new SyntaxError("Expected ',' or ')'");
        }
  }
    //Recursive because the expr found cold be an other apply
    return parseApply(expr, program.slice(1));
}

function parse(program){
    let {expr,rest} = parseExpression(program);
    if(skipSpace(rest).length > 0){
        throw new SyntaxError("Unexpected text after the program");
    }
    return expr;
}

//The evaluator

function evaluate(expr,scope){
    if(expr.type == "value"){
        return expr.value;
    }
    else if(expr.type == "word"){
        if(expr.name in scope){
            return scope[expr.name];
        }
        else{
            throw new ReferenceError(`Undefined binding: ${expr.name}`);
        }
    }
    else if(expr.type == "apply"){
        let {operator,args} = expr;
        if(operator.type == "word" && operator.name in specialForms){
            return specialForms[operator.name](expr.args,scope);
        }
        else{
            let op = evaluate(operator,scope);
            if(typeof op == "function"){
                //"op" operation executed on "...args" array
                return op(...args.map(arg=> evaluate(arg,scope)));
            }
            else{
                throw new TypeError("Applying a non-function");
            }
        }
    }
}

//Special forms

//if 

specialForms.if = (args,scope) => {
    if(args.length != 3){ //The functions accepts only 3 arguments
        throw new SyntaxError("Wrong number of args to if");
    }
    //Checking "!== false" because every other result (not only true) is valid (like numbers,etc..)
    else if(evaluate(args[0],scope)!==false){
        return evaluate(args[1],scope);
    }
    else{
        return evaluate(args[2],scope);
    }
}

//while

specialForms.while = (args,scope) => {
    if(args.length != 2){
        throw new SyntaxError ("Wrong number of args to while");
    }
    while(evaluate(args[0],scope)!==false){
        evaluate(args[1],scope);
    }
}

//do
//Executing all arguments from top to bottom

specialForms.do = (args,scope) =>{
    let value = false;
    for(let arg of args){
        value = evaluate(arg,scope);
    }
    return value;
}

//define

specialForms.define = (args,scope) => {
    if(args.length != 2 || args[0].type != "word"){
        throw new SyntaxError ("Incorrect use of define");
    }
    let value = evaluate(args[1],scope);
    scope[args[0].name] = value;
    return value;
}

//The environment
const topScope = Object.create(null);

topScope.true = true;
topScope.false = false;
//Adding other basic operations
for (let op of ["+", "-", "*", "/", "==", "<", ">"]) {
    topScope[op] = Function("a, b", `return a ${op} b;`);
}

topScope.print = value => {
    console.log(value);
    return value;
}
//Run program in a fresh scope
function run(program){
    return evaluate(parse(program),Object.create(topScope));
}

//Functions

specialForms.fun = (args,scope) =>{
    if(!args.length){
        throw new SyntaxError ("Function need a body");
    }
    //Body is the last arg of the function
    let body = args[args.length - 1];
    //Parameters are all the elements before the body in the function
    //All parameters must be words
    let params = args.slice(0,args.length - 1).map(expr=>{
        if(expr.type != "word"){
            throw new SyntaxError("Parameter names must be words");
        }
        return expr.name;
    });

    return function(){
        if(arguments.length != params.length){
            throw new TypeError("Wrong number of arguments");
        }
        //Creating the fresh local scope of the function
        let localScope = Object.create(scope);
        for(let i=0;i<arguments.length;i++){
            localScope[params[i]] = arguments[i];
        }
        //Executing the function
        return evaluate(body,localScope);
    }
}
//Testing
console.log(parse("+(a,10)"));
let prog = parse('if(true,false,true)');
console.log(evaluate(prog,topScope));  
run(`
do(define(total, 0),
   define(count, 1),
   while(<(count, 11),
         do(define(total, +(total, count)),
            define(count, +(count, 1)))),
   print(total))
`);
// → 55

run(`
    do(define(plusOne, fun(a, +(a, 1))),
        print(plusOne(10)))
    `);
// → 11
run(`
    do(define(pow, fun(base, exp,
        if(==(exp, 0),
            1,
            *(base, pow(base, -(exp, 1)))))),
        print(pow(2, 10)))
`);
// → 1024

//Exercise 27

topScope.array = (...values) => values; //it returns the array

topScope.length = (array) => array.length;

topScope.element = (array,i) => array[i];

run(`
do(define(sum, fun(array,
     do(define(i, 0),
        define(sum, 0),
        while(<(i, length(array)),
          do(define(sum, +(sum, element(array, i))),
             define(i, +(i, 1)))),
        sum))),
   print(sum(array(1, 2, 3))))
`);
// → 6

//Exercise 28

run(`
    do(define(f, fun(a, fun(b, +(a, b)))),
        print(f(4)(5)))
`);
//Answer: let localScope = Object.create(scope);
// → 9

//Exercise 29
//Modifying skipSpace()
console.log(parse("# hello\nx"));
// → {type: "word", name: "x"}

//Exercise 30

specialForms.set = (args, env) => {
    //Checking syntax
    if (args.length != 2 || args[0].type != "word") {
      throw new SyntaxError("Bad use of set");
    }
    let varName = args[0].name;
    let value = evaluate(args[1], env);
  
    //Searching in parents'scopes if the variable is defined
    //Condition is scope because it can be: true, null or undefined
    for (let scope = env; scope; scope = Object.getPrototypeOf(scope)) {
      if (Object.prototype.hasOwnProperty.call(scope, varName)) {
        scope[varName] = value;
        return value;
      }
    }
    throw new ReferenceError(`Setting undefined variable ${varName}`);
};

run(`
do(define(x, 4),
   define(setx, fun(val, set(x, val))),
   setx(50),
   print(x))
`);
// → 50
run(`set(quux, true)`);
// → Some kind of ReferenceError