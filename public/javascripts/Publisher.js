var Publisher = function(){
  var topics = {},
      filter = [],
      length = 0,
      currentTopicIndex = 0
  ;

setInterval(function(){
    currentTopicIndex++;
    if(currentTopicIndex >= length)currentTopicIndex = 0;
},3001);

function subscribe(topic,content,callback){
  if(topics.hasOwnProperty(topic))return false;
  topics[topic] = {content:content,context:this,callback:callback||null};
  length++;
}


function update(topic,content){
  if(topics.hasOwnProperty(topic)){
    topics[topic].content = content;
  }
}

function unsubscribe(topic){
  if(topics.hasOwnProperty(topic))delete topics[topic];
  length--;

}

function publish(){
  var res = "";
  res += "Published "+length+" cases----------------<BR>";
  for(s in topics){
    res += s + ": " + topics[s].content + "\n <BR>";
  }
  return res;
}

function dbg(){
  console.log(publish());
}

function getOneLineTopic(i){
  i = i||currentTopicIndex;
  if(length > i){
    var cnt = 0;
    for(topic in topics){
      if(cnt == i)return topic + " : " + topics[topic].content;
      cnt++;
    }
  } 
  return "Fabnavi";
}


return {
  subscribe:subscribe,
  unsubscribe:unsubscribe,
  update:update,
  publish:publish,
  getOneLineTopic:getOneLineTopic,
  dbg:dbg,
};
}();
