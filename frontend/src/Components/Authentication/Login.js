import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const handleShowPassword = () => setShowPassword(!showPassword);
    const handleLogIn = async () => {
        setLoading(true);
        if (!email || !password) {
            toast({
                title: 'Enter email & Password',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post("/api/user/login", { email, password },
                config
            );
            localStorage.setItem('user', JSON.stringify(data))
            setLoading(false);
            navigate('/chats');

        } catch (error) {
            toast({
                title: 'Something went wrong!',
                description: error.response.data.message,
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
            <FormControl id='email' isRequired>
                <FormLabel>
                    Email
                </FormLabel>
                <Input
                    placeholder="Enter your Email"
                    value={email}
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
                        value={password}
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
            <Button
                colorScheme='blue'
                width="100%"
                style={{ marginTop: 15 }}
                onClick={handleLogIn}
                isLoading={loading}
            >
                Login
            </Button>
            <Button
                colorScheme='red'
                width="100%"
                onClick={() => {
                    setEmail("guest@chatmingle.com");
                    setPassword("QWERTY123");
                }}
            >
                Login as Guest
            </Button>

        </VStack>
    )
}

export default Login
