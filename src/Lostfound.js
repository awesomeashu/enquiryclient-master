import { useState , useEffect } from "react";
import {Buffer} from 'buffer';
import { useNavigate } from "react-router-dom";
import {useCookies} from "react-cookie";
import './lostfound.css';

function Lostfound(props)
{
    const navigate=useNavigate();
    const [window, setWindow]=useState(1);
    const [data, setData]=useState(Array(11).fill(""));
    const [img, setImg]=useState(props.img);
    const [disp, setDisp] =useState("");
    const [imgCh, setImgCh]=useState(0);
    const [imgfile, setImgfile]=useState("");
    const [list, setList]=useState("");
    const [det, setDetail]=useState("");
    const [itemimg, setItemImg]=useState();
    const [cookies, setCookie,removeCookie]=useCookies(['enquiryUser']);

    useEffect(()=>{handlelist()},[]);

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
        var file= document.getElementById("4").files[0];
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
        var reset=data;
        reset[1]="";
        reset[2]="";
        reset[3]="";
        reset[4]="";
        setData(reset);
        setImgCh(0);
        setImgfile("");
        document.getElementById("1").value="";
        document.getElementById("2").value="";
        document.getElementById("3").value="";
        document.getElementById("4").value="";
        setDisp("");
    }
    async function handlelist()
    {
        let output={
                begin:data[8],
                end:data[9],
                id:data[10]
        }
        console.log(output);
        fetch(`/getitem`, {
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
                .then((res)=>{
                    if(res.status===200)
                     {   
                        return res.json();
                    }
                    else if(res.status===469)
                    {
                        navigate("/");
                    }
                    else
                    {
                        return "";
                    }
                })
                .then((data)=>{
                    console.log(data);
                    setList(data);})
    }
    function handleInspect(event)
    {
        let output={
            id: list[parseInt(event.target.id)]._id
        }
    console.log(output);
    fetch(`/getitemDetail`, {
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
            .then((res)=>{
                if(res.status===200)
                 {   
                    res.json().then((data)=>{
                        console.log(data);
                        const image=Buffer.from(data.image).toString();
                        setItemImg(image);
                        setDetail([<br/>," Name: "+data.itemname,<br/>," ",<br/>," Location: "+data.location,<br/>," ",<br/>," Date: "+data.date,<br/>," ",<br/>," Description: "+data.description])
                    }) 
                }
                else if(res.status===469)
                {
                    navigate("/");
                }
                else
                {
                    setDetail("Error occured in server");
                    setItemImg("");
                    console.log(det);
                }
            })
    }

    async function handleUpload(e)
    {
        e.preventDefault();
        if(data[1]==="")
        {
            setDisp("name is missing");
        }
        else if(data[2]==="")
        {
            setDisp("Location is missing");
        }
        else if(data[3]==="")
        {
            setDisp("Description is missing");
        }
        else if(imgCh===0)
        {
            setDisp("Please provide item Image ");
        }
       else
       {
        let output={
            itemname: data[1],
            location: data[2],
            description: data[3],
            bin:imgfile
            }
        
            console.log(output);
            fetch(`/additem`, {
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
                        handleCancel();
                        setDisp("update was successful");
                    }
                    else if(res.status===469)
                    {
                        navigate("/");
                    }
                    else
                    {
                        setDisp("Error occured in server");
                    }
                })
        }
    }
     function handleWindow(props)
    {
        if(window===2)
        {
           
            return(
                <div>
                    <form className="itemform" >
                    <div className="form"><label className="registerlabel"> Name: <input className="registerinput" type="text" id="1" onChange= {handleChange}/></label></div>
                    <div className="form"><label className="registerlabel">Location: <input className="registerinput" type="text" id="2" onChange= {handleChange}/></label></div>
                    <div className="form"><label className="registerlabel">Description: <input className="registerinput" type="text" id="3" onChange= {handleChange}/></label></div>
                    <div className="form"><label className="registerlabel"> Item image <input className="registerinput" type="file" id="4" onChange= {handleImage}/></label></div>
                    </form>
                    <div className="picedit"> <img src={img} className="itemimg" alt="Item_image" />
                    <button className="cancel" onClick={handleCancel}>cancel</button>
                    <button className="upload" onClick={handleUpload}>Upload</button>
                    <h1 className="editDisp">{disp}</h1>
                    </div>
                </div>
            )
        }
        else 
        {
            if(list==="")
            {
                return;
            }
            return(
                <div className="lostlookup">
                <div className="displaylost">
                    {
                        list.map((element,index) => (
                            <div className="displayitem">
                                <h4 className="lostname">&nbsp;&nbsp;&nbsp;ID:&nbsp;{element._id}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Found on:&nbsp;{element.date} &nbsp;</h4>
                                <button className="lostinspect" id={index} onClick={handleInspect}>Inspect</button>
                                <button className="lostdelete">delete</button>
                            </div>
                         ))
                     }
                </div>
                <div className="imagelost">
                    <img src={itemimg} className="foundimg" alt="found_image" />
                    <p className="founddetails">{det}</p>
                </div>
                </div>
            )
        }
    }
    function handleClick(event)
    {
        setWindow(parseInt(event.target.id)-5);
        if(window===2)
        {
            handleCancel()
        }
        else
        {
            handlelist()
        }
    }
    return(
        <div className="lostpage">
            <div className="lostbar">
                <h4 className="begin">Begin:</h4>
                <input className="begInp" id="8" type="date" onChange= {handleChange}></input>
                <h4 className="end">End:</h4>
                <input className="endInp" id="9" type="date" onChange= {handleChange}></input>
            <input className="finditem"  id="10" type="text" onChange= {handleChange}></input>
            <button className="lostsearch" id="6" onClick={handleClick}>Search</button>
            <button className="lostadd" id="7" onClick={handleClick}>Add item</button>
             </div>
            <div className="lostlowbar">
                {
                    handleWindow()
                }
            </div> 
        </div>
    )
}

export default Lostfound;