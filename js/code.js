/*
 *  Classes
*/

class Process
{
    constructor(id ,name, execTime, priority)
    {
        this.id = id;
        this.name = name;
        this.execTime = execTime;
        this.priority = priority;
        this.remainingTime = this.execTime;
        this.upcoming = null;
    }
}

class FIFO
{
  constructor()
  {
    this.queueLength = 0;
    this.queue = null;
  }

    add(process)
    {
        let newProcess = new Process(GlobalTaskID++, process[0], process[1], process[2]);
        
        if (!this.queue) {
            this.queue = [newProcess];
            this.queueLength = 1;
        }
        else {
            this.queue.push(newProcess);
            this.queueLength++;
        }
    }

    remove()
    {
        if (this.queueLength == 1) {
            this.queue = null;
            this.queueLength = 0;
        }  
        else {
            this.queue.shift();
            this.queueLength--;
        }

        CPUs.forEach((CPU, index) => {
            if(CPUTypes[index] === 'FIFO')
            {
                let el = document.getElementById('cpu' + (index + 1)).children;

                el[0].remove();
            }
        })
    }

    work(ms)
    {
        if ((this.queue[0].execTime - ms) > 0) {
            this.queue[0].execTime -= ms;

            let el = document.getElementById(this.queue[0].id).children;

            el[1].textContent = this.queue[0].execTime;
        }
        else if ((this.queue[0].execTime - ms) <= 0)
        {
            if (this.queueLength > 1)
            {
                let temp = ms - this.queue[0].execTime;
                this.remove();

                // If overflow
                while (this.queue)
                {
                    if ((this.queue[0].execTime - temp) <= 0) {
                        temp -= this.queue[0].execTime;
                        this.remove();
                        let el = document.getElementById(this.queue[0].id).children;

                        el[1].textContent = this.queue[0].execTime;
                    }
                    else {
                        this.queue[0].execTime -= temp;
                        let el = document.getElementById(this.queue[0].id).children;

                        el[1].textContent = this.queue[0].execTime;
                        break;
                    }
                }
            }
            else
            {
                this.remove();
            }
        }
    }
}

class SHARE
{
    constructor()
    {
        this.queueLength = 0;
        this.queue = null;
    }

    add(process)
    {
        let newProcess = new Process(GlobalTaskID++,process[0], process[1], process[2]);

        let nextProcess = this.queue;
        if (!nextProcess) {
            this.queue = newProcess;
            this.queueLength++;
        }
        else {
            while (nextProcess.preceding) {
                nextProcess = nextProcess.preceding;
            }
            nextProcess.preceding = newProcess;
            this.queueLength++;
        }
    }

    remove(process)
    {
        let nextProcess = this.queue;
        if (nextProcess == process) {
            this.queue = nextProcess.preceding;
        }
        else {
            while (nextProcess.preceding) {
                if (nextProcess.preceding == process) {
                    let temp = nextProcess.preceding;
                    nextProcess.preceding = temp;

                    CPUs.forEach((CPU, index) => {
                        if(CPUTypes[index] === 'SHARE')
                        {
                            if(process.id)
                            {
                                let el = document.getElementById(process.id);
            
                                el.remove();

                                process.id = false;
                            }
                        }
                    });

                    break;
                }

                nextProcess = nextProcess.preceding;
                this.queueLength--;
            }
        }
    }

    work(ms)
    {
        let times = Math.floor(ms / this.queueLength);
        let currentProcess = this.queue;
        // let overflow = 0;
        let iteration = 1;
        if (this.queueLength >= ProcessInterval) {
            times = 1;
        }

        while (currentProcess && iteration < ProcessInterval)
        {  
            if ((currentProcess.execTime - times) <= 0) {
                // overflow = -currentProcess.execTime;
                let temp = currentProcess.preceding;
                this.remove(currentProcess);
                currentProcess = temp;
                // currentProcess.execTime -= overflow;
                
                // if(currentProcess.id)
                // {
                    //     let el = document.getElementById(currentProcess.id).children;
                    
                    //     el[1].textContent = currentProcess.execTime;
                    // }
                    
            }
            else
            {
                currentProcess.execTime -= times;
            }

            if (iteration > ProcessInterval)
            {
                break;
            }
            let el = document.getElementById(currentProcess.id).children;
                
            el[1].textContent = currentProcess.execTime;

            currentProcess = currentProcess.preceding;

            iteration++;
        }
    }
}

class PRIO
{
    constructor()
    {
        this.queueLength = 0;
        this.queue = null;
    }

    add(process)
    {
        let newProcess = new Process(GlobalTaskID++,process[0], process[1], process[2]);
    }

    remove(process)
    {

    }

    work(ms)
    {
        
    }
}

/*
 *  Core
*/

let ProcessInterval = 100;

let GlobalTaskID = 0;

let Stop = false;

const Clock = setInterval(function() {
    Scheduler();
    UpdateCPUStatus();
}, 500);

const CPUTypes = ['FIFO', 'SHARE'];

let CPUs = [];

CPUTypes.forEach(type => {
    let CPU = eval('new ' + type + '()');

    CPUs.push(CPU);
});

/*
 *  Functions
*/

function Scheduler()
{
  if (!Stop)
  {
    CPUs.forEach(CPU => {
        if(CPU.queue)
        {
            CPU.work(ProcessInterval);
        }
    });
  }
}

function Parser()
{
    const el = document.getElementById('input');

    if (el.value)
    {
        let batch = el.value.split(/\r?\n/);
        // Spliting each line with text in it

        for (process in batch)
        {
            if (batch[process] != '')
            {
                batch[process] = batch[process].split(' ');
            }
        }

        while (batch.includes(''))
        {
            for (process in batch)
            {
                if (batch[process] === '')
                {
                    batch.splice(process, 1);
                }
            }
        }

        while (1 + 1 == 2)
        {
            let working = false;

            for (process in batch)
            {
                while (batch[process].includes(''))
                {
                    batch[process].splice(batch[process].indexOf(''), 1);
                }

                if (batch[process].length == 1 || batch[process].length > 3)
                {
                    batch.splice(process, 1);
                    working = true;
                } 
                else
                {
                    if (batch[process].length == 2)
                    {
                        batch[process].push(1);
                    }

                    if (batch[process].length == 3)
                    {
                        if (Number.isNaN(batch[process][1]) || Number.isNaN(batch[process][2]))
                        {
                            batch.splice(process, 1);
                            working = true;
                        } 
                        else
                        {
                            batch[process][1] = parseInt(batch[process][1]);

                            batch[process][2] = parseInt(batch[process][2]);

                            if (batch[process][2] > 5)
                            {
                                batch[process][2] = 5;
                            }
                            else if (batch[process][2] < 1)
                            {
                                batch[process][2] = 1;
                            }
                        }
                    }
                }
            }
            if (!working)
            {
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

    const el = document.getElementById('startStop');

    if (Stop)
    {
        el.innerHTML = 'Start';

        el.style.backgroundColor = 'black';

        console.log(arguments.callee.name, 'Stopped');
    }
    else
    {
        el.innerHTML = 'Stop';
        
        el.style.backgroundColor = 'red';
        
        console.log(arguments.callee.name, 'Started');
    }
}

function Dispatcher()
{
    let batch = Parser();
    
    for (process in batch)
    {
        CPUs.forEach(CPU => {
            CPU.add(batch[process]);
        });
    }

    UpdateCommandInput(false);

    DrawAllTasks(batch);
}

function DrawAllTasks(tasks)
{
    CPUs.forEach((CPU, i) => {

        let el = document.querySelector('#cpu' + (i + 1).toString());

        if(CPUTypes[i] === 'FIFO')
        {
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
        }
        else if(CPUTypes[i] === 'SHARE' || CPUTypes[i] === 'PRIO')
        {
            let props = ['name', 'execTime', 'priority'];

            let currentTask = CPU.queue;

            while(currentTask)
            {
                // Create SHARE tr's
                const tr = document.createElement('tr');
                                
                tr.id = currentTask.id;
                
                for (let i = 0; i < 3; i++)
                {
                    const td = document.createElement('td');
                    
                    td.textContent = currentTask[props[i]];
                    
                    tr.appendChild(td);
                }
                
                el.appendChild(tr);

                currentTask = currentTask.preceding;
            }
        }
    });
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
    });
}

function ChangeTime()
{
    const el = document.getElementById('intervalInput');
    
    ProcessInterval = el.value;
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

function UpdateCPUStatus()
{
    for (CPU in CPUs)
    {
        let id = 'cpuStatus' + (parseInt(CPU) + 1);

        let status = document.getElementById(id);

        if (!CPUs[CPU].queue)
        {
            status.innerHTML = 'Idle';
        }
        else if (CPUs[CPU].queue && !Stop)
        {
            status.innerHTML = 'Running';
        }
        else if (CPUs[CPU].queue && Stop)
        {
            status.innerHTML = 'Paused';
        }
        else
        {
            status.innerHTML = 'Error';
        }
    }
}

function ChangeFont()
{
    let root = document.querySelector(':root');

    if (document.getElementById('fontCheck').checked)
    {
        root.style.setProperty('--currentFont', 'var(--easyReadFont)');
        root.style.setProperty('--font-size', '12px');
    }
    else
    {
        root.style.setProperty('--currentFont', 'var(--defaultFont)');
        root.style.setProperty('--font-size', '16px');
    }
}