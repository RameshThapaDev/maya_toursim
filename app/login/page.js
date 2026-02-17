"use client";

import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  HStack,
  Stack,
  Text
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Login failed.");
        setStatus("idle");
        return;
      }
      setStatus("success");
      router.push("/");
      router.refresh();
    } catch (err) {
      setError("Login failed.");
      setStatus("idle");
    }
  };

  return (
    <Box minH="100vh" bg="#f7f7f5" display="flex" flexDirection="column">
      <Container maxW="lg" py={{ base: 10, md: 12 }}>
        <Stack spacing={8} align="center">
          <Text
            as={NextLink}
            href="/"
            fontSize="xl"
            fontWeight="600"
            fontFamily="heading"
            letterSpacing="0.04em"
          >
            Maya Bliss Tours
          </Text>
          <Stack spacing={6} w="full">
            <Box textAlign="center">
              <Heading fontFamily="heading" size="xl">
                Welcome back
              </Heading>
              <Text color="blackAlpha.700" mt={2}>
                Log in to manage your trip planning details.
              </Text>
            </Box>
            <Box as="form" onSubmit={handleSubmit} bg="white" p={6} borderRadius="2xl" boxShadow="md">
              <Stack spacing={4}>
                <Stack spacing={3}>
                  <Button
                    as="a"
                    href="/api/auth/signin/google"
                    variant="outline"
                    borderRadius="full"
                    leftIcon={
                      <svg aria-hidden="true" viewBox="0 0 48 48" width="18" height="18">
                        <path
                          fill="#EA4335"
                          d="M24 9.5c3.3 0 6 1.3 8.1 3.3l5.6-5.6C34.2 4.1 29.5 2 24 2 14.6 2 6.6 7.4 3 15.2l6.7 5.2C11.4 14.1 17.2 9.5 24 9.5z"
                        />
                        <path
                          fill="#4285F4"
                          d="M46 24c0-1.6-.1-2.8-.4-4.2H24v8h12.4c-.5 3.2-2.3 6-5.2 7.8l7.9 6.1C43.4 37.8 46 31.5 46 24z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M9.7 28.4c-.5-1.4-.8-2.8-.8-4.4 0-1.5.3-3 .8-4.4L3 14.4C1.1 17.7 0 21.7 0 24c0 2.3 1.1 6.3 3 9.6l6.7-5.2z"
                        />
                        <path
                          fill="#34A853"
                          d="M24 46c6.5 0 12-2.1 16-5.8l-7.9-6.1c-2.2 1.5-5 2.4-8.1 2.4-6.8 0-12.6-4.6-14.6-10.9L3 33.6C6.6 40.6 14.6 46 24 46z"
                        />
                      </svg>
                    }
                  >
                    Continue with Google
                  </Button>
                  <Button
                    as="a"
                    href="/api/auth/signin/apple"
                    variant="outline"
                    borderRadius="full"
                    leftIcon={
                      <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <path d="M16.4 2.5c-1 .1-2.2.7-2.9 1.6-.6.7-1.1 1.8-.9 2.8 1.1.1 2.2-.6 2.9-1.5.6-.8 1-1.9.9-2.9z" />
                        <path d="M19.7 17.3c-.6 1.4-1.3 2.7-2.3 2.7-.9 0-1.2-.6-2.4-.6-1.1 0-1.6.6-2.4.6-1 0-1.7-1.1-2.3-2.4-1.2-2.7-1.3-5.8.3-7.6.9-1 2.1-1.6 3.4-1.6 1.1 0 2 .6 2.4.6.4 0 1.5-.7 2.8-.7 1 .1 2 .4 2.8 1.4-2.4 1.3-2 4.6.3 5.5z" />
                      </svg>
                    }
                  >
                    Continue with Apple
                  </Button>
                  <HStack>
                    <Divider />
                    <Text fontSize="xs" color="blackAlpha.600">
                      or use email
                    </Text>
                    <Divider />
                  </HStack>
                </Stack>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input name="email" type="email" value={form.email} onChange={handleChange} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input name="password" type="password" value={form.password} onChange={handleChange} />
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="green"
                  bg="forest.600"
                  color="white"
                  borderRadius="full"
                  isLoading={status === "loading"}
                >
                  Login
                </Button>
                <HStack justify="center">
                  <Text fontSize="sm" color="blackAlpha.600">
                    Don’t have an account?
                  </Text>
                  <Button as={NextLink} href="/register" size="sm" variant="link" colorScheme="green">
                    Register
                  </Button>
                </HStack>
                {error && (
                  <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    {error}
                  </Alert>
                )}
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
