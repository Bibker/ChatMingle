import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [pic, setPic] = useState();

    const handleShowPassword = () => setShowPassword(!showPassword)
    const handleUploadPicture= () => {

    }
    const handleCreateAccount= () => {

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
             style={{marginTop:15}}
             onClick={handleCreateAccount}
            >Create Account</Button>

        </VStack>
    )
}

export default SignUp
