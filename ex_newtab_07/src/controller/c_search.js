import model from '@/model/common';
import api from '@/api/api';

export default {
  db: null,
  getDBSearchEngine (user_id) {
    return new Promise((resolve, reject) => {
      model.getDataByIndexName('userDB', user_id, 'id').then(res => {
        if(res.searchEngine){
          resolve(res.searchEngine)
        }
        else {
          reject(res)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
  
  getDBSearchEngineList () {
    return new Promise((resolve, reject) => {
      model.getDataByIndexName('homeSysDB', "searchEngine", 'name').then(res => {
        resolve(res);
      }).catch(err => {
        reject(err)
      })
    })
  },
  
  getDBHotWordsList () {
    return new Promise((resolve, reject) => {
      model.getDataByIndexName('homeSysDB', "hotWordsList", 'name').then(res => {
        resolve(res);
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 获取热词列表（服务端）
  getApiHotWordsList (url) {
    return new Promise((resolve, reject) => {
      api.getApiHotWordsList(url).then(res => {
        resolve(res.data);
      }).catch(err => {
        reject(err)
      })
    })
  },
}