export default () => {

    // check for IndexedDB support
    if (!window.indexedDB) {
        console.log(`Your browser doesn't support IndexedDB`);
        return;
    }

    const dbRequest = indexedDB.open('versionDB', 4);

    dbRequest.onupgradeneeded = (event) => {
        console.log(event.oldVersion, event.newVersion)

        const db = dbRequest.result

        // Create object store
        const store = db.createObjectStore('store-4', {
            keyPath: 'id',
            autoIncrement: true
        });
    }

    dbRequest.onsuccess = function () {
        const db = dbRequest.result;

        db.onversionchange = function () {
            db.close();
            // alert("Database is outdated, please reload the page.")


            // If the document isn’t being actively used, it could be appropriate to reload
            // the page without the user’s interaction.
            if (!document.hasFocus()) {
                location.reload();
                // Reloading will close the database, and also reload with the new JavaScript
                // and database definitions.
            } else {
                alert("Database is outdated, please reload the page.")

                // If the document has focus, it can be too disruptive to reload the page.
                // Maybe ask the user to do it manually:
                // displayMessage("Please reload this page for the latest version.");
            }
        };
    };

    dbRequest.onblocked = function () {
        console.log("blocked")
        // this event shouldn't trigger if we handle onversionchange correctly

        // it means that there's another open connection to the same database
        // and it wasn't closed after db.onversionchange triggered for it
    };

    dbRequest.onerror = () => {
        console.log(`Database error: ${dbRequest.error}`);
    }
}