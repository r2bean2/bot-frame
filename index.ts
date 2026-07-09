import worker_threads from "node:worker_threads";

function runScript (pathname: string){
    const worker = new worker_threads.Worker(pathname);
    worker.once("error", (error) => {
        console.error(error);
    });
}

runScript("./text_bots_worker.ts");
