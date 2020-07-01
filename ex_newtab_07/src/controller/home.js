import DB from '@/model/common'
import ctrlBasic from '@/controller/c_basic'
import {getUserInfo} from '@/libs/arrHandle'
export default {
  getShortcutList (typeid) {
    return new Promise((resolve, reject) => {
      let storeName = 'homeSysDB'
      ctrlBasic.getDataByIndexName(storeName, 'shortcutList').then(res => {
        // console.log('homeSysDB---getShortcutList',res);
        resolve(res.data)
      }).catch(e => {
        reject(e)
      })
    })
  },
  getShortcutType () {
    return new Promise((resolve, reject) => {
      let storeName = 'homeSysDB'
      ctrlBasic.getDataByIndexName(storeName, 'shortcutTypes').then(res => {
        // console.log('homeSysDB---getShortcutType',res);
        resolve(res.data)
      }).catch(e => {
        reject(e)
      })
    })
  },
  setShortcutTypes (list) {
    return new Promise((resolve, reject) => {
      let storeName = 'homeSysDB'
      DB.updataByStore({name: 'shortcutTypes',data: list}, storeName).then(res => {
        resolve();
      }).catch(e => {
        reject(e)
      })
    })
  },
  setShortcutList (list) {
    return new Promise((resolve, reject) => {
      let storeName = 'homeSysDB'
      DB.updataByStore({name: 'shortcutList',data: list}, storeName).then(res => {
        resolve();
      }).catch(e => {
        reject(e)
      })
    })
  },
  setShortcutListInfo (list) {
    // console.log(333,list)
    return new Promise((resolve, reject) => {
      chrome.xb.getUserInfo(res => {
        let user_id = res.user_id || "tourist";
        let storeName = 'userDB';

        ctrlBasic.getDataByIndexId(storeName, user_id).then(res_ => {
          DB.updataByStore({
            ...res_,
            shortcutList: list
          },storeName).then(response => {
            resolve();
          }).catch(e => {
            reject(e)
          })
        }).catch(e => {
          reject()
        })
      })
    })
  },
  getShortcutListInfo(){
    return new Promise((resolve, reject) => {
      chrome.xb.getUserInfo(res => {
        let user_id = res.user_id || "tourist";
        let storeName = 'userDB';
        ctrlBasic.getDataByIndexId(storeName, user_id).then(res_ => {
          resolve(res_)
        }).catch(e => {
          reject(e);
        })
        
      })
    })
  },
  getIndividuation(){
    return new Promise((resolve, reject) => {
      chrome.xb.getUserInfo(res => {
        let user_id = res.user_id || "tourist";
        let storeName = 'userDB'
        ctrlBasic.getDataByIndexId(storeName, user_id).then(res_ => {
          resolve(res_)
        }).catch(e => {
          reject(e);
        })
      });
    })
  },
  setIndividuation(info, storeName = 'userDB'){
    return new Promise((resolve, reject) => {
      chrome.xb.getUserInfo(res => {
        let user_id = res.user_id || "tourist";
        ctrlBasic.getDataByIndexId(storeName, user_id).then(res_ => {
          // console.log('individuation----33-1-',res_,user_id)
          var res_ = res_ || { id: user_id };
          DB.updataByStore({ ...res_, individuation: info },storeName).then(response => {
            // console.log('individuation----33--',info,response);
            resolve(res_);
          }).catch(e => {
            reject(e);
          })
        }).catch(e => {
          reject(e);
        })
      });
    })
  },
  recordShortcutEdit(){
    return new Promise((resolve, reject) => {
      let storeName = 'autoSyncDB';
      getUserInfo((user_id)=>{
        ctrlBasic.getDataByIndexId(storeName, user_id).then(res_ => {
          resolve(res_);
        }).catch(e => {
          reject(e);
        })
      });
    })
  }
}