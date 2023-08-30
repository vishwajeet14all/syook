const Userdata=({name,origin,destination})=>{
    return (<div  className="d-flex flex-column" style={{border:"solid black 2px",padding:"10px",height:"250px",width:"200px"}}><div><h4 className="text-success">name:</h4><p>{name}</p></div>
    <div><h4 className="text-success">origin:</h4><p>{origin}</p></div>
    <div><h4 className="text-success">destination:</h4><p>{destination}</p></div>
  
    </div>)
}
export default Userdata