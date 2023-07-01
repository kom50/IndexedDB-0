export function readData(db: IDBDatabase) {

    const txt = db.transaction("books", 'readonly')
    const objStore = txt.objectStore('books')

    const request = objStore.getAll();

    request.onsuccess = () => {
        console.log("Data retrieve", request.result)
        const tableHeaders = ['id', 'name', 'price']
        console.table(request.result, tableHeaders)

    }

    request.onerror = (err) => {
        console.log("error during read ", err)
    }
}

/* 

export function readData(db: IDBDatabase) {

    return new Promise((res, rej) => {
        const txt = db.transaction("books", 'readonly')
        const objStore = txt.objectStore('books')

        const request = objStore.getAll();

        request.onsuccess = () => {
            console.log("Data retrieve", request.result)
            res(request.result)
        }

        request.onerror = (err) => {
            console.log("error during read ", err)
            rej(err)
        }
    })
}
*/