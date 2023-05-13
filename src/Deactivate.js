import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {useCookies} from "react-cookie";
import './Deactivate.css';

function Deactivate(props)
{
    const navigate=useNavigate();
    const [disp, setDisp] =useState("");
    const [pass, setPass]=useState("");
    const [cookies, setCookie,removeCookie]=useCookies(['enquiryUser']);
    
    function handleChange(event)
    {
        setPass(event.target.value);
    }
    function handledel(e)
    {
        let output={
            password: pass,
        }
        console.log(output);
        fetch(`/deleteAccount`, {
            headers:
            {
                'Content-Type': 'application/json',
                "authorization": cookies.enquiryUser
            },
            method: 'POST' ,
                mode: 'cors',
                credentials:"same-origin",
                body:JSON.stringify(output)
            })
            .then(function(res){
                if(res.status===406)
                {
                    setDisp("password was incorrect");
                }
               else if(res.status===200)
                {
                    removeCookie("enquiryUser");
                    navigate("/");
                }
                else if(res.status===469)
                {
                    navigate("/");
                }
                else
                {
                    setDisp("something went wrong!");
                }
            })
    }
    return(
        <div className="deactivatepage">
        <h1 className="head">Are you Sure you want to  permanently deactivate this Account?</h1>
        <h2 className="tail"> This is a permanent change and you will completely lose your account. If you still want to deactivate the account please authenticate with your password.</h2>
        <div className="deform"><label className="delabel"> Enter password:<input className="deinput" type="password"  id="4" onChange= {handleChange}/></label></div>
        <button className="debutton" onClick={handledel}>Deactivate</button>
        <h4 className="deerror">{disp}</h4>
        </div>
    )
}

export default Deactivate;