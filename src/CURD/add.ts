export function addData(db: IDBDatabase, data: any) {
    const txt = db.transaction("books", 'readwrite')

    const objStore = txt.objectStore('books')

    const request = objStore.add(data);

    request.onsuccess = () => {
        console.log("Data add successfully", request.result)
    }

    request.onerror = (err) => {
        console.error("error during add", err)
    }
}

/* 
export function addData(db: IDBDatabase, data: any) {
    return new Promise((res, rej) => {
        const txt = db.transaction("books", 'readwrite')

        const objStore = txt.objectStore('books')

        const request = objStore.add(data);

        request.onsuccess = (event) => {
            console.log("Data add successfully")
            res(event)
        }

        request.onerror = (err) => {
            console.log("error during add", err)
            rej(err)
        }
    })
}
*/