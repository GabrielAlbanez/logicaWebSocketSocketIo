import React from 'react'
import './App.css';
import io from "socket.io-client"
import { useState,useEffect } from 'react';

//essa const socket vai poder enviar dados ao bakend
const socket =  io('http://localhost:8080')

export default function App() {
  const [message,setMessage] = useState("")
  //criar um state para guardar todas as mensagens de todos users conectados
  const [messages,setMessages] = useState([])
  const handleSubmit = (e) =>{
    e.preventDefault()
    //vamos usar o socket para fazer essa ponte entre o front e o bakc
    //esse emit é para a gente emitir um evento ele recebe um nome e um valor
    socket.emit('message',message)
    //fazendo com que vc veja sua propia message
    const newMessage = {
      body : message,
      from : "me",
    }
    setMessages([newMessage,...messages])
    setMessage('')
  }

  useEffect(()=>{
 
    const receberMessage = (message)=>{
      //aq ele vai ta setando o messages levando todos os valores antigos em consideração
      //e o message é um objeto do que foi passado do backe end com a message enviada pelo front e o id
      //do usuario que envio a mensagem
        setMessages([message,...messages])
    }
    socket.on('message', receberMessage)

    return () =>{
      //esse return é para quando o componenete for desmontado
      //ele saia da conexao por isso of e n receba a mensagem para ele mesmo
      //e permitindo que os outros envien mensagem
      socket.off('message', receberMessage)
    }
     
  },[messages])

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={message} onChange={(e)=>{setMessage(e.target.value)}} />
        <button type='submit'>send</button>
      </form>
      {messages.map((message,index)=>(
        <div key={index}>
          <p> {message.from} : {message.body}</p>
        </div>
      ))}
    </div>
  )
}
