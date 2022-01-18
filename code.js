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
    
    add(process) {
        let newProcess = new Process(process[0],process[1],process[2]);
        if (!this.queue) {
            this.queue = [newProcess];
            this.queueLength = 1;
            this.updateDisplay();
        }
        else {
            this.queue.push(newProcess);
            this.queueLength++;
            this.updateDisplay();
        }
    }
    
    remove() {
        if (this.queueLength == 1) {
        }
        else if (this.queueLength > 1) {
        }
    }
    
    work(ms) {}

    updateDisplay() {
        for (let x = 0; x < this.queueLength; x++) {
            if (x == 5) {
                break;
            }
            let disName = "cpu1name"+(x+1);
            let disTime = "cpu1time"+(x+1);
            let disPrio = "cpu1prio"+(x+1);
            document.getElementById(disName).innerHTML(this.queue[x][0]);
            document.getElementById(disTime).innerHTML(this.queue[x][1]);
            document.getElementById(disPrio).innerHTML(this.queue[x][2]);
        }
    }
}

class SHARE {
    constructor() {
        this.queueLength = 0;
        this.queue = null
    }
    
    add(process) {
        let newProcess = new Process(process[0],process[1],process[2]);
    }
    
    remove(process) {}
    
    work(ms) {}

    updateDisplay() {}
}

class PRIO {
    constructor() {
        this.queueLength = 0;
        this.queue = null
    }
    
    add(process) {
        let newProcess = new Process(process[0],process[1],process[2]);
    }
    
    remove(process) {}
    
    work(ms) {}

    updateDisplay() {}
}

let processInterval = 100;
// const clock = setInterval(scheduler,processInterval);
const Input = document.getElementById("input");
const FileInput = document.getElementById("fileInput");
const ProcessButton = document.getElementById("processBtn");
const ClearButton = document.getElementById("clearBtn");
const LoadButton = document.getElementById("loadBtn");

const CPU1name1 = document.getElementById("cpu1Name1");
const CPU1time1 = document.getElementById("cpu1Time1");
const CPU1prio1 = document.getElementById("cpu1Prio1");
const CPU1name2 = document.getElementById("cpu1Name2");
const CPU1time2 = document.getElementById("cpu1Time2");
const CPU1prio2 = document.getElementById("cpu1Prio2");
const CPU1name3 = document.getElementById("cpu1Name3");
const CPU1time3 = document.getElementById("cpu1Time3");
const CPU1prio3 = document.getElementById("cpu1Prio3");
const CPU1name4 = document.getElementById("cpu1Name4");
const CPU1time4 = document.getElementById("cpu1Time4");
const CPU1prio4 = document.getElementById("cpu1Prio4");
const CPU1name5 = document.getElementById("cpu1Name5");
const CPU1time5 = document.getElementById("cpu1Time5");
const CPU1prio5 = document.getElementById("cpu1Prio5");

const CPU2name1 = document.getElementById("cpu2Name1");
const CPU2time1 = document.getElementById("cpu2Time1");
const CPU2prio1 = document.getElementById("cpu2Prio1");
const CPU2name2 = document.getElementById("cpu2Name2");
const CPU2time2 = document.getElementById("cpu2Time2");
const CPU2prio2 = document.getElementById("cpu2Prio2");
const CPU2name3 = document.getElementById("cpu2Name3");
const CPU2time3 = document.getElementById("cpu2Time3");
const CPU2prio3 = document.getElementById("cpu2Prio3");
const CPU2name4 = document.getElementById("cpu2Name4");
const CPU2time4 = document.getElementById("cpu2Time4");
const CPU2prio4 = document.getElementById("cpu2Prio4");
const CPU2name5 = document.getElementById("cpu2Name5");
const CPU2time5 = document.getElementById("cpu2Time5");
const CPU2prio5 = document.getElementById("cpu2Prio5");

const CPU3name1 = document.getElementById("cpu3Name1");
const CPU3time1 = document.getElementById("cpu3Time1");
const CPU3prio1 = document.getElementById("cpu3Prio1");
const CPU3name2 = document.getElementById("cpu3Name2");
const CPU3time2 = document.getElementById("cpu3Time2");
const CPU3prio2 = document.getElementById("cpu3Prio2");
const CPU3name3 = document.getElementById("cpu3Name3");
const CPU3time3 = document.getElementById("cpu3Time3");
const CPU3prio3 = document.getElementById("cpu3Prio3");
const CPU3name4 = document.getElementById("cpu3Name4");
const CPU3time4 = document.getElementById("cpu3Time4");
const CPU3prio4 = document.getElementById("cpu3Prio4");
const CPU3name5 = document.getElementById("cpu3Name5");
const CPU3time5 = document.getElementById("cpu3Time5");
const CPU3prio5 = document.getElementById("cpu3Prio5");

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
        FileInput.value = null;
    }
});

function dispatcher() {
    let currentBatch = textParser();
    console.log(currentBatch);
    for (process in currentBatch) {
        CPU1.add(currentBatch[process]);
        CPU2.add(currentBatch[process]);
        CPU3.add(currentBatch[process]);
    }
    Input.value = "";
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
                while (batch[process].includes("")) {
                    batch[process].splice(batch[process].indexOf(""),1);
                }
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
        return batch;
    }
}
