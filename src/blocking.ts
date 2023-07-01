export default () => {
    // Open the database
    const DBOpenRequest = window.indexedDB.open("toDoList", 4);

    DBOpenRequest.onupgradeneeded = () => {
        const db = DBOpenRequest.result;

        db.onerror = () => {
            console.log("Error creating database");
        };

        // Create an objectStore for this database
        db.createObjectStore("toDoList", {
            keyPath: "taskTitle",
        });

    };

    DBOpenRequest.onsuccess = () => {
        // Let's try to open the same database with a higher revision version
        const req2 = indexedDB.open("toDoList", 5);

        // In this case the onblocked handler will be executed
        req2.addEventListener("blocked", () => {
            console.log("Request was blocked");
        });
    };

}