import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Register.css';
import logo from './images/enquirylogo.png';
import bg from './images/background.jpg';

function Register(props)
{
    const [data, setData]=useState(Array(8).fill(false));
    const [disp, setDisp] =useState("");
    const navigate=useNavigate();
   
    const handleChange=(event)=>
    {
        let update= data;
        update[parseInt(event.target.id)]=event.target.value;
        setData(update);
    }
    const handleSubmit=(event)=>
    {
        if(data[1]==false)
        {
            setDisp("first name is missing, Provide necessary details or rewrite it to resolve this");
        }
        else if(data[2]==false)
        {
            setDisp("last name is missing, Provide necessary details or rewrite it to resolve this");
        }
        else if(data[3]==false)
        {
            setDisp("E-mail is missing, Provide necessary details or rewrite it to resolve this");
        }
        else if(data[4]==false)
        {
            setDisp("Roll number is missing, Provide necessary details or rewrite it to resolve this");
        }
        else if(data[5]==false)
        {
            setDisp("Date of Birth is missing, Provide necessary details or rewrite it to resolve this");
        }
        else if(data[6]==false)
        {
            setDisp("Password is missing, Provide necessary detail or rewrite it to resolve this");
        }
        else if(data[7]==false)
        {
            setDisp("confirm your password");
        }
        else if(data[6]!==data[7])
        {
            setDisp("passwords don't match, please rewrite the passwords");
        }
        else
        {
            let output={
                firstname: data[1],
	            lastname: data[2],
	            roll: data[4],
	            email: data[3],
	            birthdate: data[5],
	            password: data[6]
            }
            console.log(output);
            fetch(`/register`, {
                headers:{
                    "Content-Type": "application/json"
                },    
                method: 'POST' ,
                    mode: 'cors',
                    credentials:"same-origin",
                    body: JSON.stringify(output)
                })
                .then(function(res){
                    if(res.status===504)
                    {
                        setDisp("something went wrong in the server");
                    }
                     if(res.status===406)
                    {
                        setDisp("The roll number or email already exists");
                    }
                     if(res.status===204)
                     {
                        setDisp("Account created succesfully!!! please verify your email address");
                     }
                })
        }
        event.preventDefault();
    }
    function handleClick(event)
    {
        navigate("/");
        event.preventDefault();
    }
    return (
        <div className="page">
         <img src={bg} id="background" alt="background"/>
        <div className="register">
        <form className="registerform" onSubmit= {handleSubmit}>
            <div className="form"><h1 className="createAccount">Create Account:</h1></div>
            <div className="form"><label className="registerlabel"> First Name: <input className="registerinput" type="text" id="1" onChange= {handleChange}/></label></div>
            <div className="form"><label className="registerlabel">Last Name: <input className="registerinput" type="text" id="2" onChange= {handleChange}/></label></div>
            <div className="form"><label className="registerlabel"> E-mail:<input className="registerinput" type="text" id="3" onChange= {handleChange}/></label></div>
            <div className="form"><label className="registerlabel"> Roll number:<input className="registerinput" type="text" id="4" onChange= {handleChange}/></label></div>
            <div className="form"><label className="registerlabel"> Date of Birth:<input className="registerinput" type="date" id="5" onChange= {handleChange}/></label></div>
            <div className="form"><label className="registerlabel"> Password:<input className="registerinput" type="password"  id="6" onChange= {handleChange}/></label></div>
            <div className="form"><label className="registerlabel"> Confirm password:<input className="registerinput" type="password"  id="7" onChange= {handleChange}/></label></div>
            <div className="form"><input className="submit" type="submit"  value="Sign Up" />
            <button className="registerbutton" onClick={handleClick}> log in</button></div>
        </form>
        <h4 className="registerdisplay">{disp}</h4>
        </div>
        <div id="blackbar"></div>
        <h1 className="caption">Campus life made easier!</h1>
        <img src={logo} id="logo" alt="logo"/>
       
        </div>
        
    )
}
export default Register;