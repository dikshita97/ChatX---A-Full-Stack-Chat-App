import {React, useState, useEffect, useRef} from 'react'
import styled from 'styled-components';
import Logout from './Logout';
import ChatInput from './ChatInput';
import { sendMsgRoute, getAllMsgsRoute } from '../utils/APIRoutes';
import axios from 'axios';
import {v4 as uuidv4} from 'uuid'

function ChatContainer({currentChat, currentUser, socket}) {
    const scrollRef = useRef();
    const [msgs, setMsgs] = useState([]);
    const [arrivalMsg, setArrivalMsg] = useState(null);

    useEffect(() => {
        const getMessages = async () => {
            const response = await axios.post(getAllMsgsRoute, {
                from: currentUser._id,
                to: currentChat._id
            });
            setMsgs(response.data);
        };
        getMessages();
    }, [currentChat])

    const handleSendMessage = async (msg) => {
        await axios.post(sendMsgRoute, {
            from: currentUser._id,
            to: currentChat._id,
            message: msg,
        })

        // Send Msgs using socket
        socket.current.emit("send-msg", {
            to: currentChat._id,
            from: currentUser._id,
            message: msg,
        })
        
        // Destructure msgs and append it into the msg
        const messages = [...msgs];
        messages.push({fromSelf: true, message: msg});
        setMsgs(messages);
    }

    // Receive Messages
    useEffect(() => {
        if(socket.current){
            socket.current.on("msg-recieve", (msg) => {
                setArrivalMsg({fromSelf: false, message: msg})
            })
        }
    }, [])

    // Add Messages to the msg container
    useEffect(() => {
        if(arrivalMsg){
            setMsgs((prevMsgs) => [...prevMsgs, arrivalMsg]);
        }
    },[arrivalMsg])

    // Scoll Into view for new messages
    useEffect(() => {
        scrollRef.current?.scrollIntoView({behaviour: "smooth"})
    }, [msgs])



    return (
        <>
        {currentChat && 
        (
            <Container>
                <div className="chat-header">
                    <div className="user-details">
                        <div className="avatar">
                            <img
                            src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                            alt=""
                            />
                        </div>
                        <div className="username">
                            <h3>{currentChat.username}</h3>
                        </div>
                    </div>
                    <Logout/>
                </div>
                <div className="chat-messages">
                    {msgs.length && msgs.map((msg) => {
                        return(
                            <div ref = {scrollRef} key = {uuidv4()}>
                                <div className={`message ${msg.fromSelf ? "sended" : "recieved"}`}>
                                    <div className="content">
                                        <p>
                                            {msg.message}
                                        </p>
                                    </div>    
                                </div> 
                            </div>
                        )
                    })}
                </div>
                <ChatInput handleSendMessage = {handleSendMessage}/>
            </Container>
        )}
        </>
    )
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9F2B68;
      }
    }
  }
`;

export default ChatContainer;