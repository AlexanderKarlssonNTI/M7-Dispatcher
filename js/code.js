class Process {
    constructor(id ,name, execTime, priority) {
        this.ID = id;
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
        let newProcess = new Process(globalID++,process[0], process[1], process[2]);
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
                this.remove();
            }
        }
    }
}

class SHARE {
    constructor() {
        this.queueLength = 0;
        this.queue = null;
    }

    add(process) {
        let newProcess = new Process(globalID++,process[0], process[1], process[2]);
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
        if (nextProcess == process) {
            this.queue = nextProcess.preceding;
        }
        else {
            while (nextProcess.preceding) {
                if (nextProcess.preceding == process) {
                    let temp = nextProcess.preceding;
                    nextProcess.preceding = temp;
                    break;
                }
                nextProcess = nextProcess.preceding;
            }
        }
    }

    work(ms) {
        let times = Math.floor(100 / this.queueLength);
        let currentProcess = this.queue;
        let overflow = 0;
        let iteration = 1;
        if (this.queueLength >= 100) {
            times = 1;
        }
        while (currentProcess && iteration < 100) {
            currentProcess.execTime -= (times + overflow);
            if (currentProcess.execTime <= 0) {
                overflow = -currentProcess.execTime;
                this.remove(currentProcess);
            }
            if (iteration > 100) {
                break;
            }
            currentProcess = currentProcess.preceding;
            iteration++;
        }
    }
}

class PRIO {
    constructor() {
        this.queueLength = 0;
        this.queue = null;
    }

    add(process) {
        let newProcess = new Process(globalID++,process[0], process[1], process[2]);
    }

    remove(process) { }

    work(ms) { }
}

let processInterval = 100;
let globalID = 0;
let Stop = false;
const clock = setInterval(scheduler, processInterval);

// All buttons
const ProcessButton = document.getElementById("processBtn");
const ClearButton = document.getElementById("clearBtn");
const LoadButton = document.getElementById("loadBtn");
const ChangeButton = document.getElementById("changeBtn");
const StartStopButton = document.getElementById("startStopBtn");
const clearTasksButton = document.getElementById("clearTasks");

// All inputs
const Input = document.getElementById("input");
const FileInput = document.getElementById("fileInput");
const IntervalInput = document.getElementById("intervalInput");

let CPU1 = new FIFO();
let CPU2 = new SHARE();
let CPU3 = new PRIO();

ProcessButton.addEventListener("click", dispatcher);
ClearButton.addEventListener("click", function () {
    Input.value = "";
});

clearTasksButton.addEventListener("click", function () {
  ClearTasks(CPU1);
});

LoadButton.addEventListener("click", function () {
    FileInput.click();
    FileInput.onchange = function () {
        let file = FileInput.files[0];
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function () {
            Input.value = reader.result;
        };
        FileInput.value = null;
    };
});
StartStopButton.addEventListener("click", function () {
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
ChangeButton.addEventListener("click",function(){
    processInterval = IntervalInput.value;
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
                    batch.splice(process, 1);
                }
            }
        }
        while (1 + 1 == 2) {
            let working = false;
            for (process in batch) {
                while (batch[process].includes("")) {
                    batch[process].splice(batch[process].indexOf(""), 1);
                }
                if (batch[process].length == 1 || batch[process].length > 3) {
                    batch.splice(process, 1);
                    working = true;
                } 
                else {
                    if (batch[process].length == 2) {
                        batch[process].push(1);
                    }
                    if (batch[process].length == 3) {
                        if (Number.isNaN(batch[process][1]) || Number.isNaN(batch[process][2])) {
                            batch.splice(process, 1);
                            working = true;
                        } 
                        else {
                            batch[process][1] = parseInt(batch[process][1]);
                            batch[process][2] = parseInt(batch[process][2]);
                            if (batch[process][2] > 5) {
                                batch[process][2] = 5;
                            } else if (batch[process][2] < 1) {
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

function DrawAllTasks(tasks) {
    let el = document.querySelector("#cpu1");

    tasks.forEach((task) => {
        const tr = document.createElement("tr");

        for (let i = 0; i < 3; i++) {
            const td = document.createElement("td");

            td.textContent = task[i];

            tr.appendChild(td);
        }

        tr.style.backgroundColor = "yellow";

        el.appendChild(tr);
    });
}

function ClearTasks(cpu) {
    let el = document.querySelector("#foo");

    while (el.lastElementChild) {
        el.removeChild(el.lastElementChild);
    }

  console.log("This is the current queue:", cpu.queue);

  // Reset the queue & it's length
  cpu.queueLength = 0;
  cpu.queue = null;

  console.log("The queue is now empty:", cpu.queue);
}

function FormatCPUTitle(string)
{
  return (string.slice(0, -1) + ' ' + string.slice(-1)).toUpperCase();
}