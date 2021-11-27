
import './App.css';
import axios from "axios";
import React, { useState, useEffect } from "react";
import casa from "./img/casa-inteligente.png";
import tec from "./img/tec.png";
import lluvia from "./img/lluvioso.png";
import ondas from "./img/ondas.png";
import barrera from "./img/barrera.png";
import Swal from 'sweetalert2'


function App() {

  const [estado, setEstado] = useState({
    barrera: ' ',
    lluvia: ' ',
    humedad: ' '
  }); 

  const [hexaSigfox, setHexaSigfox] = useState(' ');

  const [count, setCount] = useState(0);
  const [intervalId, setIntervalId] = useState(0);

  const mensajes = (sigfox) => {
    const barrera =  parseInt(sigfox.charAt(1));
    const lluvia = parseInt(sigfox.charAt(3));
    const humedad = parseInt(sigfox.charAt(5));

    let barreraVal = ''
    let lluviaVal = ''
    let humedadVal = ''

    if(barrera === 0){
      barreraVal = "Barrera abajo"
    }else if(barrera === 1){
      barreraVal = "Barrera a la mitad"
    }else if(barrera === 2){
      barreraVal = "Barrera arriba"
    }

    if(lluvia === 0){
      lluviaVal = "No está lloviendo"
    }else if(lluvia === 1){
      lluviaVal = "Está lloviendo"
    }

    if(humedad === 0){
      humedadVal = "Sin inundación"
    }else if(humedad === 1){
      humedadVal = "Inundación pequeña"
    }else if(humedad ===2){
      humedadVal = "Inundación"
    }

    //Primeros dos valores del hex de sigfox 
    setEstado({barrera: barreraVal,
              lluvia: lluviaVal,
              humedad: humedadVal});

    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: barreraVal + '\n' + lluviaVal + '\n' + humedadVal,
      showConfirmButton: false,
      timer: 3000
    })
  }

  //Consultar API desarrollada de AWS
  const consultarBdd= async ()=>{
    await axios.get("https://7prb4nwyxa.execute-api.us-east-1.amazonaws.com/items").then(response=>{

    //Obtener ultimo valor de la BDD
      const lista=response.data.Items;
      const lastItem=lista[lista.length-1];
      //Valor hex de sensores Sigfox 00-00-00 
      if(hexaSigfox !== Object.values(lastItem)[0].data){
        setHexaSigfox(Object.values(lastItem)[0].data);
        mensajes(Object.values(lastItem)[0].data);
      }   
    })
  }

    useEffect(() => {
      consultarBdd();
    }, []);
  
  //Funcion para iniciar a contar segundos
  const handleClick = () => {
    //Para poder detener y avanzar el contador de tiempo
    if(intervalId) {
      clearInterval(intervalId);
      setIntervalId(0);
      return;
    }
    
    const newIntervalId = setInterval(() => {
      setCount(prevCount => prevCount + 1);
    }, 1000);
    setIntervalId(newIntervalId)
  }
  //Llamar funcion cada 10 segundos
  //if ((count%10)===0){
   //  consultarBdd();
 // }
  //Imprimier contador de segudnos
  //console.log(count);
  return (
    <div className="container">
      <div className="barra">
        <img src={casa} alt="casa" className="casa"></img>
        <img src={tec} alt="tec" className="logo"></img>
      </div>
     
      <div className="boton">
      <button onClick={handleClick}> {intervalId ? "Detener" : "Iniciar"}</button>
      </div>
      <div className="tarjetas">
        <div className="barrera"> 
        <h3>Barrera</h3>
        <img src={barrera} alt="barrera"></img>
        <p>Status: {estado.barrera}</p>
        
        </div>
        <div className="lluvia">
          <h3>Lluvia</h3>
          <img src={lluvia} alt="lluvia"></img>
          <p>Status: {estado.lluvia}</p>
        </div>

        <div className="inundacion">
        <h3>Inundación</h3>
          <img src={ondas} alt="ondas"></img>
        <p>Status: {estado.humedad}</p>
       
        </div>
      </div>

    </div>
    
  );
}

export default App;
