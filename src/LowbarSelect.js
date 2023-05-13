import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Editdetail from "./Editdetail.js";
import Deactivate from "./Deactivate.js";
import Cabpool from "./cabpool.js";
import Lostfound from "./Lostfound.js";


function LowbarSelect(props)
{
    const navigate=useNavigate();
    if(props.sel===0)
    {
        return <div></div>
    }
    else if(props.sel===1)
    {
        return <Editdetail  img={props.pp}/>
    }
    else if(props.sel===2)
    {
        return <Cabpool type={props.type}/>
    }
    else if(props.sel===3)
    {
        return <Lostfound  type={props.type}/>
    }
    else if(props.sel===4)
    {
        return <h1>This page is Admin window</h1>
    }
    else if(props.sel===5)
    {
        return <Deactivate/>
    }
    else
    {
        return <div></div>
    }
}
export default LowbarSelect;