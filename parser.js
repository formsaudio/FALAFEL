// ryan birmingham rbirm.us, forms.audio
// globals
var STACK = [];
var STATE = [];
var BLOCK = [];
var VARS = {};
var CONTINUE = true;
var PROGRAMS = {};
var EXPECT = []; // track expect block
var MODE;

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


function send(item, dest) {
    console.log("[TEST] would send " + item + " to " + " dest.");
}

// TODO figure out what's needed for self encapsulation

// modes are the overarching of the word spoken, they take one word at a time

// main mode has the primary functions of FALAFEL
function main_mode(word) {
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
        // escape the word directly to stack, overwriting
        STACK = word;
        STATE = "";
    } else if (STATE === "append-escape") {
        // add the escaped word to the stack
        STACK = Array.of(STACK).concat(word);
        STATE = "";
    } else if (STATE === "say") {
        // we're in speak mode
        speak(word);
        STATE = "";
    } else if (STATE === "listen") {
        // we're in speak mode
        STACK = word;
        STATE = "";
    } else if (STATE === "as") {
        // assignment mode
        VARS[word] = STACK;
        STATE = "";
    } else if (STATE === "expect") {
        // expect mode, based on stack
        // next word is what to expect
        // we don't want to EVER re run old expect
        EXPECT = [];
        EXPECT[0] = word;
        STATE = "expect2";
        say("then");
    } else if (STATE === "expect2") {
        // next word is what var to run if so
        EXPECT[1] = word;
        STATE = "expect3";
        say("else");
    } else if (STATE === "expect3") {
        // next word is what var to run if not
        EXPECT[2] = word;
        STATE = "";
        // run it
        (EXPECT[0] === STACK) ? VARS[EXPECT[1]].forEach(main_mode): VARS[EXPECT[2]].forEach(main_mode);
        // TODO do we want to reclear STATE when done?
        // STATE = "";
    } else if (STATE === "append") {
        // we're in append mode
        // are we appending an escape?
        if (word === "escape") {
            STATE = "append-escape";
        }
        STACK = Array.of(STACK).concat(word);
    } else if (word === "escape") {
        // non-escaped, non appended "escape"
        STATE = "escape"
    } else if (STATE === "run") {
        // run a block/var
        VARS[word].forEach(main_mode);
        // return value is now on stack
        STATE = "";
    } else if (word === "end") {
        // confirm then exit program
        MODE = finalization_mode;
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

// startup_mode loads/runs existing programs or starts main mode
function startup_mode(word) {
    if (word === "load" || word === "run") {
        STATE = "load";
    } else if (word === "new" || word === "write") {
        // may want to say something to adknowlege mode shift
        STATE = "";
        MODE = main_mode;
    } else if (state = "load") {
        PROGRAMS[word].forEach(main_mode);
        CONTINUE = FALSE;
    }
}

// finalization mode deals with the last interaction, restarts, or stops
function finalization_mode(word) {
    // what to do with stack?
    if (word === "send") {
        STATE = "send";
    } else if (word === "save") {
        STATE = "save";
    } else if (STATE === "save") {
        PROGRAMS[word] = STACK;
    } else if (STATE === "send") {
        send(STACK, word);
    } else if (word === "restart") {
        MODE = startup_mode;
    } else if (word === "stop") {
        CONTINUE = false;
    }
}

// TODO add confirm method
function on_word_get(word) {
    recognition.stop();
    // ADD confirm or something
    // resolve using the currend MODE
    MODE(word);
    speak("listening");
    if (CONTINUE) {
        recognition.start();
    }
}


// run the program
function run() {
    MODE = startup_mode;
    // listen for words
    recognition.start();
    speak("listening");
    recognition.onresult = (e) => on_word_get(e.results[0][0].transcript);
}
