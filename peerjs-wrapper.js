class peer_wrapper {
    constructor(peer,debug)
    {
      this.debug=debug;
      this.peerID='';
      this.peerinstance='';
      this.object_user_connect={};
      this.eventlist={};
      this.bandwitchrecord={};
     if(peer)
     {
      this.peerinstance=peer;
      this.initPeer(this.peerinstance);
     }
     else
     {
       //display error
      this.consoleDisplay('you does\'n pass peer instance parameter','error');
     }
    }
    //function to display console error,info,log
    consoleDisplay(msg,type)
    { 
       //display condition it' error or info or log
if(this.debug)
{
  if (type=='error')
  {
 //display error in console
 console.error(`[Peer wrapper]:${msg}`);
  }
else if (type=='warn')
 {
   console.warn(`[Peer wrapper]:${msg}`);
 }
 else if (type=='info')
 {
  console.info(`[Peer wrapper]:${msg}`);
 }
else
  {
    console.log(`[Peer wrapper]:${msg}`);
  }
}
else
{
  console.info('[Peer Wrapper]:debug is desactivate');
}
 }
initPeer(peer)
{
  let per='';
  peer.on('open',(id)=> {
   //add peer id in per
   this.peerID=id;
   this.consoleDisplay(`peerid:${this.peerID}`,'info');
  });
peer.on('connection', conn => {
    this.consoleDisplay("user: "+conn.peer,'info');
    this.object_user_connect[conn.peer]=conn;//peerid:peer
    this.object_user_connect[conn.peer].on('data',data=>{
      this.consoleDisplay(`user[${data[1].id}]:send a data ${data[2]}'`);
      this.CustomEvent(data);
    })
    /*
    //loop for object_user_connection 
    for(let i in obje)
    {
     //listen data from peer with peerConnection[i]
      peerConnections[i].on('data', data => {
        console.log(data);
        CustompeerEvent.call(data);   //call event
      });
    }*/
  });
}
ReceivevideoCall(callback)
{
  this.peerinstance.on('call', call => {
    callback(call);
    });
}
videoCall(id,stream,callback){
  var call = peer.call(id, stream);
  callback(call);
}
//vocal call
voiceCall(id,stream,callback){
  var call = peer.call(id, stream);
  callback(call);
}
//receive a call
ReceiveVocalCall(callback){
  this.peerinstance.on('call', call => {
    callback(call);
    });
}
CustomEvent(data)
{
  if(data[1].promise)
  {
     this.emit(`${data[0]}_promise`,data[1].id,{received:true,date:Date()},false)
  }
  if(this.eventlist[data[0]])
  {

  this.eventlist[data[0]](data[2]);
  }
  else{
    this.consoleDisplay(`unknow event ${data[0]}`,'warn');
  }
}
currentProtect(value,type,regexp)
{
  //if type=='text'detect type of value
  if(type=='text')
  {
    //parse value to string
    value=value.toString();
    return value;   //return value
  }
  //if type=='number'
  else if(type=='number')
  {
    //parse value to number
    value=parseInt(value);
    return value;   //return value  
  }
  //if type=='regexp'
  else if(type=='regexp')
  {
    //parse value to regexp
    value=new RegExp(value);
    return value;   //return value
  } 
  //if type=='boolean'
  else if(type=='boolean')
  {
    //parse value to boolean
    value=Boolean(value);
    return value;   //return value
  }
}
on(handler,callback){
  this.eventlist[handler]=callback;
}
emit(handler,id,data,callback){
 let requestPromise=false;
  if(callback)
  {
    this.consoleDisplay('require a receive promise','warn');
    requestPromise=true;
    this.on(`${handler}_promise`,callback);
  }
this.object_user_connect[id].send([handler,{id:this.peerID,promise:requestPromise},data]);
}
broadcast(handler,data){
   //loop for object_user_connection 
   for(let i in this.object_user_connect)
   {
    //listen data from peer with peerConnection[i]
     this.object_user_connect[i].send(
       [handler,{id:this.peerID,promise:false},data]
     )
   }
}
//smart peer traffic gestion
smartPeerTraffic(){
   this.bandwitchInfo();
   this.on('smart_broadcast-diffuse',(data)=>{
    //handler event
   // verify data authenticity 
 //// this.emit('verify_data',data.real,)
    this.eventlist[data.handler](this.data);
  });
   this.on('smart_broadcast',(data)=>{
      //broadcast by all connected peer
      this.broadcast('smart_broadcast-diffuse',data);   
   })
}
//function to create a hash for data
async dataHash(data)
{
  //hash data:sha-256
  async function digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message);                           // encode comme (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // fait le condensé
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convertit le buffer en tableau d'octet
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convertit le tableau en chaîne hexadélimale
    return hashHex;
  }
  return await digestMessage(data);
}
connectPeer(id)
{
  var peerConn=this.peerinstance.connect(id);
  peerConn.on('open', () => {
      this.object_user_connect[id]=peerConn;
    });
  peerConn.on('data',data=>{
    this.consoleDisplay(`user[${data[1].id}]:send a data ${data[2]}`,'info');
    this.CustomEvent(data);
  })
}
bandwitchInfo(){
  //get network user info
 //send a random data size:1kb to all user in object_user_connection
  for(let i in this.object_user_connect){
    //save date send in bandwitchrecord
    this.bandwitchrecord[i]={
      send:Date(),
      received:'',
      bandwitchEstimate:0,
    }
 this.emit('bandwitchinfo',i,generate1kbdata(),(data)=>{
    //retrieve date in data 
    let date=data.date;
    //retrive send date in bandwitchrecord
    let send=this.bandwitchrecord[i].send;
    //estimate bandwitch in kb/s
    let bandwitchEstimate=((Date.parse(date)-Date.parse(send))/1000)/1024;
    console.log(bandwitchEstimate);
    //save bandwitch in bandwitchrecord
    this.bandwitchrecord[i].bandwitchEstimate=bandwitchEstimate;
    //save received date in bandwitchrecord
    this.bandwitchrecord[i].received=date;
  });
  //generate 1kb data function
  function generate1kbdata()
  {
    let data='';
    for(let i=0;i<1000;i++)
    {
      data+='a';
    }
    return data;
  }
  }
}
found_most_speed(){
//find the user with the most bandwitch
  let max=0;
  let id='';
  for(let i in this.bandwitchrecord)
  {
    if(this.bandwitchrecord[i].bandwitchEstimate>max)
    {
      max=this.bandwitchrecord[i].bandwitchEstimate;
      id=i;
    }
  }
  return id;
}
smartBroadcast(handler,data){
  //find the user with the most bandwitch
  let id=this.found_most_speed();
  this.emit('smart_broadcast',this.object_user_connect[id],{handler:handler,info:{id:this.peerID,promise:false},data:data},(r
    )=>{
      //consoleDisplay info smart broadcast succeed
      this.consoleDisplay('smart broadcast receive','info');
    });
}
} 