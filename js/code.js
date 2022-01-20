class Process {
    constructor(id ,name, execTime, priority) {
        this.id = id;
        this.name = name;
        this.execTime = execTime;
        this.priority = priority;
        this.remainingTime = this.execTime;
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

        let cpuElement = document.getElementById('cpu1').children;

        cpuElement[0].remove();
    }

    work(ms) {
        this.queue[0].execTime -= ms;
        if (this.queue[0].execTime <= 0) {
            if (this.queueLength > 1) {
                let temp = this.queue[0].execTime;
                this.remove();
                if (this.queue) {
                    this.queue[0].execTime -= temp;
                }
            }
            else {
                this.remove();
            }
        }
    }

    updateStatus() {
        let cpuStatus = document.getElementById("cpuStatus");
        if (!this.queue) {
            cpuStatus.innerHTML = "Idle";
        }
        else if (this.queue && Stop === false) {
            cpuStatus.innerHTML = "Running";
        }
        else if (this.queue && Stop === true) {
            cpuStatus.innerHTML = "Paused";
        }
        else {
            cpuStatus.innerHTML = "ERROR!";
        }
    }
}

class SHARE {
    constructor() {
        this.queueLength = 0;
        this.queue = null;
    }

    add(process) {
        let newProcess = new Process(globalID,process[0], process[1], process[2]);

        globalID++;

        let nextProcess = this.queue;
        console.log(nextProcess);
        if (!nextProcess) {
            this.queue = newProcess;
            this.queueLength++;
        }
        else {
            while (nextProcess.preceding) {
                nextProcess = nextProcess.preceding;
            }
            console.log(nextProcess);
            nextProcess.preceding = newProcess;
            console.log(nextProcess.preceding);
            this.queueLength++;
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
                this.queueLength--;
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
            currentProcess.execTime -= times;
            while (currentProcess && currentProcess.execTime <= 0) {
                overflow = -currentProcess.execTime;
                let temp = currentProcess.preceding;
                this.remove(currentProcess);
                currentProcess = temp;
                currentProcess.execTime -= overflow;
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
const clock = setInterval(function(){scheduler();cpuStatus();}, processInterval);
const startStop = document.getElementById("startStop");

const CPUTypes = ['FIFO', 'SHARE'];

let CPUs = [];

CPUTypes.forEach(type => {
    let CPU = eval('new ' + type + '()');

    CPUs.push(CPU);
});

function scheduler() {
  if (Stop === false) {
    CPUs.forEach(CPU => {
        if(CPU.queue)
        {
            CPU.work(processInterval);
        }
    });        
  }
}

function textParser() {
    const Input = document.getElementById('input');

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

function LoadFile()
{
    const el = document.getElementById('file');

    el.click();

    el.onchange = function ()
    {
        let file = el.files[0];

        let reader = new FileReader();

        reader.readAsText(file);

        reader.onload = function () {
            UpdateCommandInput(reader.result);
        }

        el.value = null;
    }
}

function StartStopButton()
{
    Stop = !Stop;

    if (Stop == true)
    {
        startStop.innerHTML = 'Start';

        startStop.style.backgroundColor = 'black';

        console.log('[DEBUG from ' + arguments.callee.name + '] Stopped');
    }
    else if (Stop == false)
    {
        startStop.innerHTML = 'Stop';

        startStop.style.backgroundColor = 'red';

        console.log('[DEBUG from ' + arguments.callee.name + '] Started');
    }
}

function Dispatcher()
{
    let currentBatch = textParser();
    
    for (process in currentBatch)
    {
        CPUs.forEach(CPU => {
            CPU.add(currentBatch[process]);
        });
    }

    UpdateCommandInput(false);

    DrawAllTasks(currentBatch);
}

function DrawAllTasks(tasks)
{
    CPUs.forEach((CPU, i) => {
        console.log(CPU);

        let el = document.querySelector('#cpu' + (i + 1).toString());

        tasks.forEach((task, index) => {

            const tr = document.createElement('tr');

            tr.id = CPU.queue[index].id;

            for (let i = 0; i < 3; i++)
            {
                const td = document.createElement('td');

                td.textContent = task[i];

                tr.appendChild(td);
            }

            el.appendChild(tr);
        });
    })
}

function AbortTasks(CPUs)
{
    CPUs.forEach(CPU => {
        let el = document.querySelector('#' + CPU);

        while (el.lastElementChild)
        {
            el.removeChild(el.lastElementChild);
        }

        // Reset the queue & it's length
        CPU.queue = null;

        CPU.queueLength = 0;
    })
}

function ChangeTime()
{
    const el = document.getElementById('interval');

    processInterval = el.value;
}

function UpdateCommandInput(string)
{
    const el = document.getElementById('input');

    el.value = string ? string : '';
}

function FormatCPUTitle(string)
{
  return (string.slice(0, -1) + ' ' + string.slice(-1)).toUpperCase();
}

function FormatCPUStatusID(string)
{
  return (string.slice(0, -1) + 'Status' + string.slice(-1));
}

function cpuStatus() {
    for (cpu in CPUs) {
        let cpuId = "cpuStatus"+(parseInt(cpu)+1);
        let cpuStatus = document.getElementById(cpuId);
        if (!CPUs[cpu].queue) {
            cpuStatus.innerHTML = "Idle";
        }
        else if (CPUs[cpu].queue && Stop === false) {
            cpuStatus.innerHTML = "Running";
        }
        else if (CPUs[cpu].queue && Stop === true) {
            cpuStatus.innerHTML = "Paused";
        }
        else {
            cpuStatus.innerHTML = "ERROR!";
        }
    }
}

function changeFont() {
    let root = document.querySelector(":root");
    let temp = document.querySelector("*")
    if (document.getElementById("fontCheck").checked) {
        temp.style.fontFamily = "var(--easyReadFont)";
        root.style.setProperty("--font-size","12px");
    }
    else {
        temp.style.fontFamily = "var(--defaultFont)";
        root.style.setProperty("--font-size","16px");
    }
}
