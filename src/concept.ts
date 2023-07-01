export default () => {

    if (!window.indexedDB) {
        console.log(`Your browser doesn't support IndexedDB`);
    }

    // Open database
    const dbRequest = indexedDB.open('store', 1);

    let db: IDBDatabase | null = null;

    // This handler is called when a new version of the database is created, or initially first time. 
    dbRequest.onupgradeneeded = () => {
        db = dbRequest.result

        // Create object store
        const objStore = db.createObjectStore('books', {
            // keyPath: 'id', // if not use autoIncrement option
            autoIncrement: true
        });

        // Create index
        objStore.createIndex('price_idx', 'price')

    }

    const tx = db!.transaction("books", "readwrite");
    const store = tx.objectStore("books");
    const request = store.put({ title: "Water Buffaloes", author: "Slate", isbn: 987654 });
    request.onerror = function (event) {
        // The uniqueness constraint of the "by_title" index failed.
        // Could call event.preventDefault() to prevent the transaction from aborting.
    };
    tx.onabort = function () {
        // Otherwise the transaction will automatically abort due the failed request.
    };



    function versionUpdate() {

        const request = indexedDB.open("library", 3); // Request version 3.
        let db;

        request.onupgradeneeded = function (event) {
            const db = request.result;
            if (event.oldVersion < 1) {
                // Version 1 is the first version of the database.
                const store = db.createObjectStore("books", { keyPath: "isbn" });
                const titleIndex = store.createIndex("by_title", "title", { unique: true });
                const authorIndex = store.createIndex("by_author", "author");
            }
            if (event.oldVersion < 2) {
                // Version 2 introduces a new index of books by year.
                const bookStore = request!.transaction!.objectStore("books");
                const yearIndex = bookStore.createIndex("by_year", "year");
            }
            if (event.oldVersion < 3) {
                // Version 3 introduces a new object store for magazines with two indexes.
                const magazines = db.createObjectStore("magazines");
                const publisherIndex = magazines.createIndex("by_publisher", "publisher");
                const frequencyIndex = magazines.createIndex("by_frequency", "frequency");
            }
        };

        request.onsuccess = function () {
            db = request.result; // db.version will be 3.
        };
    }

    function f1() {
        const tx = db!.transaction("books", "readonly");
        const store = tx.objectStore("books");
        const index = store.index("by_title");

        // tx.commit()
        const request = index.get("Bedrock Nights");
        request.onsuccess = function () {
            const matching = request.result;
            if (matching !== undefined) {
                // A match was found.
            } else {
                // No match was found.
            }
        };
    }

    function usingCursor() {
        const tx = db!.transaction("books", "readonly");
        const store = tx.objectStore("books");
        const index = store.index("by_author");

        const request = index.openCursor(IDBKeyRange.only("Fred"));
        request.onsuccess = function () {
            const cursor = request.result;
            if (cursor) {
                // Called for each matching record.
                // report(cursor.value.isbn, cursor.value.title, cursor.value.author);
                cursor.continue();
            } else {
                // No more matching records.
                // report(null);
            }
        };
    }
}
