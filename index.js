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
      this.once('freedworker',()=>{
        console.log("worker freed")
        this.runTask(task,callback);
      })
      return;
    }
    const worker=this.workers.pop()
    worker.postMessage(task);
    worker.once('message',(result)=>{
      this.emit('freedworker')
      callback(undefined,result)
      this.workers.push(worker)
    })
    worker.once('error',(error)=>{
      console.log(">>>>>>>>",error)
      callback(error,undefined);
    })
    worker.once('exit',(exitCode)=>{
      console.log("exit",exitCode);
      callback(exitCode,undefined);
      this.addNewWorker(this.filename);
    })
  }
}

async function main(){
  if(isMainThread){
    const workerPool = new WorkerPool('./worker_script.js',4)
    const workerPromises= []
    for(let i = 1 ; i <= 6; i++){
      workerPromises.push( new Promise((resolve,reject)=>{
        workerPool.runTask(`Wassup Worker${i}`,(err,result)=>{
          if(err){
            reject(err);
            return;
          }
          resolve(result);
        })
      })
      .then((result)=>{
        console.log(result); 
        return result})
      .catch((err)=>{
        console.log(`errored out at ${i}`); 
        return "err"}))
    }
    console.log(await Promise.all(workerPromises))
  }
}
 
main()
