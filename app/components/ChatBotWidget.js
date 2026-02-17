"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  Stack,
  Text
} from "@chakra-ui/react";

const quickReplies = [
  "Best time to visit Bhutan?",
  "Do I need a visa?",
  "Show top tours",
  "SDF / daily tariff",
  "Contact support"
];

async function fetchReply(messages) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages })
  });
  if (!response.ok) {
    throw new Error("AI request failed");
  }
  const data = await response.json();
  return data.reply;
}

export default function ChatBotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "bot",
      text: "Hi! I’m your Bhutan trip assistant. How can I help?"
    }
  ]);

  const canSend = input.trim().length > 0;

  const handleSend = async (value) => {
    const content = value.trim();
    if (!content) return;
    if (loading) return;
    const userMessage = { id: Date.now(), role: "user", text: content };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    const history = [
      ...messages.map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.text
      })),
      { role: "user", content }
    ];
    try {
      const replyText = await fetchReply(history);
      const reply = { id: Date.now() + 1, role: "bot", text: replyText };
      setMessages((prev) => [...prev, reply]);
    } catch (error) {
      const fallback = {
        id: Date.now() + 1,
        role: "bot",
        text: "Sorry, the assistant is unavailable right now. Please try again or use the contact form."
      };
      setMessages((prev) => [...prev, fallback]);
    } finally {
      setLoading(false);
    }
  };

  const reversed = useMemo(() => [...messages].reverse(), [messages]);

  return (
    <Box position="fixed" bottom={{ base: 4, md: 6 }} right={{ base: 4, md: 6 }} zIndex={50}>
      {!open && (
        <Button
          colorScheme="green"
          borderRadius="full"
          onClick={() => setOpen(true)}
          boxShadow="lg"
        >
          Chat with us
        </Button>
      )}
      {open && (
        <Box
          w={{ base: "92vw", sm: "380px" }}
          bg="white"
          borderRadius="2xl"
          boxShadow="2xl"
          border="1px solid"
          borderColor="blackAlpha.100"
          overflow="hidden"
        >
          <Flex bg="green.700" color="white" px={4} py={3} align="center" justify="space-between">
            <Box>
              <Text fontWeight="600">Maya Bliss Assistant</Text>
              <HStack spacing={2}>
                <Badge colorScheme="green" variant="subtle">
                  Online
                </Badge>
                <Text fontSize="xs" color="whiteAlpha.800">
                  AI-guided
                </Text>
              </HStack>
            </Box>
            <IconButton
              aria-label="Close chat"
              size="sm"
              variant="ghost"
              color="white"
              onClick={() => setOpen(false)}
              icon={<span aria-hidden="true">✕</span>}
            />
          </Flex>

          <Stack spacing={3} px={4} py={3} maxH="360px" overflowY="auto">
            {reversed.map((message) => (
              <Flex key={message.id} justify={message.role === "user" ? "flex-end" : "flex-start"}>
                <Box
                  bg={message.role === "user" ? "green.600" : "gray.100"}
                  color={message.role === "user" ? "white" : "blackAlpha.800"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  maxW="80%"
                  fontSize="sm"
                >
                  {message.text}
                </Box>
              </Flex>
            ))}
          </Stack>

          <Box px={4} pb={3}>
            <HStack spacing={2} mb={2} flexWrap="wrap">
              {quickReplies.map((reply) => (
                <Button
                  key={reply}
                  size="xs"
                  variant="outline"
                  borderRadius="full"
                  onClick={() => handleSend(reply)}
                >
                  {reply}
                </Button>
              ))}
            </HStack>
            <HStack spacing={2}>
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about Bhutan travel..."
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleSend(input);
                }}
              />
              <Button colorScheme="green" onClick={() => handleSend(input)} isDisabled={!canSend} isLoading={loading}>
                Send
              </Button>
            </HStack>
            <Text fontSize="xs" color="blackAlpha.600" mt={2}>
              Demo assistant. For bookings, use the inquiry form.
            </Text>
          </Box>
        </Box>
      )}
    </Box>
  );
}
