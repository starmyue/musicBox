
//获取搜索结果
function getSearchResult(SearchContent) {
  var xhrList = new XMLHttpRequest();
  xhrList.open('get', 'http://service-4v0argn6-1314197819.gz.apigw.tencentcs.com/?name=' + SearchContent);
  xhrList.send();
  waitTime();  //计时
  xhrList.onreadystatechange = function () {
    if (xhrList.readyState == 4 && xhrList.status == 200) {
      remove();
      window.parent.dialog_none_btn(action = 'close');
      clearTimeout(timer);
      count = 0;
      window.parent.inputBlur();
      searchList = JSON.parse(xhrList.responseText);
      displayChange('search');  //更换显示内容
      window.parent.resultBtn_onclick();  //自动点击搜索结果
    }
    else if (xhrList.status == 433) {
      clearTimeout(timer);
      count = 0;
      window.parent.dialog_none_btn(action = 'close');
      window.parent.dialog_none_btn(action = 'open', content = '出错了，请重新搜索~');
      autoCLose = true;
      waitTime();
    }
  }
}


//等待
function waitTime() {
  timer = setTimeout(waitTime, 200);
  count++;
  console.log(count);
  if (autoCLose == true && count > 7) {
    window.parent.dialog_none_btn(action = 'close');
    clearTimeout(timer);
    count = 0;
    autoCLose = false;
  }
  else {
    if (count > 25) {
      window.parent.dialog_none_btn(action = 'close');
      window.parent.dialog_none_btn(action = 'open', content = '出错了，请重新搜索~');
      clearTimeout(timer);
      count = 0;
      autoCLose = true;
      waitTime();
    }
  }
}

//显示列表
function cloned(displayList) {
  for (let i = 0; i < displayList.length; i++) {
    var originalDiv = document.getElementById('song_box');    // 获取原始div元素
    originalDiv.style.backgroundColor = window.parent.localStorage.getItem('themeListColor');
    var clonedDiv = originalDiv.cloneNode(true);    // 复制原始div元素及其所有子元素和属性
    clonedDiv.classList.remove('song_box');               // 移除克隆节点上的旧类名
    clonedDiv.classList.add('new_song_box');                  // 添加克隆节点上的新类名
    var iStr = i.toString();
    clonedDiv.style.display = "flex";
    //获取元素
    var songNameld = clonedDiv.querySelector('.songName');
    var del_btnid = clonedDiv.querySelector('#del_btn');
    var play_btnid = clonedDiv.querySelector('#play_btn');
    //更改元素id
    songNameld.setAttribute('id', `songName${iStr}`);
    del_btnid.setAttribute('id', `del_btn${iStr}`);
    play_btnid.setAttribute('id', `play_btn${iStr}`)
    //更改元素内容
    clonedDiv.querySelector('#songNum').textContent = (i + 1).toString().padStart(2, '0'); // 将数字转换成字符串并在左侧填充0以达到2位整数的效果;
    var name = displayList[i]['name'];
    var singer = displayList[i]['artist'];
    clonedDiv.querySelector(`#songName${iStr}`).innerHTML = name.slice(0, 20 + (name.length - name.replace(/&[a-z]+;/g, " ").length)) + '<br><p class="singerName">' + singer.slice(0, 25 + (singer.length - singer.replace(/&[a-z]+;/g, " ").length)) + '</p>';
    document.body.appendChild(clonedDiv);// 将克隆的div元素添加到页面上
  }
}

//清空显示
function remove() {
  if (againFlag) {
    // 获取所有类名为'my-class'的元素
    var elements = document.querySelectorAll('.new_song_box');
    // 遍历元素并删除它们
    elements.forEach(function (element) {
      element.remove(); // 删除元素
    });
  }
}

//操作按钮按下（对播放列表操作，设置缓存）
function add_del_onclick() {
  for (let i = 0; i < displayList.length; i++) {
    document.getElementById(`del_btn${i}`).onclick = function () {
      console.log(`add_del_${i}按下了`)
      var pic = displayList[i]["pic"];
      pic = pic.replace(/\/\d+\//, "/300/");
      if (displayFlag == 1) {
        var addSong = {
          "rid": displayList[i]["rid"],
          "pic": pic,
          "name": displayList[i]["name"],
          "artist": displayList[i]["artist"]
        }
        playList.push(addSong);
        localStorage.setItem('playList', JSON.stringify(playList));
        window.parent.dialogDisplay(`<font size="2px color="#696969">已添加</font><br><font color="#199dfc">${displayList[i]["name"]}(${displayList[i]["artist"]})</font><br><font size="2px color="#696969">到播放列表</font>`)
        //console.log(playList);
      }
      else {
        playList.splice(i, 1);
        localStorage.setItem('playList', JSON.stringify(playList));
        console.log(playList);
        displayChange('play');
      }
    }
  }
}


//播放按钮按下
function play_btn_onclick() {
  for (let i = 0; i < displayList.length; i++) {
    document.getElementById(`play_btn${i}`).onclick = function () {
      console.log(`play_${i}按下了`)
      var pic = displayList[i]["pic"];
      pic = pic.replace(/\/\d+\//, "/300/");
      var parameter = {
        "rid": displayList[i]["rid"],
        "pic": pic,
        "name": displayList[i]["name"],
        "artist": displayList[i]["artist"]
      }
      console.log(displayList);
      console.log(parameter);
      window.parent.switchSongs(parameter);
      lastRid = i;
      if (displayFlag == 0) {
        playListFlag = 0;
        window.parent.list_now(0);
      }
      else {
        playListFlag = 1;
        window.parent.list_now(1);
      }
    }
  }
}

//上一首/下一首触发
function switchSongs(flag) {
  if (flag) {
    if (playListFlag == 0 && lastRid + 1 < playList.length) {
      var nextRid = lastRid + 1;
      lastRid = lastRid + 1;
    }
    else if (playListFlag == 0 && lastRid + 1 >= playList.length) {
      nextRid = 0;
      lastRid = 0;
    }
    else if (playListFlag == 1 && lastRid + 1 < searchList.length) {

      nextRid = lastRid + 1;
      lastRid = lastRid + 1;
    }
    else if (playListFlag == 1 && lastRid + 1 >= searchList.length) {
      nextRid = 0;
      lastRid = 0;
    }
  }
  else {
    if (playListFlag == 0 && lastRid == 0) {
      var nextRid = playList.length - 1;
      lastRid = playList.length - 1;
    }
    else if (playListFlag == 0 && lastRid != 0) {
      nextRid = lastRid - 1;
      lastRid = lastRid - 1;
    }
    else if (playListFlag == 1 && lastRid == 0) {
      nextRid = searchList.length - 1;
      lastRid = searchList.length - 1;
    }
    else if (playListFlag == 1 && lastRid != 0) {
      nextRid = lastRid - 1;
      lastRid = lastRid - 1;
    }
  }
  return nextRid;
}


//上一首/下一首开始播放
function nextPlay(flag) {
  var nextRid = switchSongs(flag);
  if (playListFlag) {
    var List = searchList;
    var pic = List[nextRid]["pic"];
    pic = pic.replace(/\/\d+\//, "/300/");
  }
  else {
    List = playList;
    pic = List[nextRid]["pic"];
  }

  var parameter = {
    "rid": List[nextRid]["rid"],
    "pic": pic,
    "name": List[nextRid]["name"],
    "artist": List[nextRid]["artist"]
  }
  console.log(List);
  console.log(parameter);
  window.parent.switchSongs(parameter);
}


//更换显示列表
function displayChange(flag) {
  if (flag == 'play') {

    document.getElementById('del_btn').innerHTML = '<i class="fa fa-trash-o"></i>';
    remove();
    set.style.display = 'none';
    box.style.display = 'none';
    playList = JSON.parse(localStorage.getItem('playList'));
    displayList = playList;
    cloned(displayList);
    againFlag = true;
    play_btn_onclick();
    add_del_onclick();
    displayFlag = 0;
  }
  else if (flag == 'search') {
    document.getElementById('del_btn').innerHTML = '<i class="fa fa-plus"></i>';
    remove();
    set.style.display = 'none';
    box.style.display = 'none';
    displayList = searchList;
    cloned(displayList);
    againFlag = true;
    play_btn_onclick();
    add_del_onclick();
    displayFlag = 1;
  }
  else if (flag == 'box') {
    remove();
    set.style.display = 'none';
    box.style.display = 'block';
  }
  else if (flag == 'set') {
    remove();
    box.style.display = 'none';
    set.style.display = 'block';
    loadplayTime(window.parent.getPlayTime());
  }
}


//全局变量定义
var displayList = [];
var playList = JSON.parse(localStorage.getItem('playList'));
var searchList = [];
var count = 0;
var timer = 0;
var autoCLose = false;
var againFlag = false;
var displayFlag = 0;
var playListFlag = 0;
var lastRid = 0;
var strayBirdsYiyan = "";
var set = document.getElementById('set_box');
var box = document.getElementById('box_box');
var playTime = document.getElementById('play_time');
var yiyan = document.getElementById('yiyan');


//缓存初始化
if (localStorage.getItem('playList') == null) {
  localStorage.setItem('playList', "[]");
  displayChange('play');
  console.log('缓存空空如也')
}
function loadplayTime(time) {
  playTime.innerHTML = `本月已为你播放:<br>${time}`;
}


/*飞鸟集一言*/
getStrayBirds();
function getStrayBirds() {
  var xhrGetStrayBirds = new XMLHttpRequest();
  xhrGetStrayBirds.open('get', 'https://api.mu-jie.cc/stray-birds/range?from=1&type=json');
  xhrGetStrayBirds.send();
  xhrGetStrayBirds.onreadystatechange = function () {
    if (xhrGetStrayBirds.readyState == 4 && xhrGetStrayBirds.status == 200) {
      strayBirdsYiyan = JSON.parse(xhrGetStrayBirds.responseText);
      yiyan.innerHTML = `${strayBirdsYiyan["cn"]}<br>——泰戈尔《飞鸟集》【${strayBirdsYiyan["num"]}】`;
    }
  }
}

/*确定颜色 主题*/
var a = document.getElementsByTagName('a');
var setVal = document.getElementsByClassName('set_val');
a[0].addEventListener('click', function (event) {
  event.preventDefault();
  if (setVal[0].value !== '') {
    window.parent.theme_set('list', setVal[0].value);
    if (setVal[0].value == '0') {
      window.parent.dialogDisplay(`列表颜色已重置`);
    }
    else {
      window.parent.dialogDisplay(`列表颜色已设置为${setVal[0].value}`);
    }
    setVal[0].value = '';
  }
});
a[1].addEventListener('click', function (event) {
  event.preventDefault();
  if (setVal[1].value !== '') {
    window.parent.theme_set('btn', setVal[1].value);
    if (setVal[1].value == '0') {
      window.parent.dialogDisplay(`选项卡颜色已重置`);
    }
    else {
      window.parent.dialogDisplay(`选项卡颜色已设置为${setVal[1].value}`);
    }
    setVal[1].value = '';
  }
});
a[2].addEventListener('click', function (event) {
  event.preventDefault();
  if (setVal[2].value !== '') {
    window.parent.theme_set('lrc', setVal[2].value);
    if (setVal[2].value == '0') {
      window.parent.dialogDisplay(`歌词高亮颜色已重置`);
    }
    else {
      window.parent.dialogDisplay(`歌词高亮颜色已设置为${setVal[2].value}`);
    }
    setVal[2].value = '';
  }
});
a[3].addEventListener('click', function (event) {
  event.preventDefault();
  if (setVal[3].value !== '') {
    window.parent.theme_set('bg', setVal[3].value);
    if (setVal[3].value == '0') {
      window.parent.dialogDisplay(`背景图片已重置`);
    }
    else {
      window.parent.dialogDisplay(`背景图片已设置为<br><img  height="220px" src="${setVal[3].value}"/>`);
    }
    setVal[3].value = '';
  }
});
a[4].addEventListener('click', function (event) {
  event.preventDefault();
  var val = prompt("将主题参数粘贴到此处", "");
  if(val !== null && val !==''){
  window.parent.theme_set('import', val);
  }
});
a[5].addEventListener('click', function (event) {
  event.preventDefault();
  window.parent.dialogDisplay(`全选复制以下主题参数：<br><br><input type='text' style='width: 100%; height: 30px;' value='${window.parent.theme_set('export')}'>`);
});

//调用父页面函数
//window.parent.函数名();