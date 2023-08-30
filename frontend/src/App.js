import io from "socket.io-client"
import './App.css';
import { useEffect, useState,useRef } from "react";
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap'
import Userdata from "./components/Userdata";
const socket =io("https://timeseriesbackend.onrender.com")
socket.on("connect",()=>console.log('react app is now connected to socket'))
function App() {
  const[data,setData]=useState()
  const [totalcount,setTotalcount]=useState(0)
  const [successcount,setSucesscount]=useState([0])
  const [errorcount,seterrorcount]=useState([0])
  const [error,setError]=useState()
  // console.log(data)
  // console.log('refreshes')
  useEffect(()=>{
    socket.on('success',({payload})=>{
      setData(payload)
  })
  socket.on('log',(message)=>{
 setSucesscount(message.successcount)
 seterrorcount(message.errorcount)
 setTotalcount(message.totalcount)
  })
  socket.on('error',(error)=>{
setError(error.message)
setTimeout(()=>setError(),10000)
  })
  },[data])

  return (
    <>
  <div className="d-flex justify-content-center" style={{marginTop:"20vh"}}>
{data&&<><Userdata name={data.name} origin={data.origin} destination={data.destination}/>
</>}
<div className="mx-5">
<div className="row">
<div className="col-6 mx-2"style={{height:"100px",width:"100px",padding:"10px"}}><p className="text-primary ">Emmited:</p><h5>{totalcount}</h5></div>
<div className="col-6 mx-2"style={{height:"100px",width:"100px",padding:"10px"}}><p className="text-danger">Error:</p><h5>{errorcount}</h5></div>
</div>
<div className="row">
<div className="col-6 mx-2" style={{height:"100px",width:"100px",padding:"10px"}}><p className="text-primary">successfull:</p><h5>{successcount}</h5></div>
<div className="col-6 mx-2" style={{height:"100px",width:"100px",padding:"10px"}}><p className="text-primary">successrate:</p><h5>{(successcount/totalcount)*100}</h5></div>
</div>
<div className="row">
<h3 className="text-primary">...PER BATCH</h3>
</div>
</div>
    </div>
    <div className="d-flex justify-content-center my-5">
    </div>
    {error&&<div style={{textAlign:"center"}}><p className="text-danger">{error}</p></div>}
    </>
  );
}

export default App;
