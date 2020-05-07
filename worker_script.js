const {parentPort} = require('worker_threads')
async function  testFn(){
  return await new Promise((resolve,reject)=>{
    // setTimeout(() => {
      for(let i = 0; i < 10000000000; i++){

      }
      resolve("work completed")
    // }, 3000);
  }) 
}

parentPort.on('message',async (task)=>{
  const workData = await testFn();
  // if( task=='Wassup Worker1' ){
  //   throw Error("This is the error")
  // }
  parentPort.postMessage({"message": workData,"task":task})
})