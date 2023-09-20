import express from "express";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
//para usarmos o socket.io temos que criar um server htpp e a gente passa o server do express dentro dele so assim o socket.io vai poder  se conectar
const server = http.createServer(app);

//esse server do socket.io recebe o server http que é passado o express dentro
const io = new SocketServer(server,{
  cors : {
    //o asterisco permite que qualquer server se conecte
    // ou seja o server do react
    origin : '*'
  }
});
dotenv.config();
app.use(cors());
app.use(morgan("dev"));
//evento conexão ou abertura
//ou seja quando la do front ele recebe essa ação
//de conection do socket.io-cliente e para fazer algo
io.on('connection',(socket)=>{
//esse argumento socket possibilita inf do usuarios conectado
//no caso ali estou vendo o id
console.log(socket.id)
//apos o usuario esta conectado podemos receber eventos com o socket.on 
//mas para usar o on temos que dar um emit la no front

//dentro do parametro dessa função que pode ter qualquer nome ele vai conter os dados dessa ação
socket.on('message', function (message) {
 console.log(message);
 //aq esse broadcast server para vc aplicar um evento para todos user conectados no caso ali o evento de emit
 socket.broadcast.emit('message', {
  body : message,
  from : socket.id
 })
})

})

//tem que ser server em vez de app pois é esse server
// que o socket.io vai usar 
server.listen(8080, () => {
  let porta = process.env.PORT || 3001
  console.log(`server is running at port ${porta}`);
});
