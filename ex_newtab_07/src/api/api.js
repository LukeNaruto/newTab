import axios from 'axios'
// const urls = {
//   engine: 'http://tapi4.minibai.com/searchengine.json',
//   shortcut: 'http://tapi4.minibai.com/newtabsource.json',
//   association: 'https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&from=pc_web&sugsid=1434,21104,29579,29074,29519,28519,29098,29568,28839,29221&wd=',
//   skincfg: 'http://tapi4.minibai.com/pskincfg.json',
//   usersync: 'http://tapi2.minibai.com/uns.json'
// }

const urls = {
  engine: 'https://api4.minibai.com/g/1/gs.api',
  // engine: 'http://tapi4.minibai.com/searchengine.json',
  shortcut: 'http://api4.minibai.com/g/1/gn.api',
  association: 'https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&from=pc_web&sugsid=1434,21104,29579,29074,29519,28519,29098,29568,28839,29221&wd=',
  skincfg: 'https://api4.minibai.com/g/1/gsk.api',
  getusersync: 'http://api2.minibai.com/u/1/gun.api',
  setusersync: 'http://api2.minibai.com/u/1/pun.api',
  hotwords: 'http://cdmp.minibai.com/b/1/hotword',
  wallpaper: 'https://api4.minibai.com/g/1/gb.api',
}

axios.defaults.timeout = 5000
axios.defaults.baseURL = '/api'

export default {
  getApiWallpaperList (version) {
    return new Promise((resolve, reject) => {
      axios.get(urls.wallpaper + '?v=' + version).then(res => {
        resolve(res)
      }).catch(e => {
        reject(e)
      })
    })
  },

  getApiWordAssociation (word, hotUrl) {
    return new Promise((resolve, reject) => {
      axios.get(hotUrl + word)
      .then(res => {
        let arr = []
        if(res.data.g){
          res.data.g.forEach(i => arr.push(i.q))
        }
        resolve(arr)
      }).catch(e => {
        reject(e)
      })
    })
  },
  
  getApiSearchEngineList (version) {
    return new Promise((resolve, reject) => {
      axios.get(urls.engine + '?v=' + version).then(res => {
        resolve(res.data)
      }).catch(e => {
        reject(e)
      })
    })
  },

  getShortcutList () {
    let version = localStorage.getItem('shortcut-version') || 0
    return new Promise((resolve, reject) => {
      axios.get(urls.shortcut + '?v=' + version).then(res => {
        // console.log('api--getShortcutList',vertion)
        resolve(res.data)
      }).catch(e => {
        reject(e)
      })
    })
  },

  getSkinGroups () {
    return new Promise((resolve, reject) => {
      axios.get(urls.skincfg).then(res => {
        resolve(res.data)
      }).catch(e => {
        reject(e)
      })
    })
  },

  getSkinsByGroupId (id) {
    return new Promise((resolve, reject) => {
      axios.get(urls.skincfg +'?pid=' + id).then(res => {
        resolve(res.data)
      }).catch(e => {
        reject(e)
      })
    })
  },

  getApiSyncUserData (data) {
    return new Promise((resolve, reject) => {
      axios.post(urls.getusersync +'?token=' + data.tk, data).then(res => {
        resolve(res.data)
      }).catch(e => {
        reject(e)
      })
    })
  },

  setApiSyncUserData (data) {
    return new Promise((resolve, reject) => {
      axios.post(urls.setusersync +'?token=' + data.tk, data).then(res => {
        resolve(res.data)
      }).catch(e => {
        reject(e)
      })
    })
  },
  
  // 获取热词列表（服务端）
  getApiHotWordsList (url) {
    return new Promise((resolve, reject) => {
      axios.get(url).then(res => {
        resolve(res)
      }).catch(e => {
        reject(e)
      })
    })
  },
}