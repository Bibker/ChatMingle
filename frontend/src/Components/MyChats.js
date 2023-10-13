import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';

const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      const {data} = await axios.get("/api/chat", config);
      console.log(data);
      setChats(data);
      
    } catch (error) {
      toast({
        title: 'Error Occured',
        description:"Failed to Load the Chats",
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "top"
    });
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("user")));
    fetchChats();
  }, []);

  return (
    <div>
      My Chats
    </div>
  )
}

export default MyChats
