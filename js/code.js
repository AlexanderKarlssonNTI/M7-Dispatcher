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
        }
        else {
            this.queue.push(newProcess);
            this.queueLength++;
        }
    }
    
    remove() {
        if (this.queueLength == 1) {
            this.queue = null;
            this.queueLength = 0;
        }
        else {
            this.queue.shift();
            this.queueLength--;
        }
    }
    
    work(ms) {
        this.queue[0].execTime -= ms;
        if (this.queue[0].execTime <= 0) {
            if (this.queueLength > 1) {
                let temp = this.queue[0].execTime;
                this.remove();
                this.queue[0].execTime -= temp;
            }
            else {
                this.remove()
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
        else {
            while (nextProcess.preceding) {
                nextProcess = nextProcess.preceding;
            }
            nextProcess.preceding = newProcess;
        }
    }
    
    remove(process) {
        let nextProcess = this.queue;
        while (nextProcess.preceding) {
            if (nextProcess == process) {
                break;
            }
            nextProcess = nextProcess.preceding;
        }
    }
    
    work(ms) {
        let times = Math.floor(100/this.queueLength);
        if (this.queueLength >= 100) {
            times = 1;
        }
        if (this.queue[0].execTime <= 0) {
            this.remove();
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
}

let processInterval = 100;
let Stop = false;
const clock = setInterval(scheduler,processInterval);

// All buttons
const ProcessButton = document.getElementById("processBtn");
const ClearButton = document.getElementById("clearBtn");
const LoadButton = document.getElementById("loadBtn");
const ChangeButton = document.getElementById("changeBtn");
const StartStopButton = document.getElementById("startStopBtn");

// All inputs
const Input = document.getElementById("input");
const FileInput = document.getElementById("fileInput");
const IntervalInput = document.getElementById("intervalInput");

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
StartStopButton.addEventListener("click", function(){
    Stop = !Stop;
    if (Stop == true) {
        StartStopButton.innerHTML = "Start";
        StartStopButton.style.backgroundColor = "rgb(239, 239, 239)";
        console.log("stoped");
    }
    else if (Stop == false) {
        StartStopButton.innerHTML = "Stop";
        StartStopButton.style.backgroundColor = "red";
        console.log("started");
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

    DrawAllTasks(currentBatch);
}

function scheduler() {
    if (Stop === false) {
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

function DrawAllTasks(tasks)
{
    let el = document.querySelector('#foo');

    tasks.forEach(task => {
        const tr = document.createElement('tr');
        
        for (let i = 0; i < 3; i++)
        {
            const td = document.createElement('td');

            td.textContent = task[i];

            tr.appendChild(td);
        }

        el.appendChild(tr);
    });
}