var ThumbnailViewer = function(){

  var selected = null,
      selectedLast = null,
      scroll = 0,
      thumbnailWidth = 320,
      thumbnailHeight = 240,
      scrollMinLimit = -300,
      list = [],
      lastChanged = -1,
      selected,
      _index = 0,
      root = false,
      isShow = true
  ;  


function init(imageList){
  list = imageList;
  root = document.getElementById("editor");
  root.onwheel = function(e){
    e.preventDefault();
    var d = e.deltaX;
    if((scroll < 500 && scroll > scrollMinLimit) || 
      (scroll > 500 && d < 0)  ||
      (scroll < scrollMinLimit && d > 0)){
      scroll += d;
      root.childNodes[0].style.left= +scroll+"px";
    }
  }

  updateDocumentTree();
}

function updateDocumentTree(){
    var frag = document.createDocumentFragment();
    for(var i in list){
      frag.appendChild(generateNode(i));
    }

    var ul = document.createElement("ul");
    ul.id = "thumbnailList";
    ul.appendChild(frag);
    var oldUl;
    if(oldUl= document.getElementById("thumbnailList"))oldUl.remove();
    root.appendChild(ul);
    $("#thumbnailList").sortable(
      {update:updateImageList}).disableSelection();
    scrollMinLimit = -330 * list.length;
}

function updateImageList(){
  var ul = document.getElementById("thumbnailList");
  var res = [];
  for(var i in ul.childNodes){
    res.push(ul.childNodes[i].idURL);
  }
  Fabnavi.updateShowingImageList(res);
}

function generateNode(index){
  var node = document.createElement("li");
  var thumb = list[index].img.cloneNode();
  node.idURL= list[index].globalURL || list[index].localURL;
  thumb.src = list[index].thumbnailURL || list[index].globalURL || list[index].localURL;
  thumb.width = thumbnailWidth;
  thumb.height = thumbnailHeight;
  thumb.draggable = true;
  node.appendChild(thumb);
  node.draggable = true;
  node.onclick = function (e){
    e.preventDefault();
    clicked = true;
    var parent = e.originalTarget.parentElement;
    var index = getIndex(e.originalTarget,parent.parentElement);
    Fabnavi.setPage(index);
    select(index);
  }
  return node;
}


function select(index){
  var ul = document.getElementById("thumbnailList");
  if(selected)selected.className = "";
  ul.children[index].className = "selected";
  selected = ul.children[index];
  _index = index;
}

function nextPage(){
  if(list.length === 0)return _index;
  if(_index < list.length-1){
    _index++;  
  } else {
    _index = 0;
  }
  select(_index);
  return _index;
}

function prevPage(){
  if(list.length === 0)return _index;
  if(_index > 0) { 
    _index--;  
  } else {
    _index = list.length -1;
  }
  select(_index);
  return _index;
}

function reloadPage(){
  select(_index);
}

/** get index 
 *  @params target {HTMLElement}
 *  @params parent {HTMLElement} the parent of the target
 * @return {int}
 */
function getIndex(target,parent){
  var i = 0;
  var children = parent.childNodes;
  for(var c in children){
    if(children[c]== target.parentNode)return i;
    i++;
  }
  return -1;
}

function show(){
  if(root){ 
  root.style.display = "";
  isShow = true;
 }
}

function hide(){
 if(root){
  root.style.display = "none";
  isShow = false;
 }
}

function toggleEditor(){
  if(isShow)hide();
  else show();
}


function splice(startIndex,lastIndex){

}

function getList(){
  return list;
}

return {
  init:init,
  show:show,
  hide:hide,
  toggleEditor:toggleEditor,
  update:updateDocumentTree,
  setPage:select,
  list:getList,
  next:nextPage,
  prev:prevPage,
  reload:reloadPage,
};
};
