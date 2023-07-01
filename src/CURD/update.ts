export function updateData(db: IDBDatabase, id: number, data: string) {

    const txt = db.transaction("books", 'readwrite')
    const objStore = txt.objectStore('books')

    const request = objStore.put(data, id);

    request.onsuccess = () => {
        console.log("Data Updated ", request.result)
    }

    request.onerror = (err) => {
        console.log("error during update ", err)
    }
}

/* 
export function updateData(db: IDBDatabase, id: number, data: string) {

    return new Promise((res, rej) => {
        const txt = db.transaction("books", 'readwrite')
        const objStore = txt.objectStore('books')

        const request = objStore.put(data, id);

        request.onsuccess = () => {
            console.log("Data Updated ", request.result)
            res(request.result)
        }

        request.onerror = (err) => {
            console.log("error during update ", err)
            rej(err)
        }
    })
}

*/