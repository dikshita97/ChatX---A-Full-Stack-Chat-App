import {React, useState, useEffect} from 'react'
import styled from 'styled-components';
import Robot from "../assets/robot.gif"

function Welcome(){
    const [username, setUsername] = useState(undefined);

    useEffect(() => {
        const changeUsername = async () => {
            if(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)){
                setUsername(
                    await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)).username
                )
            }
        };
        changeUsername();
    },[])

    return (
        <>
            {username && (
                <Container>
                    <img src={Robot} alt="robot" />
                    <h1>Welcome, <span>{username}</span></h1>
                    <h3>Start chatting with your friends</h3>
                </Container>
            )}
            
        </>
    );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;

export default Welcome;