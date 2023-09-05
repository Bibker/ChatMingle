import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'

const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const handleShowPassword = () => setShowPassword(!showPassword);
    const handleLogIn = () => {

    }

    return (
        <VStack spacing='5px'>
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
            <Button
                colorScheme='blue'
                width="100%"
                style={{ marginTop: 15 }}
                onClick={handleLogIn}
            >
               Login
            </Button>
            <Button
                colorScheme='red'
                width="100%"
                onClick={()=>{
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
