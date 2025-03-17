import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Logo from '../assets/logoo.png';
import frontImage from '../assets/loginPage.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/ReactToastify.css';
import axios from 'axios';
import { sloginRoute } from '../utils/APIRoutes';

function SLogin() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: '',
    password: '',
  });

  const toastOptions = {
    position: 'bottom-right',
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
  };

  useEffect(() => {
    if (localStorage.getItem('seller-user')) navigate('/shome');
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateInputs()) {
      const { username, password } = values;
      const { data } = await axios.post(sloginRoute, { username, password });
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        console.log(data.userC);
        localStorage.setItem('seller-user', JSON.stringify(values));
        navigate('/shome');
      }
    }
  };

  const validateInputs = () => {
    const { username, password } = values;
    if (username.length === 0 || password.length === 0) {
      toast.error('Username and Password are required', toastOptions);
      return false;
    } else if (password.length < 8) {
      toast.error('Password should contain at least 8 characters', toastOptions);
      return false;
    }
    return true;
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <Container>
        <ImageContainer>
        <img src={frontImage} alt="Side Image" />
      </ImageContainer>
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <div className="brand">
            <img src={Logo} alt="Brand Logo" />
          </div>
          <input type="text" placeholder="Username" name="username" onChange={handleChange} />
          <input type="password" placeholder="Password" name="password" onChange={handleChange} />
          <button type="submit">Login</button>
          <span>
            Don't have an account? <Link to="/sregister">Register</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </Container>
  );
}

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
  justify-content: left;
  align-items: center;

  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background-color: white;
    border-radius: 1rem 1rem 0rem 1rem;
    padding: 3rem;
    box-shadow: 1rem 1rem 1rem rgba(51, 51, 51, 0.2);
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
  justify-content: right;
  align-items: center;
  img {
    width: 100%;
    height: 54vh;
    max-width: 500px;
    object-fit: cover;
    border-radius: 1rem 1rem 1rem 0rem;
    box-shadow: -1rem 1rem 1rem rgba(51, 51, 51, 0.2);
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

export default SLogin;
