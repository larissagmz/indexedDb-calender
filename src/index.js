const dbName = "EventosDB";
const dbVersion = 1;
let db;

const openRequest = indexedDB.open(dbName, dbVersion);

openRequest.onupgradeneeded = function (event) {
    db = event.target.result;

    if (!db.objectStoreNames.contains("campi")) {
        const campiStore = db.createObjectStore("campi", { keyPath: "id" });
        campiStore.createIndex("nome", "nome", { unique: false });
    }

    if (!db.objectStoreNames.contains("eventos")) {
        const eventosStore = db.createObjectStore("eventos", { keyPath: "id" });
        eventosStore.createIndex("campusId", "campusId", { unique: false });
        eventosStore.createIndex("data", "data", { unique: false });
    }
};

openRequest.onsuccess = function (event) {
    db = event.target.result;
    console.log("Banco de dados aberto com sucesso!");
    adicionarCampus({ id: 1, nome: "Campus São Paulo" });

    adicionarEvento({
        id: 101,
        data: "2025-05-20",
        cor: "#ff0000",
        descricao: "Palestra sobre IA",
        campusId: 1,
    });

    buscarEventosPorCampus(1);
};

openRequest.onerror = function (event) {
    console.error("Erro ao abrir o banco de dados:", event.target.errorCode);
};

function adicionarCampus(campus) {
    const tx = db.transaction("campi", "readwrite");
    const store = tx.objectStore("campi");
    store.add(campus);
    tx.oncomplete = () => console.log("Campus adicionado");
}

function adicionarEvento(evento) {
    const tx = db.transaction("eventos", "readwrite");
    const store = tx.objectStore("eventos");
    store.add(evento);
    tx.oncomplete = () => console.log("Evento adicionado");
}

function buscarEventosPorCampus(campusId) {
    const tx = db.transaction("eventos", "readonly");
    const store = tx.objectStore("eventos");
    const index = store.index("campusId");
    const request = index.getAll(IDBKeyRange.only(campusId));

    request.onsuccess = function () {
        console.log("Eventos do campus", campusId, ":", request.result);
    };
}
