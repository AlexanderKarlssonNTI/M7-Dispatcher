class Process {
    constructor(name,execTime,priority) {
        this.name = name;
        this.execTime = execTime;
        this.priority = priority;
        this.remainingTime = this.execTime;
    }
}

class CPU1 {
    constructor() {
        this.queueLength = 0;
        this.queue = null
    }
    
    add(process) {}
    
    remove(process) {}
    
    work(ms) {}
}

class CPU2 {
    constructor() {
        this.queueLength = 0;
        this.queue = null
    }
    
    add(process) {}
    
    remove(process) {}
    
    work(ms) {}
}

class CPU3 {
    constructor() {
        this.queueLength = 0;
        this.queue = null
    }
    
    add(process) {}
    
    remove(process) {}
    
    work(ms) {}
}




