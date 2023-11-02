import { ViewIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import UserListItem from '../UserAvatar/UserListItem';
import axios from 'axios';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState();
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);
    const toast = useToast();

    const { selectedChat, setSelectedChat, user } = ChatState();

    const handleRemove = async (removeUser) => {
        if (selectedChat.groupAdmin._id !== user._id && removeUser._id == user._id) {
            toast({
                title: 'Only Admin Can remove someone',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    "Authorization": `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(`/api/chat/group-remove`, {
                chatId: selectedChat._id,
                userId: removeUser._id,
            }, config);
            removeUser._id === user._id ? setSelectedChat(): setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
            
        } catch (error) {
            
        }

    }
    const handleAddUser = async (newGroupUser) => {
        if (selectedChat.users.find((u) => u._id === newGroupUser._id)) {
            toast({
                title: 'User Already in Group',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            return;
        }
        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: 'Only Admin Can add Users',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    "Authorization": `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(`/api/chat/group-add`, {
                chatId: selectedChat._id,
                userId: newGroupUser._id,
            }, config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            setLoading(false);

        }

    }


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


    const handleRename = async () => {
        if (!groupChatName) {
            toast({
                title: 'Enter Chat Name',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            return;
        }
        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    "Authorization": `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.put("/api/chat/rename", {
                chatId: selectedChat._id,
                chatName: groupChatName
            },
                config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);

        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            setRenameLoading(false);
            setGroupChatName("");


        }

    }
    return (
        <>
            <IconButton onClick={onOpen} display={{ base: "flex" }} icon={<ViewIcon />}>Open Modal</IconButton>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                    >{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box w="100%" display="flex" flexWrap="wrap" pb={3} >
                            {selectedChat.users.map((user) => (
                                <UserBadgeItem key={user._id} user={user} handleFunction={() => handleRemove(user)} />
                            ))}
                        </Box>
                        <FormControl display="flex">
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant="solid"
                                colorScheme="teal"
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl >
                            <Input
                                placeholder="Chat Members"
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
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
                                    (user) => <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
                                )
                            )
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={() => handleRemove(user)} colorScheme='red'>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal
