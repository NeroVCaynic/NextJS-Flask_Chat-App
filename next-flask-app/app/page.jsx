'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [UserName, setUserName] = useState('')

  async function requestConnection(data) {
    if (data != '' && data.length >= 2 ) {
      const connectionResponse = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({callConnectionRequest: true, userName: data})
      });

      const responseJson = await connectionResponse.json()
      console.log(responseJson)
      router.push(`/ChatRoom/${data}_${responseJson.clientId}`);
    }

    else {
      alert("Name not Invalid")
    }
  }

  function handleNameChange(event) {
    setUserName(event.target.value);
  }


  return (
    <div className='h-screen md:h-auto md:aspect-video glass-effect container mx-auto md:mt-8 rounded-[100px] md:rounded-md flex flex-col justify-center items-center gap-8'>
      <div className="w-full md:w-[32rem] aspect-square glass-effect rounded-md flex flex-col justify-evenly items-center gap-4">
        <input className="w-64 h-12 rounded-s-3xl rounded-e-3xl font-semibold mx-2 px-4 outline-zinc-400" name="yourName" type="text" maxLength="20" minLength="5" placeholder="Your Name?" onChange={handleNameChange} value={UserName}/>
        <div className="flex flex-col sm:flex-row justify-evenly items-center gap-4">
          <button className="bg-white w-64 h-8 rounded-md flex justify-center items-center font-semibold" onClick={() => requestConnection(UserName)}><span>Join Chat Room</span></button>
        </div>
      </div>
    </div>
  )
}