import {React, useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import styled  from 'styled-components';
import Logo from '../assets/logo.svg';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios'
import {loginRoute} from '../utils/APIRoutes'


function Login(){
    // Navigation
    const navigate = useNavigate();

    // useState Variables
    const [values, setValues] = useState({
        username: "",
        password: "",
    });

    // Toast Options
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    // Use Effect on first render of the component
    useEffect(() => {
        // Check if user is logged in
        if(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)){
            navigate("/")
        }}
    ,[])  

    // Handle Submit
    const handleSubmit = async (event) => {
        event.preventDefault();
        if(handleValidation()){
            const {username, password} = values;
            const { data } = await axios.post(loginRoute, {username, password})
            if(data.status === true){
                localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY, JSON.stringify(data.user));
                navigate("/");
            }
            else if(data.status === false) {
                toast.error(data.message, toastOptions);
            }
        }
    
    }

    // Handle Validation
    const handleValidation = () => {
        const {username, password} = values;

        if(username === ""){
            toast.error("Username is Required!", toastOptions);
            return false;
        }
        if(password === ""){
            toast.error("Password is Required!", toastOptions);
            return false;
        }

        return true;
    }

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    return(
        <>
            <FormContainer>
                <form action="" onSubmit={handleSubmit}>
                    <div className="brand">
                        <img src={Logo} alt="Chat X" />
                        <h1>Chat X</h1>
                    </div>
                    <input type="text" placeholder="Username" name="username" onChange={handleChange} min = "3"/>
                    <input type="password" placeholder="Password" name="password" onChange={handleChange} />
                    <button type="submit">Login</button>
                    <span>Don't have an account? <Link to="/register">Register</Link></span>
                </form>
            </FormContainer>
            <ToastContainer /> 
        </>
    )
};

const FormContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    background-color: #131324;

    .brand {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        img {
            height: 5rem;
        }
        h1 {
            color: white;
            text-transform: uppercase;
        }
    }
    
    form {
        display: flex;
        width: 30rem;
        flex-direction: column;
        gap: 2rem;
        background-color: #00000076;
        border-radius: 2rem;
        padding: 3rem 5rem;

        input {
            background-color: transparent;
            padding: 1rem;
            border: 0.1rem solid #4e0eff;
            border-radius: 0.4rem;
            color: white;
            width: 100%;
            font-size: 1rem;
            &:focus {
                border: 0.1rem solid #997af0;
                outline: none;
            }
        }
        
        button {
            background-color: #4e0eff;
            color: white;
            padding: 1rem 2rem;
            border: none;
            font-weight: bold;
            cursor: pointer;
            border-radius: 0.4rem;
            font-size: 1rem;
            text-transform: uppercase;
            &:hover {
                background-color: #997af0;
            }
        }

        span {
            color: white;
            text-transform: uppercase;
            a {
                color: #4e0eff;
                text-decoration: none;
                font-weight: bold;
            }
        }
    }
`;

export default Login;