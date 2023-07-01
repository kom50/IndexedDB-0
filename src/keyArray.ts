import { v4 as uuid } from 'uuid';

export interface Book {
    name: string;
    id: [string, string, number];
    price: number;
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

        // db.createObjectStore(object_store_name, {keyPath:string, autoIncrement:number})

        // Create object store
        const objStore = db.createObjectStore('books', {
            keyPath: 'id', // if not use autoIncrement option
            // autoIncrement: true
        });

        // Add with initial data.
        // objectStore.put({name: "C++", price: 500, id: ['db1f9855-0f0c-4ce3-8470-5fd9ff28d902', 'CSS', 150]});

        // objectStore.createIndex(name, keyPath, [options]);

        // Create index
        // objStore.createIndex('price_idx', 'price')

        // { multiEntry: true } - only used if the value on keyPath is an array. 
        objStore.createIndex('id_idx', 'id', {
            multiEntry: true,
            // unique: true   // if key value is unique
        })
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
        } as Book

        book['id'] = [uuid(), book.name, book.price]

        // insertBook(db, book)
        getAllBooks(db)
        // getBookById(db, ['db1f9855-0f0c-4ce3-8470-5fd9ff28d902', 'CSS', 150])
        getBookByIdUsingIndex(db, 'db1f9855-0f0c-4ce3-8470-5fd9ff28d902')

        // getAllBooks(db)
        // deleteBookById(db, 2)
        // getAllBooks(db)

        // getBookByPrice(db, 150)
        // deleteBookByPrice(db, 200)

        // getAllBooksUsingCursor(db)
        // deleteBookUsingCursor(db, 100)
    };



    // Add data in object store
    function insertBook(db: IDBDatabase, book: Book) {

        // Create a new transaction
        const txn = db.transaction('books', 'readwrite');

        const objectStore = txn.objectStore('books');

        // Generate error if key is already present
        const result = objectStore.add(book)

        // If use `id` as keyPath 
        // const result = objectStore.add(book, book.id)

        // Update data if key is already present
        // const result1 = objectStore.put(book)


        // handle success case
        result.onsuccess = () => {
            console.log("data added", result.result)
        }

        // Handle the error case
        result.onerror = (error) => {
            console.log("error ): ", error)
        }

        txn.oncomplete = () => {
            db.close()
        }
    }

    function getAllBooks(db: IDBDatabase) {
        const txn = db.transaction('books', 'readonly');
        const store = txn.objectStore('books')

        const result = store.getAll();

        // handle success case
        result.onsuccess = () => {
            console.log("get all books ", result.result)
        }

        // Handle the error case
        result.onerror = (error) => {
            console.log("error ): ", error)
        }

        txn.oncomplete = () => {
            db.close()
        }
    }

    function getAllBooksUsingCursor(db: IDBDatabase) {
        const txn = db.transaction('books', 'readonly');
        const store = txn.objectStore('books')

        const request = store.openCursor(); // default direction - ascending order
        // const request = store.openCursor(null, 'prev'); // default direction - descending order

        // handle success case
        request.onsuccess = () => {
            const cursor = request.result

            if (cursor) {
                console.log("getAllBooksUsingCursor", { value: cursor.value, })
                cursor.continue();
            } else {
                // no more results
            }
        }

        // Handle the error case
        request.onerror = (error) => {
            console.log("error ): ", error)
        }

        txn.oncomplete = () => {
            db.close()
        }
    }

    function deleteBookUsingCursor(db: IDBDatabase, price: number) {
        const txn = db.transaction('books', 'readwrite');
        const store = txn.objectStore('books')

        const index = store.index('price_idx')

        const request = index.openCursor(); // default direction - ascending order
        // const request = store.openCursor(null, 'prev'); // default direction - descending order

        // handle success case
        request.onsuccess = () => {
            const cursor = request.result

            if (cursor) {
                console.log("deleteBookUsingCursor", { value: cursor.value, })
                if (cursor.key === price) cursor.delete()
                cursor.continue();
            } else {
                // no more results
            }
        }

        // Handle the error case
        request.onerror = (error) => {
            console.log("error ): ", error)
        }

        txn.oncomplete = () => {
            db.close()
        }
    }

    function getBookById(db: IDBDatabase, bookId: string) {
        const txn = db.transaction('books', 'readonly');
        const store = txn.objectStore('books')

        const result = store.get(bookId);

        // handle success case
        result.onsuccess = () => {
            console.log("getBookById ", result.result)
        }

        // Handle the error case
        result.onerror = (error) => {
            console.log("error ): ", error)
        }

        txn.oncomplete = () => {
            db.close()
        }
    }

    function getBookByIdUsingIndex(db: IDBDatabase, bookId: string) {
        const txn = db.transaction('books', 'readonly');
        const store = txn.objectStore('books')

        const index = store.index('id_idx')

        const request = index.get(bookId);

        // handle success case
        request.onsuccess = () => {
            console.log("getBookById ", request.result)
        }

        // Handle the error case
        request.onerror = (error) => {
            console.log("error ): ", error)
        }

        txn.oncomplete = () => {
            db.close()
        }

    }

    function deleteBookById(db: IDBDatabase, bookId: number) {
        const txn = db.transaction(['books'], 'readwrite');

        const store = txn.objectStore('books')

        const request = store.delete(bookId)

        request.onsuccess = () => {
            console.log(`Deleted ${request.result}`)
        }


        // Handle the error case
        request.onerror = (error) => {
            console.log("error ): ", error)
        }

        txn.oncomplete = () => {
            db.close()
        }
    }

    // Read data from the object store by an index
    function getBookByPrice(db: IDBDatabase, price: number) {
        const txn = db.transaction('books', 'readonly');

        const store = txn.objectStore('books')

        const index = store.index('price_idx')

        // const query = IDBKeyRange.lowerBound(price, true) // not include lower bound
        // const query = IDBKeyRange.lowerBound(price)

        // const query = IDBKeyRange.bound(price, 300, true, false)
        const query = IDBKeyRange.bound(price, 300, false, true)

        const result = index.getAll(query)

        // 
        // const result = index.getAll(price)

        // handle success case
        result.onsuccess = () => {
            console.log("getBookByPrice ", result.result)
        }

        // Handle the error case
        result.onerror = (error) => {
            console.log("error ): ", error)
        }

        txn.oncomplete = () => {
            db.close()
        }
    }

    // Delete data from the object store by an index
    function deleteBookByPrice(db: IDBDatabase, price: number) {
        const txn = db.transaction('books', 'readwrite');

        const store = txn.objectStore('books')

        const index = store.index('price_idx')

        const result = index.get(price)

        // handle success case
        result.onsuccess = () => {
            console.log("getBookById ", result.result)

            store.delete((result.result as Book & { id: number }).id)
        }

        // Handle the error case
        result.onerror = (error) => {
            console.log("error ): ", error)
        }

        txn.oncomplete = () => {
            db.close()
        }
    }


}