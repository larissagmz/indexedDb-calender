import { events } from "./data.js";
import { addItem, openDatabase, getAllItems} from "./dataBaseUtils.js";

function deleteDatabase(dbName = "CalenderEvents") {
  return new Promise((resolve, reject) => {
    const req = indexedDB.deleteDatabase(dbName);
    req.onsuccess = () => resolve();
    req.onerror   = (event) => reject(event.target.error);
    req.onblocked = () => console.warn(`Deleção de "${dbName}" bloqueada (alguma conexão aberta).`);
  });
}


    // 1) Deleta o banco inteiro

    // 2) Reabre/cria o banco zerado
    const db = await openDatabase("CalenderEvents", 1);



    // 4) (Opcional) Verifica tudo que foi inserido
    const todos = await getAllItems(db, "eventos");
    console.log("Eventos inseridos no banco:", todos);