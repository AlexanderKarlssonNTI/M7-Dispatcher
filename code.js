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
    
    remove(process) {}
    
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

// const clock = setInterval(scheduler,100);
const Input = document.getElementById("input");
const ProcessButton = document.getElementById("processBtn");
let CPU1 = new FIFO();
let CPU2 = new SHARE();
let CPU3 = new PRIO();

ProcessButton.addEventListener("click", dispatcher);

function dispatcher() {
    if (Input) {
        let batch = Input.value.split(/\r?\n/);
        for (process in batch) {
            // console.log(batch);
            // console.log(process);
            if (batch[process] != "") {
                batch[process] = batch[process].split(" ");
            }
        }
        let godIsDead = true;
        let x = 0;
        while (batch.includes("")) {
            console.log(batch);
            for (process in batch) {
                if (batch[process] === "") {
                    batch = batch.splice(process,1);
                }
            }
            if (x === 10) {
                console.log("Aborting!");
                break;
            }
            x++;
        }
        console.log(batch);
    }
}

function scheduler() {
    if (CPU1.queue) {
        CPU1.work();
    }
    if (CPU2.queue) {
        CPU2.work();
    }
    if (CPU3.queue) {
        CPU3.work();
    }
}

