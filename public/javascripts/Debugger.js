/* firefox specific */

function genKeyMapIndex(){
  var keyMap = KeyBind.keyMap();
  var i,keyCode;
  var result = "";
  for(keyCode in keyMap){
    var keyName;
    for(i in KeyEvent){
     if(keyCode == KeyEvent[i])keyName = i.toString().replace("DOM_VK_","");
    }
    result += keyName + " : " + keyMap[keyCode].name + "\n";
  }
  return result;
}

function getAllKeyMapIndex(){
  var keyMapIndex = "";
  if(KeyBind.mode == "Index"){
    KeyBind.init();
    keyMapIndex += genKeyMapIndex();
  }else if(KeyBind.mode == "Project"){
    KeyBind.play();
    keyMapIndex += "Play Mode --------- \n";
    keyMapIndex += genKeyMapIndex();
    KeyBind.add();
    keyMapIndex += "\n\nAdd Mode ----------\n";
    keyMapIndex += genKeyMapIndex();
    KeyBind.edit();
    keyMapIndex += "\n\nEdit Mode ---------\n";
    keyMapIndex += genKeyMapIndex();
  }else {
    throw Error("Invalid KeyMap");
  }
  console.log(keyMapIndex);
}
