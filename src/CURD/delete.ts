export function deleteData(db: IDBDatabase, id: number) {

    const txt = db.transaction("books", 'readwrite')
    const objStore = txt.objectStore('books')

    const request = objStore.delete(id);

    request.onsuccess = () => {
        console.log("Deleted data ", request.result)
    }

    request.onerror = (err) => {
        console.log("error during delete ", err)
    }
}


/* 
export function updateData(db: IDBDatabase, id: string, data: string) {

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