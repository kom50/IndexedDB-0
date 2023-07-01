export function create(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        if (!window.indexedDB) {
            console.log(`Your browser doesn't support IndexedDB`);
            return;
        }

        // Open database
        const dbRequest = indexedDB.open('CURD-DB', 1);

        dbRequest.onupgradeneeded = () => {
            const db = dbRequest.result

            // Create object store
            const objStore = db.createObjectStore('books', {
                keyPath: 'id', // if not use autoIncrement option
                // autoIncrement: true
            });

            objStore.createIndex('price_idx', 'price')

        }
        dbRequest.onerror = (err) => {
            console.log(`Database error: ${dbRequest.error}`);
            reject(err)
        }

        dbRequest.onsuccess = function () {
            console.log('Database open successful')
            const db = dbRequest.result
            resolve(db);
        };
    })
}