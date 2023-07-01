export default function initWorker() {
    console.log("hii worker")

    if (!window.Worker) {
        console.log("your browser does not support worker.")
        return
    }

    // const myWorker = new Worker(new URL('../../worker.ts', import.meta.url), {
    //     // type: 'module'
    // })

    const myWorker = new Worker("worker.ts");

    console.log("🚀 ~ file: init.ts:12 ~ myWorker ~ myWorker:", myWorker)


    let i = 0;
    setInterval(() => {
        myWorker.postMessage(`'hello ${i += 1}`)
    }, 2000)

    myWorker.onmessage = (event) => {
        console.log("event ", event)
    }
}
