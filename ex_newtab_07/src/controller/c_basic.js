import model from '@/model/common';
import api from '@/api/api';

export default {
  db: null,
  connectData () {
    return new Promise((resolve, reject) => {
      model.connectData().then((db) => {
        this.db = db
        resolve(db)
      }).catch((e) => {
        reject(e)
      })
    })
  },

  getDataByIndexName (storeName, name) {
    return new Promise((resolve, reject) => {
      model.getDataByIndexName(storeName, name, 'name').then(res => {
        // if(res){
        //   resolve(res)
        // }else{
        //   reject(name)
        // }
        resolve(res)
      }).catch(e => {
        reject(e)
      })
    })
  },

  getDataByIndexId (storeName, id) {
    return new Promise((resolve, reject) => {
      model.getDataByIndexName(storeName, id, 'id').then(res => {
        // if(res){
        //   resolve(res)
        // }else{
        //   reject(id)
        // }
        resolve(res)
      }).catch(e => {
        reject(e)
      })
    })
  },

  getDataByIndex (storeName, value, index) {
    return new Promise((resolve, reject) => {
      model.getDataByIndexName(storeName, value, index).then(res => {
        resolve(res)
      }).catch(e => {
        reject(e)
      })
    })
  },
  
  updateHomeSysDB (data) {
    const storeName = 'homeSysDB';

    return new Promise((resolve, reject) => {
      model.getDataByIndexName(storeName, data.name, 'name').then(res => {
        if(res){
          model.updataByStore(data, storeName).then(() => {
            resolve(data)
          }).catch(e => {
            reject(e)
          })
        }else{
          model.addDataByStore(data, storeName).then(() => {
            resolve(data)
          }).catch(e => {
            reject(e)
          })
        }
      }).catch(e => {
        reject(e)
      })
    })
  },
  
  // 通过user_id，更新userDB表
  // 如果type为"unchangeAutoAsyncDB",表示没有需要同步的数据操作
  updateUserDB (user_id, data, type) {
    const storeName = 'userDB';
    
    return new Promise((resolve, reject) => {
      model.getDataByIndexName(storeName, user_id, 'id').then(res => {
        if (res) {
          model.updataByStore({ ...res, 'id': user_id, ...data }, storeName).then((res) => {
            if (type !== "unchangeAutoAsyncDB") {
              this.updateAutoSyncDB(user_id, "update", data);
            }
            resolve(res);
          }).catch(e => {
            reject(e)
          })
        } else {
          model.addDataByStore({ 'id': user_id, ...data }, storeName).then((res) => {
            if (type !== "unchangeAutoAsyncDB") {
              this.updateAutoSyncDB(user_id, "update", data);
            }
            resolve(res);
          }).catch(e => {
            reject(e)
          })
        }
      }).catch(e => {
        reject(e)
      })
    })
  },
  // 清除
  async clearAutoSyncDBByID (user_id) {
    const storeName = 'autoSyncDB';
    
    const userData = await model.getDataByIndexName(storeName, user_id, 'id');
    
    return new Promise((resolve, reject) => {
      model.updataByStore({id: user_id}, storeName).then(res => {
        resolve(res)
      }).catch(e => {
        reject(e)
      });
    })
  },

  updateAutoSyncDB (user_id, type, data) {
    if (user_id === "tourist") return
    this.updateAutoSyncList(user_id, type, data);
    this.updateAutoSyncDBByID(user_id, data);
  },

  // 操作ID数组
  async updateAutoSyncList (user_id, type, data) {
    const storeName = 'autoSyncDB';
    
    const autoSyncDB= await model.getDataByIndexName(storeName, "autoSync", 'id');
    // 如果存在autoSyncDB
    if (autoSyncDB) {
      let newArray = [];

      // 判断是删除，还是更新user_id
      if (type === "update") {
        newArray = [...new Set([user_id, ...autoSyncDB.userIDList])];
      } else if (type === "delete") {
        newArray = autoSyncDB.userIDList.filter(item=> item !== user_id);
      }

      model.updataByStore({"id": "autoSync", "userIDList": newArray}, storeName);
    } 
    // 如果不存在autoSyncDB
    else {
      if (type === "onlyAdd") {
        model.addDataByStore({"id": "autoSync", "userIDList": []}, storeName);
      } else {
        model.addDataByStore({"id": "autoSync", "userIDList": [user_id]}, storeName);
      }
    }
  },

  // 根据user_id，操作数据
  updateAutoSyncDBByID (user_id, data) {
    const storeName = 'autoSyncDB';

    return new Promise((resolve, reject) => {
      model.getDataByIndexName(storeName, user_id, 'id').then(res => {
        if (data) {
          model.updataByStore({ "id": user_id, ...res, ...data }, storeName).then(res => {
            resolve(res);
          }).catch(e => {
            // console.log('%updateAutoSyncDBByID，更新数据失败', 'color: red;');
            reject(e)
          })
        }
      })
    })
  },

  getApiSyncUserData (data) {
    return new Promise((resolve, reject) => {
      api.getApiSyncUserData(data).then(res => {
        resolve(res);
      }).catch(e => {
        reject(e)
      })
    })
  },

  setApiSyncUserData (data) {
    return new Promise((resolve, reject) => {
      api.setApiSyncUserData(data).then(res => {
        resolve(res);
      }).catch(e => {
        reject(e)
      })
    })
  },

  // 根据uesr_id清空userDB用户数据
  async clearUserDBByID (user_id) {
    const storeName = 'userDB';
    // await model.getDataByIndexName(storeName, user_id, 'id');
    
    return new Promise((resolve, reject) => {
      model.updataByStore({id: user_id}, storeName).then(res => {
        resolve(res)
      }).catch(e => {
        reject(e)
      });
    })
  },
}