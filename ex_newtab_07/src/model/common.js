

export default {
  dataDB: {
    name: 'hDB1',
    version: 3,
    db: null,
  },
  connectData () {
    return new Promise((resolve, reject) => {
      let request = indexedDB.open(this.dataDB.name, this.dataDB.version);
      request.onerror = (e) => {
        reject('数据库链接失败', e)
      }

      request.onsuccess = (e) => {
        this.dataDB.db = e.target.result
        resolve(this.dataDB.db)
      }

      request.onupgradeneeded = e => {
        this.dataDB.db = e.target.result;
        if(this.dataDB.db.objectStoreNames.length == 0){
          // let searchEngineDB = this.dataDB.db.createObjectStore('searchEngineDB', { keyPath: 'key', autoIncrement: true })
          // searchEngineDB.createIndex('id', 'id', { unique: true })

          let homeSysDB = this.dataDB.db.createObjectStore('homeSysDB', { keyPath: 'name' });
          homeSysDB.createIndex('name', 'name', { unique: true });

          // this.dataDB.db.createObjectStore('shrotcutTypeDB', { keyPath: 'key', autoIncrement: true })

          // this.dataDB.db.createObjectStore('shortcutListDB', { keyPath: 'key', autoIncrement: true })
        }
        // 如果没有用户表，建立用户表
        if(!this.dataDB.db.objectStoreNames.contains("userDB")){
          let userDB = this.dataDB.db.createObjectStore('userDB', { keyPath: 'id', autoIncrement: true });
          userDB.createIndex('id', 'id', { unique: true });
        }

        // 如果没有同步表，建立同步表
        if(!this.dataDB.db.objectStoreNames.contains("autoSyncDB")){
          let autoSyncDB = this.dataDB.db.createObjectStore('autoSyncDB', { keyPath: 'id', autoIncrement: true })
          autoSyncDB.createIndex('id', 'id', { unique: true });
        }
      }
    })
  },
  /**
   * 根据仓库名称获取仓库数据
   * @param {string} storeName 
   */
  getListByStore: function (storeName){
    return new Promise((resolve, reject) => {
      let transaction = this.dataDB.db.transaction(storeName);
      let store = transaction.objectStore(storeName);
      let request = store.getAll();

      request.onerror = (e) => {
        reject(storeName + '数据获取失败！', e);
      };

      request.onsuccess = (e) => {
        if(storeName ==='shortcutListDB'){
          
        // console.log('获取快捷列表3-shortcutListDB', e.target.result);
        }
        resolve(e.target.result);
      };
    })
  },
  /**
   * 根据索引名称索引值获取数据
   * @param {*仓库名称} storeName 
   * @param {*索引名称} indexName 
   * @param {*索引值} value 
   */
  getDataByIndexName: function (storeName, value, indexName){
    return new Promise((resolve, reject) => {
      let store = this.dataDB.db.transaction(storeName, 'readonly').objectStore(storeName);
      let index = store.index(indexName);
      let request = index.get(value);

      request.onerror = (e) => {
        reject('数据获取失败！', e);
      };

      request.onsuccess = (e) => {
        resolve(e.target.result);
      };
    })
  },
  /**
   * 仓库添加数据
   * @param {*数据对象} obj 
   * @param {*} storeName 
   */
  addDataByStore: function (obj, storeName) {
    return new Promise((resolve, reject) => {
      let request = this.dataDB.db.transaction(storeName,'readwrite').objectStore(storeName)
      .add(obj);

      request.onsuccess = (e) => {
        resolve(e.target.result);
      };
      
      request.onerror = (e) => {
        reject('数据添加失败！', e);
      };
    })
  },
  /**
   * 仓库更新数据
   * @param {*} obj 
   * @param {*} storeName 
   */
  updataByStore: function (obj, storeName) {
    if(storeName == 'shortcutDB'){
      if(obj.id){
        delete obj.id
      }
    }
    
    return new Promise((resolve, reject) => {
      let request = this.dataDB.db.transaction(storeName,'readwrite').objectStore(storeName)
      .put(obj);

      request.onerror = (e) => {
        reject(e.target.error);
      };

      request.onsuccess = (res) => {
        resolve(res);
      };
    })
  },
  /**
   * 清空仓库数据
   * @param {*} storeName 
   */
  clearDataByStore: function (storeName){
    return new Promise((resolve, reject) => {
      let request = this.dataDB.db.transaction(storeName, 'readwrite').objectStore(storeName)
      .clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (e) => {
        reject('数据清空失败！', e);
      };
    })
  },
  /**
   * 仓库更新数据
   * @param {*} obj 
   * @param {*} storeName 
   */
  deleteByStore: function (obj, storeName) {
    return new Promise((resolve, reject) => {
      let request = this.dataDB.db.transaction(storeName,'readwrite').objectStore(storeName)
      .delete(obj);

      request.onerror = (e) => {
        reject(e.target.error);
      };

      request.onsuccess = (res) => {
        resolve();
      };
    })
  },
}