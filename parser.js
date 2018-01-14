// ryan birmingham rbirm.us, forms.audio

// globals
var STACK = [];
var STATE = [];
var BLOCK = [];
var VARS = {};
var CONTINUE = true;
var PROGRAMS = {};

// TODO, this is a placeholder
function speak(word){
    // TODO implement
    console.log(word);
}

// TODO, this is a placeholder
function listen(){
    // TODO implement
    // probably want to beep/tick after each word done
    // maybe give change to redo - add confirm here?
    console.log("Lisening");
    return "na";

}

// TODO, this is a placeholder
function get_next_word(){
    return "word";
}

// TODO add a confirmation method for better safety

// TODO figure out what's needed for self encapsulation

function resolve_word(word){
    word = word.toLowerCase();
    if (word === "falafel"){
        // super escape (menu)
    } else if (STATE === "block"){
        // we're in block mode
        if (word === "end"){
            // set stack to JUST the last block
            STACK = BLOCK;
            STATE = "";
        } else {
            BLOCK = BLOCK.concat(word);
        }
    } else if (STATE === "escape"){
        // we're in escape mode
        // escape the word
        STACK = [word];
        STATE = "";
    } else if (STATE === "say"){
        // we're in speak mode
        speak(word);
        STATE="";
    } else if (STATE === "listen"){
        // we're in speak mode
        STACK = listen();
        STATE="";
    } else if (STATE === "as"){
        // assignment mode
        VARS[word] = STACK;
        STATE="";
    } else if (STATE === "append"){
        // we're in append mode
        STACK = Array.of(STACK).concat(word);
    } else if (word === "escape"){
        // non-escaped "escape"
        STATE="escape"
    } else if (STATE === "run"){
        // run a block/var
        VARS[word].forEach(resolve_word);
        // return value is now on stack
        STATE = "";
    } else if (word === "end"){
        // confirm then exit program
        CONTINUE = false;
    } else if (word === "block"){
        // enter block mode
        STATE = "block";
    } else if (word === "as"){
        // assignment mode
        STATE = "as";
    } else if (word === "say"){
        // speak mode
        STATE = "say";
    } else if (word === "listen"){
        // listen mode
        STATE = "listen";
    } else if (word === "run"){
        // run mode
        STATE = "run";
    } else if (word === "append"){
        // append mode
        STATE = "append";
    } else {
        // it's a literal, put it on stack
        STACK = word;
    }
}

function start_script(){
    var word = get_next_word().toLowerCase();
    if (word==="load" || word === "run"){
        STATE = "load";
        start_script();
    }
    else if (word === "new" || word === "write"){
        // may want to say something to adknowlege mode shift
        STATE = "";
        return "";
    }
    else if (state = "load"){
        return PROGRAMS[word];
    }
}

function finalization_script(){
    // what to do with stack?
    if (word === "send"){
        STATE = "send";
        finalization_script();
    }
    if (word === "save"){
        STATE = "save";
        finalization_script();
    }
    if (word === "as"){
        // do nothing
        finalization_script();
    }
    if (STATE === "save"){
        PROGRAMS[word] = STACK;
    }
}

// run the program
function run(){
    var program = start_script();
    if (!program){
        // listen for words
        while(CONTINUE){
            var word = get_next_word();
            if (isword(word)){
                resolve_word(word);
            } else {
                console.log("not word");
                //keep listening...
            }
        }
    } else {
        // run it
        program.forEach(resolve_word);
    }

    finalization_script();
}
