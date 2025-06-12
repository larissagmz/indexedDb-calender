  // Abre ou cria o banco de dados IndexedDB com nome e versão especificados 
  export function openDatabase(dbName = "CalenderEvents", dbVersion = 1) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, dbVersion);

      // Executado quando a versão do banco é atualizada (ou banco criado pela primeira vez)
      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Cria o objectStore "campi" se não existir, com a chave primária "id"
        if (!db.objectStoreNames.contains("campi")) {
          const campiStore = db.createObjectStore("campi", { keyPath: "id" });
          // Cria índice para pesquisar pelo campo "nome" 
          campiStore.createIndex("nome", "nome", { unique: false });
        }

        // Cria o objectStore "eventos" se não existir, chave "id" autoincrementável
        if (!db.objectStoreNames.contains("eventos")) {
          const eventosStore = db.createObjectStore("eventos", { keyPath: "id", autoIncrement: true });
          // Índices para consultas por campusId, dataInicio e dataFim 
          eventosStore.createIndex("campusId", "campusId", { unique: false });
          eventosStore.createIndex("dataInicio", "dataInicio", { unique: false });
          eventosStore.createIndex("dataFim", "dataFim", { unique: false });
        }
      };

      // Sucesso ao abrir o banco, retorna o objeto db
      request.onsuccess = (event) => resolve(event.target.result);

      // Caso ocorra erro ao abrir/criar banco, rejeita a promise
      request.onerror = (event) => reject(event.target.error);
    });
  }

  // Adiciona um item ao objectStore especificado (ex: "campi" ou "eventos")
  export function addItem(db, storeName, item) {
    return new Promise((resolve, reject) => {
      // Cria transação de escrita no objectStore
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const request = store.add(item);

      // Resolve a promise quando item for adicionado com sucesso
      request.onsuccess = () => resolve();

      // Rejeita a promise em caso de erro na inserção
      request.onerror = () => reject(request.error);
    });
  }

  // Busca e retorna todos os itens do objectStore especificado
  export function getAllItems(db, storeName) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Busca todos os itens do objectStore que tenham índice (indexName) igual a determinado valor
  export function getItemsByIndex(db, storeName, indexName, value) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(IDBKeyRange.only(value));

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Conta a quantidade de itens no objectStore especificado
  export function countItems(db, storeName) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const request = store.count();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Deleta um item do objectStore especificado pelo ID
  export function deleteItem(db, storeName, id) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  export function updateItem(db, storeName, item) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const request = store.put(item); // usa put para inserir ou atualizar

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}