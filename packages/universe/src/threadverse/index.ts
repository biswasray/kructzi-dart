import { Worker } from "worker_threads";
import { IRunnable, IRunnableOption, IUnwrappedResult } from "./interfaces";

export { IRunnable, IRunnableOption, IUnwrappedResult };

// /**
//  * Represents a custom event indicating the exit status of a process.
//  */
// export class ExitEvent extends CustomEvent<{ code: number }> {
//   /**
//    * Creates an instance of ExitEvent with the specified exit code.
//    * @param {number} code - The exit code indicating the status of the process.
//    */
//   constructor(code: number) {
//     super("exit", { detail: { code } });
//   }
// }
// function createParallelFunction<P extends Array<unknown>, R>(
//   runnable: IRunnable<P, R>,
//   options: IRunnableOption = {},
// ) {
//   return function (...params: P) {
//     const script = `
// 		const {
// 			parentPort
// 		} = require("node:worker_threads");
// 		${runnable.toString()}
// 		parentPort.on("message",(data)=>{
// 			const result = ${runnable.name}.apply(null,data);
// 			parentPort.postMessage(result);
// 			parentPort.close();
// 		});
// 		`;
//     return new Promise<R>((resolve, reject) => {
//       const { signal, startTime = 0, timeout } = options;
//       const worker = new Worker(script, { eval: true });
//       signal?.addEventListener(
//         "abort",
//         (_) => {
//           _;
//           worker.terminate();
//         },
//         { once: true },
//       );
//       let startTimer: NodeJS.Timeout | undefined;
//       let timeoutTimer: NodeJS.Timeout | undefined;
//       if (startTime) {
//         startTimer = setTimeout(() => worker.postMessage(params), startTime);
//       } else {
//         worker.postMessage(params);
//       }
//       startTimer;
//       if (timeout) {
//         timeoutTimer = setTimeout(() => {
//           worker.terminate();
//           clearTimeout(startTimer);
//         }, timeout);
//       }
//       worker.on("message", (data) => {
//         resolve(data);
//         clearTimeout(startTimer);
//         clearTimeout(timeoutTimer);
//       });
//       worker.on("error", reject);
//       worker.on("exit", reject);
//     });
//   };
// }

/**
 * Creates a Web Worker with the provided runnable function and options.
 * @template P - The type of parameters accepted by the runnable function.
 * @template R - The type of result returned by the runnable function.
 * @param {string} runnable - The function to be executed by the Web Worker.
 * @param {IRunnableOption} [options={}] - Options for configuring the behavior of the Web Worker.
 * @param {P} params - The parameters to be passed to the runnable function.
 * @returns {Worker} The created Web Worker instance.
 */
export function createWorker<P extends Array<unknown>>(
  runnable: string,
  options: IRunnableOption = {},
  params: P,
) {
  const { deps } = options;
  const depEntries = Object.entries(deps || {});
  const depNames = depEntries.map((p) => p[0]);
  const depValues = depEntries.map((p) => p[1]);
  const script = `
		const {
			parentPort
		} = require("node:worker_threads");

    const funcName = Symbol("runnable.name");
    function factoryFun(${depNames.join(",")}) {
      var funcMap = {};
      funcMap[funcName] = ${runnable.toString()};
      return funcMap;
    }
		parentPort.on("message",async (data)=>{
      const {depValues,params} = data;
      const funcMap = factoryFun.apply(null,depValues);
      const result = await funcMap[funcName].apply(null,params);
			parentPort.postMessage(result);
			parentPort.close();
		});
		`;
  const { signal, startTime = 0, timeout } = options;
  const worker = new Worker(script, { eval: true });
  signal?.addEventListener(
    "abort",
    (_) => {
      _;
      worker.terminate();
    },
    { once: true },
  );
  let startTimer: NodeJS.Timeout | undefined;
  let timeoutTimer: NodeJS.Timeout | undefined;
  if (startTime) {
    startTimer = setTimeout(
      () => worker.postMessage({ depValues, params }),
      startTime,
    );
  } else {
    worker.postMessage({ depValues, params });
  }
  if (timeout) {
    timeoutTimer = setTimeout(() => {
      worker.terminate();
      clearTimeout(startTimer);
    }, timeout);
  }
  worker.on("message", (_) => {
    _;
    clearTimeout(timeoutTimer);
    clearTimeout(startTimer);
  });
  // worker.on("error", reject);
  // worker.on("exit", reject);
  return worker;
}

/**
 * Creates a pool of workers to execute a given runnable function asynchronously.
 * @template P - The type of parameters accepted by the runnable function.
 * @template R - The type of result returned by the runnable function.
 * @param {string} runnable - The function to be executed by the workers.
 * @param {IRunnableOption} [options] - Options for configuring the pool and worker behavior.
 * @returns {(...params: P) => Promise<IUnwrappedResult<R>>} A function that, when called with parameters, returns a Promise that resolves to the result of executing the runnable function.
 */
export function createPool<P extends Array<unknown>, R>(
  runnable: string,
  options?: IRunnableOption,
) {
  return function (...params: P) {
    return new Promise<IUnwrappedResult<R>>((resolve, reject) => {
      const { log } = console;
      const retriesWithIn = options?.retriesWithIn || [];
      const logger = options?.logger || log;
      const retriesWithInLength = retriesWithIn.length;
      let retryCount = 0;
      let errorInstance: Error | undefined;
      function exitHandler(code: number) {
        if (code === 0) {
          return;
        }
        if (retryCount < retriesWithInLength) {
          const retryTimeout = retriesWithIn[retryCount++];
          logger(`Retry with in ${retryTimeout}ms`);
          setTimeout(tryExecution, retryTimeout);
        } else {
          reject(
            errorInstance instanceof Error
              ? errorInstance
              : new Error(`Worker stopped with exit code ${code}`),
          );
        }
      }
      function tryExecution() {
        const worker = createWorker(runnable, options, params);
        worker.on("message", resolve);
        worker.on("error", (error) => (errorInstance = error));
        worker.on("exit", exitHandler);
      }
      tryExecution();
    });
  };
}

export default { createPool, createWorker };
