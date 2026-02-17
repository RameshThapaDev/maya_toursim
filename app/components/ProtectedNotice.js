"use client";

import { Box, Button, Text } from "@chakra-ui/react";
import NextLink from "next/link";

export default function ProtectedNotice() {
  return (
    <Box textAlign="center" py={10}>
      <Text mb={4}>You must be logged in to access this page.</Text>
      <Button as={NextLink} href="/login" colorScheme="green" borderRadius="full">
        Go to login
      </Button>
    </Box>
  );
}
