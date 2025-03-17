import React ,{ useState,useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styled from "styled-components"
import Logo from"../assets/logoo.png"
import frontImage from "../assets/loginPage.png"
import {ToastContainer,toast} from "react-toastify"
import "react-toastify/ReactToastify.css"
import axios from "axios";
import { registerRoute } from '../utils/APIRoutes';
function Register() {


    const navigate = useNavigate()
    const[values,setvalues]=useState({
        username:"",
        email:"",
        password:"",
        confirmpassword:"",
    })


    const toastoptions={
        position: "bottom-right",
        autoclose: 4000,
        pauseOnHover: true,
        draggable: true,
    }

    useEffect(()=>{
        if(localStorage.getItem("student-user"))
            navigate('/home')
    },[])

    const clisubmission= async(event)=>{
        event.preventDefault();
        if(validentry()){
            // console.log("in Validation",registerRoute);
            const { password,username,email}=values;
            const {data}= await axios.post(registerRoute,{
                username,
                email,
                password,
            });
            if(data.status === false){
                toast.error(data.msg,toastoptions);
                console.log(data.msg);
            }
            if(data.status === true){
                localStorage.setItem("student-user",JSON.stringify(data.user))
                navigate("/home");
            }
           
        }
    };


 

    const validentry= ()=>{
        const { password,confirmpassword,username,email}=values;
        if(password!==confirmpassword){
            toast.error("Password and Confirm Password are not same",toastoptions);
            return false;
        }
        else if(username.length<4){
            toast.error("Username should contain atleast 4 letters",toastoptions);
            return false;
        }
        else if(password.length<8){
            toast.error("Password should contain atleast 8 letters",toastoptions);
            return false;
        }
        else if(email.length<11){
            toast.error("Enter valid E-Mail",toastoptions);
            return false;
        }
        else if(email.length>=11){
            const lastmail=email.substring(email.length-10,email.length);
            // console.log(`${lastmail}`);
            if(lastmail !="@gmail.com"){
                toast.error("Enter valid E-Mail",toastoptions);
                return false;
            }
        }
        return true;

    };

    const textchan= (event)=>{
        setvalues({...values,[event.target.name]:event.target.value})
    };
    return (
      <Container>
        <FormContainer>
          <form onSubmit={(event) => clisubmission(event)}>
            <div className="brand">
              <img src={Logo} alt="Brand Logo" />
            </div>
            <input type="text" placeholder="Username" name="username" onChange={(ev) => textchan(ev)} />
            <input type="email" placeholder="Email" name="email" onChange={(ev) => textchan(ev)} />
            <input type="password" placeholder="Password" name="password" onChange={(ev) => textchan(ev)} />
            <input type="password" placeholder="Confirm Password" name="confirmpassword" onChange={(ev) => textchan(ev)} />
            <button type="submit">Start</button>
            <span>
              Already have an account? <Link to="/login">Login</Link>
            </span>
          </form>
        </FormContainer>
        <ImageContainer>
          <img src={frontImage} alt="Side Image" />
        </ImageContainer>
        <ToastContainer />
      </Container>
    );
  };
  
  const Container = styled.div`
    display: flex;
    height: 100vh;
    width: 100vw;
    background-color: white;
  
    @media (max-width: 900px) {
      flex-direction: column;
    }
  `;
  
  const FormContainer = styled.div`
    display: flex;
    flex: 1;
    justify-content: right;
    align-items: center;
  
    form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      background-color: white;
      border-radius: 1rem 1rem 0rem 1rem;
      padding: 3rem;
      box-shadow: -1rem 1rem 1rem rgba(51, 51, 51, 0.2);
      width: 100%;
      max-width: 500px;
    }
  
    .brand {
      display: flex;
      justify-content: center;
      img {
         height: 3rem;
      margin-bottom: 5px;
        transform: scale(2);
      }
    }
  
    input {
      padding: 1rem;
      border: 0.1rem solid #0f72ea;
      border-radius: 0.4rem;
      font-size: 1rem;
      &:focus {
        border-color: #997af0;
        outline: none;
      }
    }
  
    button {
      background-color: #0f72ea;
      color: white;
      padding: 1rem;
      border: none;
      font-weight: bold;
      cursor: pointer;
      border-radius: 0.4rem;
      font-size: 1rem;
      text-transform: uppercase;
      &:hover {
        background-color: #0d5ed4;
      }
    }
  
    span {
      text-transform: uppercase;
      a {
        color: #0f72ea;
        text-decoration: none;
        font-weight: bold;
      }
    }
  `;
  
  const ImageContainer = styled.div`
    display: flex;
    flex: 1;
    justify-content: left;
    align-items: center;
    img {
      // z-index:-2;
      width: 100%;
      height: 74vh;
      max-width: 500px;
      object-fit: fill;
      border-radius: 1rem 1rem 1rem 0rem;
      box-shadow: 1rem 1rem 1rem rgba(51, 51, 51, 0.2);
    }
  
    @media (max-width: 900px) {
      display: none;
    }
  `;
  
  export default Register;
