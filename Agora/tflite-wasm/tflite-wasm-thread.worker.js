var Module={};function threadPrintErr(){var text=Array.prototype.slice.call(arguments).join(" ");console.error(text)}function threadAlert(){var text=Array.prototype.slice.call(arguments).join(" ");postMessage({cmd:"alert",text:text,threadId:Module["_pthread_self"]()})}var err=threadPrintErr;this.alert=threadAlert;Module["instantiateWasm"]=function(info,receiveInstance){var instance=new WebAssembly.Instance(Module["wasmModule"],info);Module["wasmModule"]=null;receiveInstance(instance);return instance.exports};this.onmessage=function(e){try{if(e.data.cmd==="load"){Module["wasmModule"]=e.data.wasmModule;Module["wasmMemory"]=e.data.wasmMemory;Module["buffer"]=Module["wasmMemory"].buffer;Module["ENVIRONMENT_IS_PTHREAD"]=true;if(typeof e.data.urlOrBlob==="string"){importScripts(e.data.urlOrBlob)}else{var objectUrl=URL.createObjectURL(e.data.urlOrBlob);importScripts(objectUrl);URL.revokeObjectURL(objectUrl)}Tflite_thread(Module).then(function(instance){Module=instance;postMessage({"cmd":"loaded"})})}else if(e.data.cmd==="objectTransfer"){Module["PThread"].receiveObjectTransfer(e.data)}else if(e.data.cmd==="run"){Module["__performance_now_clock_drift"]=performance.now()-e.data.time;var threadInfoStruct=e.data.threadInfoStruct;Module["__emscripten_thread_init"](threadInfoStruct,0,0);var max=e.data.stackBase;var top=e.data.stackBase+e.data.stackSize;Module["establishStackSpace"](top,max);Module["_emscripten_tls_init"]();Module["PThread"].receiveObjectTransfer(e.data);Module["PThread"].setThreadStatus(Module["_pthread_self"](),1);try{var result=Module["invokeEntryPoint"](e.data.start_routine,e.data.arg);if(!Module["getNoExitRuntime"]())Module["PThread"].threadExit(result)}catch(ex){if(ex==="Canceled!"){Module["PThread"].threadCancel()}else if(ex!="unwind"){if(ex instanceof Module["ExitStatus"]){if(Module["getNoExitRuntime"]()){}else{Module["PThread"].threadExit(ex.status)}}else{Module["PThread"].threadExit(-2);throw ex}}}}else if(e.data.cmd==="cancel"){if(threadInfoStruct){Module["PThread"].threadCancel()}}else if(e.data.target==="setimmediate"){}else if(e.data.cmd==="processThreadQueue"){if(threadInfoStruct){Module["_emscripten_current_thread_process_queued_calls"]()}}else{err("worker.js received unknown command "+e.data.cmd);err(e.data)}}catch(ex){err("worker.js onmessage() captured an uncaught exception: "+ex);if(ex&&ex.stack)err(ex.stack);throw ex}};
