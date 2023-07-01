export default () => {
    if (!window.indexedDB) return;

    // Open database
    const dbRequest = indexedDB.open('Transaction-concept', 1);

    let db: IDBDatabase | null = null;

    dbRequest.onupgradeneeded = () => {
        db = dbRequest.result
        db.createObjectStore('store-1', { keyPath: 'name' });
    }


    dbRequest.onsuccess = function () {
        db = dbRequest.result

        const tx = db!.transaction("store-1", "readwrite");
        const store = tx.objectStore("store-1");

        const request = store.put({ name: "name2", city: "Mahwal" });

        request.onerror = function (event) {
            console.log("🚀 ~ file: transaction.ts:19 ~ event:", event)
        };

        request.onsuccess = (event) => {


            db?.deleteObjectStore('store-1')

            // fetch('/').then(response => {
            //     console.log("🚀 ~ file: transaction.ts:31 ~ fetch ~ store:", store)
            //     let request2 = store.add('anotherBook'); // (*)
            //     request2.onerror = function () {
            //         console.log(request2.error); // TransactionInactiveError
            //     };
            // }).catch(er => {
            //     console.log(er)
            // });
            // setTimeout(() => {

            // let request2 = store.add('anotherBook'); // (*)

            // let request2 = store.add({ name: "name1", city: "Mahwal" }); // (*)
            // request2.onerror = function () {
            //     console.log(request2.error); // TransactionInactiveError
            // };
            // }, 0)
        }

        tx.onabort = function (er) {
            console.log("🚀 ~ file: transaction.ts:40 ~ er:", er)
            // Otherwise the transaction will automatically abort due the failed request.
        };


    }
}