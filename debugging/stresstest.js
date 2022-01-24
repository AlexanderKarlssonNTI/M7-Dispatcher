class File {
    constructor(name) {
        this.name = name;
        this.fileGod();
    }

    fileGod() {
        let file = new Blob([this.Creator(5,10)], {type:"text/plain;charset=utf-8"});
        let Name = this.name+".txt";
        saveAs(file,Name);
    }
    
    Creator(min, max) {
        let intervals = Math.floor(Math.random() * (max - min + 1) + min);
        const names = ["Eat","Sleep","Work","Lunch","wakeUp","gossip","robBanks","doTaxes","commitTaxtFraud","invest"];
        let content = "";
        for (let x = 0; x < intervals; x++) {
            let temp = names[Math.floor(Math.random()*names.length)]+" ";
            temp += Math.floor(Math.random() * 20 + 1)*100+" ";
            temp += (Math.floor(Math.random() * 5)+1)+"\n";
            content += temp;
        }
        return content;
    }
    
}

let batch = new File("test");
