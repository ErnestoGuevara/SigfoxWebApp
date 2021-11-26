
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

  //Consultar API desarrollada de AWS
  const consultarBdd= ()=>{
    axios.get("https://7prb4nwyxa.execute-api.us-east-1.amazonaws.com/items").then(response=>{
      
    //Obtener ultimo valor de la BDD
      const lista=response.data.Items;
      const lastItem=lista[lista.length-1];
      //Valor hex de sensores Sigfox 00-00-00 
      const hexaSigfox=Object.values(lastItem)[0].data;

      //Primeros dos valores del hex de sigfox 
      const sensor1= hexaSigfox.charAt(0)+hexaSigfox.charAt(1);
      //Segundos dos valores del hex de sigfox 
      const sensor2= hexaSigfox.charAt(2)+hexaSigfox.charAt(3);
      //Ultimos dos valores del hex de sigfox 
      const sensor3= hexaSigfox.charAt(4)+hexaSigfox.charAt(5);


      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Se vio BDD: '+hexaSigfox,
        showConfirmButton: false,
        timer: 1500
      })
      console.log(sensor1);
      console.log(sensor2);
      console.log(sensor3);
      console.log(hexaSigfox);

      //lista.forEach(element => {
        //console.log(element);
        //for(let values in element){
          //console.log(element[values]);
        //}
      //});
      
     
    })
  }

  const [count, setCount] = useState(0);
  const [intervalId, setIntervalId] = useState(0);
  
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
  if ((count%10)===0){
    
    consultarBdd();
    
  }
  //Imprimier contador de segudnos
  console.log(count);
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
        <p>Status: </p>
        
        </div>
        <div className="lluvia">
          <h3>Lluvia</h3>
          <img src={lluvia} alt="lluvia"></img>
          <p>Status: </p>
        </div>

        <div className="inundacion">
        <h3>Inundación</h3>
          <img src={ondas} alt="ondas"></img>
        <p>Status: </p>
       
        </div>
      </div>

    </div>
    
  );
}

export default App;
