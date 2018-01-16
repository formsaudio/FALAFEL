// ryan birmingham rbirm.us, forms.audio
// globals
var STACK = [];
var STATE = [];
var BLOCK = [];
var VARS = {};
var CONTINUE = true;
var PROGRAMS = {};
var LAST_SPOKEN = "";

// initalize voice once
var voice = new SpeechSynthesisUtterance();
// intalize listener once
var recognition = new(window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;


function speak(word) {
    voice.text = word;
    voice.rate = 0.8;
    speechSynthesis.speak(voice);
}

// TODO add confirm method

function listen() {
    recognition.start();
    speak("listening");
    recognition.onresult = function(event) {
        LAST_SPOKEN = event.results[0][0].transcript);
    // REALLY bad method for this, but idk what else to do
    while (!LAST_SPOKEN) {
        let a = 1;
    }
    res = LAST_SPOKEN;
    LAST_SPOKEN = "";
    recognition.stop();
    speak("got + "
        res)
    return res;
}

function send(item, dest) {
    console.log("Sending " + item + " to " + " dest.");
}

// TODO add a confirmation method

// TODO figure out what's needed for self encapsulation

function resolve_word(word) {
    word = word.toLowerCase();
    if (STATE === "block") {
        // we're in block mode
        if (word === "end") {
            // set stack to JUST the last block
            STACK = BLOCK;
            STATE = "";
        } else {
            BLOCK = BLOCK.concat(word);
        }
    } else if (STATE === "escape") {
        // we're in escape mode
        // escape the word
        STACK = [word];
        STATE = "";
    } else if (STATE === "say") {
        // we're in speak mode
        speak(word);
        STATE = "";
    } else if (STATE === "listen") {
        // we're in speak mode
        STACK = listen();
        STATE = "";
    } else if (STATE === "as") {
        // assignment mode
        VARS[word] = STACK;
        STATE = "";
    } else if (STATE === "expect") {
        // expect mode, based on stack
        // next word is what to expect
        let ex = listen();
        // word after is what to run if true
        let if_ex = listen();
        // word after is what to run if false
        let if_not_ex = listen();
        // run the correct program
        (ex === STACK) ? VARS[if_ex].forEach(resolve_word): VARS[if_not_ex].forEach(resolve_word);
        STATE = "";
    } else if (STATE === "append") {
        // we're in append mode
        STACK = Array.of(STACK).concat(word);
    } else if (word === "escape") {
        // non-escaped "escape"
        STATE = "escape"
    } else if (STATE === "run") {
        // run a block/var
        VARS[word].forEach(resolve_word);
        // return value is now on stack
        STATE = "";
    } else if (word === "end") {
        // confirm then exit program
        CONTINUE = false;
    } else if (word === "block") {
        // enter block mode
        STATE = "block";
    } else if (word === "as") {
        // assignment mode
        STATE = "as";
    } else if (word === "say") {
        // speak mode
        STATE = "say";
    } else if (word === "listen") {
        // listen mode
        STATE = "listen";
    } else if (word === "run") {
        // run mode
        STATE = "run";
    } else if (word === "append") {
        // append mode
        STATE = "append";
    } else if (word === "expect") {
        STATE = "expect";
    } else {
        // it's a literal, put it on stack
        STACK = word;
    }
}

function start_script() {
    var word = get_next_word().toLowerCase();
    if (word === "load" || word === "run") {
        STATE = "load";
        start_script();
    } else if (word === "new" || word === "write") {
        // may want to say something to adknowlege mode shift
        STATE = "";
        return "";
    } else if (state = "load") {
        return PROGRAMS[word];
    }
}

function finalization_script() {
    // what to do with stack?
    if (word === "send") {
        STATE = "send";
        finalization_script();
    }
    if (word === "save") {
        STATE = "save";
        finalization_script();
    }
    if (word === "as") {
        // do nothing
        finalization_script();
    }
    if (STATE === "save") {
        PROGRAMS[word] = STACK;
    }
    if (STATE === "send") {
        send(STACK, word)
    }
}

// run the program
function run() {
    var program = start_script();
    if (!program) {
        // listen for words
        while (CONTINUE) {
            var word = listen();
            if (isword(word)) {
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
