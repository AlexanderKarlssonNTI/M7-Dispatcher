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
            this.queue = null;
            this.queueLength = 0;
            this.updateDisplay();
        }
        else {
            this.queue.shift();
            this.queueLength--;
            this.updateDisplay();
        }
    }
    
    work(ms) {
        this.queue[0].execTime -= ms;
        if (this.queue[0].execTime <= 0) {
            let temp = this.queue[0].execTime;
            this.remove();
            this.queue[0].execTime -= temp;
        }
        this.updateDisplay();
    }

    updateDisplay() {
        for (let x = 0; x < 5; x++) {
            let disName = "cpu1Name"+(x+1);
            let disTime = "cpu1Time"+(x+1);
            let disPrio = "cpu1Prio"+(x+1);
            if (x > (this.queueLength-1)) {
                document.getElementById(disName).innerHTML = "";
                document.getElementById(disTime).innerHTML = "";
                document.getElementById(disPrio).innerHTML = "";
            }
            else {
                document.getElementById(disName).innerHTML = this.queue[x].name;
                document.getElementById(disTime).innerHTML = this.queue[x].execTime;
                document.getElementById(disPrio).innerHTML = this.queue[x].priority;
            }
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
        let nextProcess = this.queue;
        if (!this.queue) {
            this.queue = newProcess;
        }
        
        while (nextProcess.preceding) {
            nextProcess = nextProcess.preceding;
        }
        nextProcess.preceding = newProcess;
        this.updateDisplay();
    }
    
    remove(process) {}
    
    work(ms) {
        let times = math.floor(100/this.queueLength);
        if (this.queueLength >= 100) {
            times = 1;
        }
        if (this.queue[0].execTime <= 0) {
            this.remove();
        }
        this.updateDisplay();
    }

    updateDisplay() {
        for (let x = 0; x < this.queueLength; x++) {
            if (x == 5) {
                break;
            }
            let disName = "cpu2Name"+(x+1);
            let disTime = "cpu2Time"+(x+1);
            let disPrio = "cpu2Prio"+(x+1);
            let item = this.queue;
            for (let y = 0; y < x; y++) {
                while (item.preceding) {
                    item = item.preceding;
                }
            }
            document.getElementById(disName).innerHTML = item.name;
            document.getElementById(disTime).innerHTML = item.execTime;
            document.getElementById(disPrio).innerHTML = item.priority;
        }
    }
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

    // updateDisplay() {
    //     for (let x = 0; x < this.queueLength; x++) {
    //         if (x == 5) {
    //             break;
    //         }
    //         let disName = "cpu3Name"+(x+1);
    //         let disTime = "cpu3Time"+(x+1);
    //         let disPrio = "cpu3Prio"+(x+1);
    //         document.getElementById(disName).innerHTML = this.queue[x].name;
    //         document.getElementById(disTime).innerHTML = this.queue[x].execTime;
    //         document.getElementById(disPrio).innerHTML = this.queue[x].priority;
    //     }
    // }
}

let processInterval = 100;
const clock = setInterval(scheduler,processInterval);
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
        FileInput.value = null;
    }
});

function dispatcher() {
    let currentBatch = textParser();
    console.log(currentBatch);
    for (process in currentBatch) {
        CPU1.add(currentBatch[process]);
        // CPU2.add(currentBatch[process]);
        CPU3.add(currentBatch[process]);
    }
    Input.value = "";
}

function scheduler() {
    if (CPU1.queue) {
        CPU1.work(processInterval);
    }
    // if (CPU2.queue) {
    //     CPU2.work(processInterval);
    // }
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
