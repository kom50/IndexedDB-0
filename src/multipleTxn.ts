import { v4 as uuid } from 'uuid';

export interface Book {
    name: string;
    id: string;
    price: number;
}

export interface DepositBook extends Book {
    date: string
}

export default () => {
    if (!window.indexedDB) {
        console.log(`Your browser doesn't support IndexedDB`);
        return;
    }

    // Open database
    const dbRequest = indexedDB.open('store', 1);

    // This handler is called when a new version of the database is created, or initially first time. 
    dbRequest.onupgradeneeded = () => {
        const db = dbRequest.result

        // Create object store
        db.createObjectStore('books', {
            keyPath: 'id', // if not use autoIncrement option
            // autoIncrement: true
        });
        db.createObjectStore('depositBooks', {
            keyPath: 'id', // if not use autoIncrement option
            // autoIncrement: true
        });
    }

    // This handler is called when any error occurs.
    dbRequest.onerror = () => {
        console.log(`Database error: ${dbRequest.error}`);
    }

    // This handler is called when database successfully open. 
    dbRequest.onsuccess = function () {
        console.log('Database open successful')
        const db = dbRequest.result

        const book = {
            name: 'CSS',
            price: 150,
            id: uuid()
            // id: '12ba2d36-b41f-4828-a5f2-c27bf4f08465'
        }


        const txn = db.transaction(['books', 'depositBooks'], 'readwrite')
        console.log("🚀 ~ file: multipleTxn.ts:54 ~ txn:", txn)

        const bookStore = txn.objectStore("books")

        const depositBooksStore = txn.objectStore("depositBooks")

        bookStore.add(book)

        // bookStore.delete('824b5310-fb2d-4a39-b9ec-af0fd667b0fa')

        const book1 = {
            name: 'CSS',
            price: 150,
            // id: uuid()
            id: '12ba2d36-b41f-4828-a5f2-c27bf4f08465'
        }

        depositBooksStore.add({
            ...book1,
            date: new Date()
        })


        txn.onerror = (err) => {
            console.log("Error  ", (err.target as IDBTransaction).error)
        }
    };


}