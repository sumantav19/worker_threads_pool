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
      }).then((result)=>{console.log(result); return result}))
    }
    console.log(await Promise.all(workerPromises))
  }
}
 
main()
