function speak(word){
    // TODO implement
    console.log(word);
}

function listen(word){
    // TODO implement
    console.log("Lisening");
    return "na";
}

function get_next_word(){
    return "word";
}

function resolve_word(word){
    word = word.toLower();
    if (word === "falafel"){
        // super escape (menu)
    } else if (STATE === "escape"){
        // we're in escape mode
        // escape the word
        STATE = "";
    } else if (STATE === "say"){
        // we're in speak mode
        speak(word);
        STATE="";
    } else if (STATE === "block"){
        // we're in block mode
        // run block resolver
    } else if (STATE === "append"){
        // we're in append mode
    } else if (word === "escape"){
        // non-escaped "escape"
        STATE="escape"
    } else if (STATE === "set"){
        // set or run mode
        // do it
        STATE = "";
    } else if (word === "end"){
        // confirm then exit program
    } else if (word === "block"){
        // enter block mode
        STATE = "block";
    } else if (word === "as"){
        // assignment mode
    } else if (word === "say"){
        // speak mode
    } else if (word === "listen"){
        // assignment mode
    } else if (word === "set"){
        // run or promote mode
        // run a resolver on blocks
    } else if (word === "append"){
        // append mode
        STATE = "append"
    } else {
        // it's a literal
    }
}

function run(){
    var STACK = [];
    var STATE = [];
    var BLOCK = [];
    var VARS = {};
    // listen for words
    while(true){
        var word = get_next_word();
        if (isword(word)){
            resolve_word(word);
        } else {
            console.log("not word");
            //keep listening...
        }
    }
}
