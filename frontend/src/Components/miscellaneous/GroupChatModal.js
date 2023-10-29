import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from "../../Context/ChatProvider"
import axios from 'axios';
import _ from 'lodash';
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from '../UserAvatar/UserBadgeItem';



const GroupChatModal = ({ children }) => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          "Authorization": `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);

    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: "Failed to Load Search Results",
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "top"
      });

    }

  }

  const handleDelete = (deletedUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== deletedUser._id));
  };

  const handleSubmit = async() => {
    if(!groupChatName || !selectedUsers)
    {
      toast({
        title: 'Please Fill all fields.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "top"
      });
      return;
    }

    try {
      const config = {
        headers: {
          "Authorization": `Bearer ${user.token}`,
        },
      };

      const {data} = await axios.post('/api/chat/group', {
        name: groupChatName,
        users:JSON.stringify(selectedUsers.map((user) => user._id))
      }, config);
      setChats([data, ...chats]);
      onClose();
      toast({
        title: 'New Group Chat Created.',
        status: 'warning',
        duration: "success",
        duration: 5000,
        isClosable: true,
        position: "top"
      });
      
      
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: "Failed to Create new Group",
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "top"
      });

      
    }

  }

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: 'User already added!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "top"
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);



  }

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Chat Members"
                mb={1}
                onChange={_.debounce((e) => handleSearch(e.target.value), 300)}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map(user => (
                <UserBadgeItem key={user._id} user={user} handleFunction={() => handleDelete(user)} />
              ))}
            </Box>
            {loading ? <Spinner
              mt='4'
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='lg'

            /> :
              (searchResult?.slice(0, 4)
                .map(
                  (user) => <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                )
              )
            }
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal
