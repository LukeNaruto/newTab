import model from '@/model/common';
import api from '@/api/api';

export default {
  db: null,
  getDBWallpaper (user_id) {
    return new Promise((resolve, reject) => {
      model.getDataByIndexName('userDB', user_id, 'id').then(res => {
        if(res.wallpaper){
          resolve(res.wallpaper)
        }
        else {
          reject(res)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
  
  getDBWallpaperList () {
    return new Promise((resolve, reject) => {
      model.getDataByIndexName('homeSysDB', "wallpaperList", 'name').then(res => {
        resolve(res);
      }).catch(err => {
        reject(err)
      })
    })
  },
  
  setDBWallpaperList (data) {
    return new Promise((resolve, reject) => {
      model.getDataByIndexName('homeSysDB', "wallpaperList", 'name').then(res => {
        if (res) {
          resolve(res.data);
        }
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 获取壁纸列表（服务端）
  getApiWallpaperList (v) {
    return new Promise((resolve, reject) => {
      api.getApiWallpaperList(v).then(res => {
        resolve(res.data);
      }).catch(e => {
        reject(e)
      })
    })
  },
}