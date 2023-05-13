import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Editdetail.css';
import pp from "./images/profilepic.jpg";
import {useCookies} from "react-cookie";


function Editdetail(props)
{
    const [data, setData]=useState(Array(8).fill(""));
    const navigate=useNavigate();
    const [img, setImg]=useState(props.img);
    const [disp, setDisp] =useState("");
    const [imgCh, setImgCh]=useState(0);
    const [imgfile, setImgfile]=useState("");
    const [cookies, setCookie,removeCookie]=useCookies(['enquiryUser']);
   
    const handleChange=(event)=>
    {
        let update= data;
        update[parseInt(event.target.id)]=event.target.value;
        setData(update);
    }
    const handleImage=(event)=>
    {
        console.log(event.target.files[0]);
        var value=URL.createObjectURL(event.target.files[0]);
        setImg(value);
        setImgCh(1);

        setDisp("loading..........");

        var reader = new FileReader();
        var file= document.getElementById("6").files[0];
        reader.readAsDataURL(file);
        reader.onload=function(){
            console.log("loaded");
            setImgfile(reader.result);
            setDisp("Image is ready to go");
        }
    }
    const handleCancel=(event)=>
    {
        setImg(props.img);
        setImgCh(0);
        setImgfile("");
    }
    async function handleUpload()
    {
        if(imgCh===1)
        {
        let val= imgfile;
        let output={
            bin: val,
        };
        console.log(JSON.stringify(output));
        fetch(`/updatepp`, {
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
                if(res.status===200)
                {
                    setDisp("update was successful");
                    navigate("/main");
                }
                else if(res.status===469)
                {
                    navigate("/");
                }
                else
                {
                    setDisp("Something went wrong while uploading the server");
                }
            })
            navigate("/main");
        }
        else
        {
            setDisp("Nothing to upload");
        }
    }
    async function handleSubmit(e)
    {
        e.preventDefault();
        if(data[4]!=="")
        {
            if(data[4]!==data[5])
            {
                setDisp("New password do not match with confirm password");
                return;
            }
            if(data[3]==="")
            {
                setDisp("old password is empty, please provide old password to update new password");
                return;
            }
        }
       
        let output={
            firstname: data[1],
            lastname: data[2],
            oldpassword: data[3],
            password: data[4],
        }
        
        console.log(output);
        fetch(`/updateAccount`, {
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
                 if(res.status===469)
                {
                    navigate("/");
                }
                if(res.status===503)
                {
                    setDisp("some error occured");
                }
                if(res.status===406)
                {
                    setDisp("password was incorrect");
                }
                if(res.status===200)
                {
                    setDisp("update was successful");
                    navigate("/main");
                }
            })
    }
   return(
    <div className="editpage">
    <form className="editform" >
    <div className="form"><label className="registerlabel"> First Name: <input className="registerinput" type="text" id="1" onChange= {handleChange}/></label></div>
    <div className="form"><label className="registerlabel">Last Name: <input className="registerinput" type="text" id="2" onChange= {handleChange}/></label></div>
    <div className="form"><label className="registerlabel"> old Password:<input className="registerinput" type="password"  id="3" onChange= {handleChange}/></label></div>
    <div className="form"><label className="registerlabel"> new Password:<input className="registerinput" type="password"  id="4" onChange= {handleChange}/></label></div>
    <div className="form"><label className="registerlabel"> Confirm password:<input className="registerinput" type="password"  id="5" onChange= {handleChange}/></label></div>
    <div className="form"><label className="registerlabel"> Profile Picture <input className="registerinput" type="file" id="6" onChange= {handleImage}/></label></div>
    <div className="form"><input className="submit" type="submit" onClick={handleSubmit}  value="Save changes" /></div>
</form>
<div className="picedit"> <img src={img} className="ppedit" alt="profilepic" />
<button className="cancel" onClick={handleCancel}>cancel</button>
<button className="upload" onClick={handleUpload}>Upload</button>
<h1 className="editDisp">{disp}</h1>
</div>
</div>
   )
}
export default Editdetail;