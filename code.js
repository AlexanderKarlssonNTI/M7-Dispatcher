class Process {
    constructor(name,execTime,priority) {
        this.name = name;
        this.execTime = execTime;
        this.priority = priority;
        this.remainingTime = this.execTime;
        this.preceding = null;
        this.upcoming = null;
    }
}

class FIFO {
    constructor() {
        this.queueLength = 0;
        this.queue = null;
    }
    
    add(process) {}
    
    remove() {}
    
    work(ms) {}
}

class SHARE {
    constructor() {
        this.queueLength = 0;
        this.queue = null
    }
    
    add(process) {}
    
    remove(process) {}
    
    work(ms) {}
}

class PRIO {
    constructor() {
        this.queueLength = 0;
        this.queue = null
    }
    
    add(process) {}
    
    remove(process) {}
    
    work(ms) {}
}

const processInterval = 100;
// const clock = setInterval(scheduler,processInterval);
const Input = document.getElementById("input");
const FileInput = document.getElementById("fileInput");
const ProcessButton = document.getElementById("processBtn");
const ClearButton = document.getElementById("clearBtn");
const LoadButton = document.getElementById("loadBtn");
let CPU1 = new FIFO();
let CPU2 = new SHARE();
let CPU3 = new PRIO();

ProcessButton.addEventListener("click", dispatcher);
ClearButton.addEventListener("click", function() {
    Input.value = "";
});
LoadButton.addEventListener("click", function() {
    FileInput.click();
    FileInput.onchange = function() {
        let file = FileInput.files[0];
        let reader = new FileReader;
        reader.readAsText(file);
        reader.onload = function() {
            Input.value = reader.result;
        }
    }
});

function dispatcher() {
    let currentBatch = textParser();
}

function scheduler() {
    if (CPU1.queue) {
        CPU1.work(processInterval);
    }
    if (CPU2.queue) {
        CPU2.work(processInterval);
    }
    if (CPU3.queue) {
        CPU3.work(processInterval);
    }
}

function textParser() {
    if (Input.value) {
        let batch = Input.value.split(/\r?\n/);
        // Spliting each line with text in it
        for (process in batch) {
            if (batch[process] != "") {
                batch[process] = batch[process].split(" ");
            }
        }
        // Removes empty elements in batch
        while (batch.includes("")) {
            for (process in batch) {
                if (batch[process] === "") {
                    batch.splice(process,1);
                }
            }
        }
        while (1+1 == 2) {
            let working = false;
            for (process in batch) {
                if (batch[process].length == 1 || batch[process].length > 3) {
                    batch.splice(process,1);
                    working = true;
                }
                else {
                    if (batch[process].length == 2) {
                        batch[process].push(1);
                    }
                    if (batch[process].length == 3) {
                        if (Number.isNaN(batch[process][1]) || Number.isNaN(batch[process][2])) {
                            batch.splice(process,1);
                            working = true;
                        }
                        else {
                            batch[process][1] = parseInt(batch[process][1]);
                            batch[process][2] = parseInt(batch[process][2]);
                            if (batch[process][2] > 5) {
                                batch[process][2] = 5;
                            }
                            else if (batch[process][2] < 1) {
                                batch[process][2] = 1;
                            }
                        }
                    }
                }
            }
            if (working === false) {
                break;
            }
        }
        console.log(batch);
        return batch;
    }
}
