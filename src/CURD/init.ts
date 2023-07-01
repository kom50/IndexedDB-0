import { addData } from "./add";
import { create } from "./create";
// import { deleteData } from "./delete";
import { readData } from "./read";
// import { updateData } from "./update";

export default async function () {
    const db = await create();

    const book = {
        name: 'React js',
        price: 350,
        id: 106,
    }

    addData(db, book)

    readData(db)


    // updateData(db, 101, {
    //     name: 'HTML + CSS',
    //     price: 330,
    //     id: 102,
    // })

    // deleteData(db, 101)
}