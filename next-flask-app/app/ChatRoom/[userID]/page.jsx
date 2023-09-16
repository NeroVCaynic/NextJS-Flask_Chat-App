'use client';

import { useRouter } from 'next/navigation';
import {io} from 'socket.io-client';
import { useState, useEffect, useRef } from 'react';

export default function chatRoom({ params }) {

  const UserInfo = params.userID.split("_");
  const [clientMSG, addMSG] = useState([]);
  const textmessage = useRef(null);
  const router = useRouter();

  const sio = io('http://127.0.0.1:5000', {
    auth: UserInfo[0],
  });

  function sendMessage() {
    sio.send({clientName: UserInfo[0], clientMessage: textmessage.current?.value});
  }

  sio.on('connection_event', (data)=>{
    console.log(data)
  });

  sio.on("message", (data)=>{
    addMSG(data)
  });

  function isUserMessage(index, client, message) {
    if (client == UserInfo[0]) {
      return (
        <div key={index} className='message-box message-nodeL bg-slate-100 text-left flex flex-col gap-2'>
          <p className='message-name bg-slate-400 self-start'>{client}</p>
          <span className='text-md font-semibold px-2'>{message}</span>
        </div>
      );
    }

    return (
      <div key={index} className='message-box message-nodeR bg-blue-600 text-right flex flex-col gap-2'>
        <p className='message-name bg-blue-500 self-end'>{client}</p>
        <span className='text-md font-semibold px-2'>{message}</span>
      </div>
    );
  }

  async function checkforConnection() {
    const ExistResponse = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({UserCheckRequest: true, userName: UserInfo[0]})
    });

    const responseJson = await ExistResponse.json();

    if (responseJson.status == 'User Does Not Exist') {
      sio.disconnect();
      router.push("/");
    }
  }

  useEffect(()=>{
    checkforConnection()
  }, [])

  async function endConnection() {

    sio.disconnect();

    const connectionResponse = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({callCancelRequest: true, userName: UserInfo[0]})
    });

    const responseJson = await connectionResponse.json();

    console.log(responseJson);

    router.push("/");

  }

  return (
    <div className='h-screen md:h-auto md:aspect-video glass-effect container mx-auto md:mt-8 rounded-[100px] md:rounded-md flex flex-col justify-center items-center gap-2'>
      <button className='absolute top-0 right-1/2 md:top-0 md:right-0 bg-red-400 rounded-b-md md:rounded-e-md w-12 h-6 text-sm text-white' onClick={endConnection}>Menu</button>
      <div className='w-full md:w-[80%] h-[50%] sm:h-auto sm:aspect-video py-6 px-2 overflow-hidden overflow-y-auto shadow-black shadow-lg bg-white glass-effect border-x-2 border-gray-400 space-y-8'>
        {
          clientMSG?.length > 0 ? (
            clientMSG.map(({clientName, clientMessage}, index) => isUserMessage(index, clientName, clientMessage))
          )
          :
          (
            null
          )
        }
      </div>
      <div className='w-full md:w-[80%] flex justify-center items-center'>
        <textarea ref={textmessage} className='w-full flex-1 shadow-black shadow-lg border-x-2 border-t-2 border-gray-400 rounded-s-md text-lg font-semibold px-2 py-4 outline-none resize-none' name="MessageBox" rows="2"/>
        <button className='h-full aspect-square bg-blue-600 hover:bg-blue-700 transition-all text-white border-2 border-gray-400 rounded-e-full' type="submit" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}