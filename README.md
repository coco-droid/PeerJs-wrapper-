# PeerJs-wrapper
it's a lib for create custom event (listener-emitter) and connect,gestionnate multi node in P2P support broadcasting event and screensharing api "only dekstop"
<details><summary>Integration</summary>
<p>

#### install peerjs in webserver 
Visit :https://www.npmjs.com/package/peerjs for backend configuration
npm:
```bash
          npm i peerjs --save
```
#### after backend configuration go on front-end and put script tag in head 
```Html
             <script src="./peerjs.js"></script>
             <script src="./peerjs-wrapper.js"></script>
```
>NB:this path can  change if peerjs and peerjs-wrapper.js is in other directory
</p>
</details>
<details><summary>Initialisation</summary>
<p>

#### create a peer and pass in peer_wapper instance
Visit:https://peerjs.com/ for more detail on the peer instance
npm:
 ```js
         const p2p= new Peer({
             host: location.hostname,
             port: location.port || (location.protocol === 'https:' ? 443 : 80),
             path: '/peerjs'
          })//peer instance
         let mypeer=new peer_wrapper(p2p,true); //peerjs wrapper instance :true "allow debug":false"dissalow debug message" 
 ```
</p>
</details>
<details><summary>Connections and others </summary>
<p>

#### connect with another peer
Visit:https://peerjs.com/ for more detail on the peer instance
npm:
 ```js
        mypeer.connectPeer(id); 
 ```
 >Data connections is stored on a object:
 ```js
       mypeer.object_user_connect; //access with the id of user mypeer.object_user_connect[id]
       mypeer.peerID for id of client in current use 
 ```
 >Emit a custom event 
 ```js
       mypeer.emit('event_name',data,callback); //third parameter is define for receive a acknowledge receipt of the message he return a object{receive:bol,date:timestamp}
 ```
 >listener a custom event
 ```js
       mypeer.on('event_name',callback)
       //example
       mypeer.on('message',(data)=>{
            console.log('message);
       })
 ```
 >Broadcast message by multiple node 
 ```js
       mypeer.broadcast('event_name',data);
 ```
 >Receive video call and voice call
 ```js
       mypeer.ReceivevideoCall(callback)
       mypeer.ReceiveVocalCall(callback)
 ```
 >video call and voice call
 ```js
       mypeer.videoCall(id,stream,callback)
       mypeer.voiceCall(id,stream,callback)
 ```
</p>

</details>


