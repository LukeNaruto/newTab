

export const arrSort = (arr, sort) => {
  return arr.sort((a, b) => {
    return b[sort] - a[sort]
  })
}

export const ruleOutSimilarArr = (target,ruleOutArr,key)=>{
  let tLen = target.length;
  let rLen = ruleOutArr.length;
  for(let i=tLen - 1;i >=0; i--){
    if(target[i][key]){
      for(let k=0;rLen > k;k++){
        if(target[i][key] === ruleOutArr[k][key]){
          target.splice(i,1);
          break;
        }
      }
    }
  }
  return target;
}

export const sysFormatSort = (list, key='pp')=>{
  let list_ = [];
  for(let i = list.length - 1;i >= 0;i--){
    if(list[i].is == 1){
      let sysItem = list.splice(i,1);
      list_ = list_.concat(sysItem);
    }
  }
  list_.sort((a,b) => {
    return b[key] - a[key];
  });
  return list_.concat(list);
}
/**
 * 
 * @param {url(Str),type(Int) => {1:快捷网址,2: 搜索框, }} opts 
 */
export const windowOpenUrl = (opts)=>{
  let {t = 1, u = '',w = ''} = opts, 
    url = u + encodeURIComponent(w);
  window.open(url);
  if(chrome.xb && chrome.xb.reportLog){
    let jsonStr = JSON.stringify({
      ur: url
    });
    chrome.xb.reportLog(1,t,jsonStr );
  }
};

export const getUserInfo = (callback) => {
  chrome.xb.getUserInfo(res => {
    let user_id = res.user_id || "tourist";
    callback(user_id);
  });
};

export const getDomOffset = (dom, bool=true) => {
  let offset = {
    x: 0,
    y: 0
  };
  if(bool){
    while(dom.parentNode.nodeName.toLocaleLowerCase() !== 'body'){
      offset.x += dom.offsetLeft;
      offset.y += dom.offsetTop;
      dom = dom.parentNode;
    }
  }else{
    offset.x += dom.offsetLeft;
    offset.y += dom.offsetTop;
  }
  return offset;
};
export const getDomainKey = (url) => {
  if(url.length < 1) return '';
  let urlStr = url.replace(/^((http|https)\:\/\/)/,'').split('.'),
      needKey = '';
  switch(urlStr.length){
    case 1:
    case 2:
      needKey = urlStr[0];
      break;
    default:
      needKey = urlStr[1];
      break;
  }
  return needKey = needKey.length > 1 ? needKey : '';
};
export const getIndexByPosition = (opts) => {
  let {size,x,y} = opts, val_x = x / size, val_y = y / size, index = Math.floor(val_x);
  index =  Math.round(val_x) === index ?  index - .6 : index + .4;
  if(Math.floor(val_y)){
    index += 5;
  }
  return index;
};

