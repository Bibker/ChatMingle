import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [pic, setPic] = useState("https://icon-library.com/images/admin-user-icon/admin-user-icon-4.jpg");
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate= useNavigate();


    const handleShowPassword = () => setShowPassword(!showPassword)

    const handleUploadPicture = (pic) => {
        setLoading(true);
        if (pic === undefined) {
            toast({
                title: 'Please Select Image.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:"top"

            });
            return;
        }

        if (pic.type === "image/jpeg" || pic.type === "image/png") {
            setPicToBase(pic);
            console.log(pic);
        }
        else {
            toast({
                title: 'Please Select Image.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:"top"

            });
            setLoading(false);
            return;
        }

    }

    const setPicToBase = (pic)=> {
        const reader= new FileReader();
        reader.readAsDataURL(pic);
        reader.onloadend= ()=> {
            setPic(reader.result);
            setLoading(false);
            console.log(`Reader Result: ${reader.result}`);
        }
    }
    const handleCreateAccount = async () => {
        setLoading(true);
        if(!name || !email || !password || !confirmPassword)
        {
            toast({
                title: 'Please Enter All Fields',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:"top"
            });
            setLoading(false);
            return;
        }

        if(password!==confirmPassword){
            toast({
                title: 'Password do not match',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:"top"
            });
            setLoading(false);
            return;
        }

        try {
            const config= {
                headers: {
                    "Content-type":"application/json",
                },
            };
            const {data} = await axios.post("/api/user", {name, email, password, pic},
            config
            );
            toast({
                title: 'Account Created!',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            localStorage.setItem('user',JSON.stringify(data))
            setLoading(false);
            navigate('/chats');

        } catch (error) {
            toast({
                title: 'Something went wrong!',
                description:error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            setLoading(false);
            
        }


    }

    return (
        <VStack spacing='5px'>
            <FormControl id='first-name' isRequired>
                <FormLabel>
                    Name
                </FormLabel>
                <Input
                    placeholder="Enter your Name"
                    onChange={(e) => setName(e.target.value)
                    }>
                </Input>
            </FormControl>
            <FormControl id='email' isRequired>
                <FormLabel>
                    Email
                </FormLabel>
                <Input
                    placeholder="Enter your Email"
                    onChange={(e) => setEmail(e.target.value)
                    }>
                </Input>
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>
                    Password
                </FormLabel>
                <InputGroup>
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Password"
                        onChange={(e) => setPassword(e.target.value)
                        } />
                    <InputRightElement>
                        <Button h="1.75rem" size="sm" onClick={handleShowPassword}>
                            {showPassword ? "Hide" : "Show"}

                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='confirm-password' isRequired>
                <FormLabel>
                    Confirm Password
                </FormLabel>
                <InputGroup>
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        onChange={(e) => setConfirmPassword(e.target.value)
                        } />
                </InputGroup>
            </FormControl>
            <FormControl id='profile-picture'>
                <FormLabel>
                    Upload your Picture
                </FormLabel>
                <Input
                    type="file"
                    p={1.5}
                    accept="image/*"
                    onChange={(e) => handleUploadPicture(e.target.files[0])
                    }>
                </Input>
            </FormControl>
            <Button
                colorScheme='blue'
                width="100%"
                style={{ marginTop: 15 }}
                onClick={handleCreateAccount}
                isLoading={loading}
            >Create Account</Button>

        </VStack>
    )
}

export default SignUp
