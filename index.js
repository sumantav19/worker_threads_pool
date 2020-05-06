const {EventEmitter} = require('events')
const {Worker,isMainThread,workerData} = require('worker_threads');

class WorkerPool extends EventEmitter{
  workers = [];
  filename='';
  constructor(filename,size){
    super();
    this.size=size;
    this.filename=filename;
    for(let i = 0; i < this.size; i++){
      this.addNewWorker(filename)
    }
  }
  addNewWorker(filename){
    this.workers.push(new Worker(filename))
  }  
  runTask(task,callback){
    if(this.workers.length == 0){
      this.on('freedworker',()=>{
        console.log("worker freed")
        this.runTask(task,callback);
      })
      return;
    }
    const worker=this.workers.pop()
    worker.postMessage(task);
    worker.on('message',(result)=>{
      this.emit('freedworker')
      callback(undefined,result)
      this.workers.push(worker)
    })
    worker.on('error',(error)=>{
      console.log(">>>>>>>>",error)
      this.addNewWorker(this.filename);
      callback(error,undefined);
    })
    worker.on('exit',(err)=>{
      console.log(exit);
    })
  }
}

async function main(){
  if(isMainThread){
    const workerPool = new WorkerPool('./worker_script.js',2)
    const worker1Data = await new Promise((resolve,reject)=>{
      workerPool.runTask("Wassup Worker1",(err,result)=>{
        if(err){
          reject(err);
          return;
        }
        resolve(result);
      })
    })
    const worker2Data = await new Promise((resolve,reject)=>{
      workerPool.runTask("Wassup Worker2",(err,result)=>{
        resolve(result);
      })
    })
    const worker3Data = await new Promise((resolve,reject)=>{
      workerPool.runTask("Wassup Worker3",(err,result)=>{
        resolve(result);
      })
    })
    const worker4Data = await new Promise((resolve,reject)=>{
      workerPool.runTask("Wassup Worker4",(err,result)=>{
        resolve(result);
      })
    })
    console.log(worker1Data,worker2Data,worker3Data,worker4Data);
  }
}
 
main()
