const {parentPort} = require('worker_threads')
function  testFn(){
  // return await new Promise((resolve,reject)=>{
    // setTimeout(() => {
      for(let i = 0; i < 10000000000; i++){

      }
      return("work completed")
    // }, 3000);
  // }) 
}

parentPort.on('message', (task)=>{
  const workData = testFn();
  if( task=='Wassup Worker1' ){
    process.exit(1)
    // throw Error("This is the error")
  }else{
    parentPort.postMessage({"message": workData,"task":task})
  }
  
})