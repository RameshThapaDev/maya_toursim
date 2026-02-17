"use client";

import {
  Box,
  Button,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Link,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  Avatar,
  Badge,
  useDisclosure
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Tours", href: "/tours" },
  { label: "Hotels", href: "/hotels" },
  { label: "Guides", href: "/guides" },
  { label: "Vehicles", href: "/vehicles" },
  { label: "Destinations", href: "/destinations" },
  { label: "Travel Info", href: "/travel-info" },
  { label: "About", href: "/about" }
];

const iconMap = {
  Home: (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 10v9h14v-9" />
    </svg>
  ),
  Tours: (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h6a3 3 0 1 1 0 6H8a3 3 0 0 0 0 6h8" />
      <path d="M18 18l2 2-2 2" />
    </svg>
  ),
  Hotels: (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 10h18" />
      <path d="M5 10V6h14v4" />
      <path d="M5 20v-7h14v7" />
    </svg>
  ),
  Guides: (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  ),
  Vehicles: (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 13l2-5h14l2 5" />
      <path d="M5 13h14v6H5z" />
      <circle cx="7" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
    </svg>
  ),
  Destinations: (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3z" />
      <path d="M9 3v15" />
      <path d="M15 6v15" />
    </svg>
  ),
  "Travel Info": (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16v16H4z" />
      <path d="M8 8h8" />
      <path d="M8 12h8" />
      <path d="M8 16h5" />
    </svg>
  ),
  About: (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  )
};

const MenuIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export default function SiteLayout({ children }) {
  const [user, setUser] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("idle");
  const {
    isOpen: isNavOpen,
    onOpen: onNavOpen,
    onClose: onNavClose
  } = useDisclosure();
  const {
    isOpen: isProfileOpen,
    onOpen: onProfileOpen,
    onClose: onProfileClose
  } = useDisclosure();

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          setUser(data.user || null);
          if (data.user) {
            const key = `login-activity-${data.user.id || data.user.email}`;
            if (!sessionStorage.getItem(key)) {
              fetch("/api/auth/activity", { method: "POST" }).catch(() => null);
              sessionStorage.setItem(key, "1");
            }
          }
        }
      })
      .catch(() => {
        if (active) {
          setUser(null);
        }
      });
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          setNotificationCount(data.count || 0);
        }
      })
      .catch(() => {
        if (active) {
          setNotificationCount(0);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  const handleNewsletterSubmit = async (event) => {
    event.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail.trim() })
      });
      if (res.ok) {
        setNewsletterEmail("");
        setNewsletterStatus("success");
      } else {
        setNewsletterStatus("error");
      }
    } catch (error) {
      setNewsletterStatus("error");
    }
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Box
        position="sticky"
        top="0"
        zIndex="10"
        bg="white"
        borderBottom="1px solid"
        borderColor="blackAlpha.100"
      >
        <Container maxW="6xl" py={{ base: 3, md: 4 }}>
          <Flex align="center" justify="space-between" gap={4}>
            <HStack spacing={3}>
              <IconButton
                aria-label="Open navigation"
                icon={<MenuIcon />}
                variant="outline"
                borderRadius="full"
                onClick={onNavOpen}
                display={{ base: "inline-flex", md: "none" }}
              />
              <Text
                fontSize="lg"
                fontWeight="600"
                fontFamily="heading"
                letterSpacing="0.04em"
              >
                Maya Bliss Tours
              </Text>
            </HStack>
            <HStack spacing={6} display={{ base: "none", md: "flex" }} fontSize="sm" color="blackAlpha.700">
              {(user?.role === "admin" ? [{ label: "Admin", href: "/admin" }] : navLinks).map((link) => (
                <Link as={NextLink} key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </HStack>
            <HStack spacing={3} w={{ base: "auto", md: "auto" }}>
              {!user && (
                <>
                  <Button as={NextLink} href="/login" variant="ghost" borderRadius="full">
                    Login
                  </Button>
                  <Button as={NextLink} href="/register" variant="outline" borderRadius="full">
                    Register
                  </Button>
                </>
              )}
              {user && (
                <>
                  <Menu placement="bottom-end">
                    <MenuButton
                      as={IconButton}
                      aria-label="Profile menu"
                      variant="ghost"
                      borderRadius="full"
                      display={{ base: "none", md: "inline-flex" }}
                      icon={
                        <Box position="relative">
                          <Avatar size="sm" name={user.name} />
                          {notificationCount > 0 && (
                            <Badge
                              position="absolute"
                              top="-6px"
                              right="-6px"
                              bg="red.500"
                              color="white"
                              borderRadius="full"
                              px={2}
                              fontSize="0.65rem"
                            >
                              {notificationCount}
                            </Badge>
                          )}
                        </Box>
                      }
                    />
                    <MenuList>
                      <MenuItem isDisabled>
                        {user.name} · {user.role}
                      </MenuItem>
                      <MenuItem as={NextLink} href="/profile">
                        My Profile
                      </MenuItem>
                      <MenuItem as={NextLink} href="/notifications">
                        Notifications{notificationCount > 0 ? ` (${notificationCount})` : ""}
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </MenuList>
                  </Menu>
                  <IconButton
                    aria-label="Open profile"
                    variant="ghost"
                    borderRadius="full"
                    onClick={onProfileOpen}
                    display={{ base: "inline-flex", md: "none" }}
                    icon={
                      <Box position="relative">
                        <Avatar size="sm" name={user.name} />
                        {notificationCount > 0 && (
                          <Badge
                            position="absolute"
                            top="-6px"
                            right="-6px"
                            bg="red.500"
                            color="white"
                            borderRadius="full"
                            px={2}
                            fontSize="0.65rem"
                          >
                            {notificationCount}
                          </Badge>
                        )}
                      </Box>
                    }
                  />
                </>
              )}
              <Button
                as={NextLink}
                href="/contact"
                colorScheme="green"
                bg="forest.600"
                color="white"
                borderRadius="full"
                w={{ base: "full", md: "auto" }}
                display={{ base: "none", md: "inline-flex" }}
              >
                Plan Your Trip
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Box flex="1">{children}</Box>

      <Box borderTop="1px solid" borderColor="blackAlpha.200" bg="gray.900" color="white">
        <Container maxW="6xl" py={12}>
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={10}
            justify="space-between"
          >
            <Box maxW="360px">
              <Text fontFamily="heading" fontSize="xl" mb={2}>
                Maya Bliss Tours
              </Text>
              <Text fontSize="sm" color="whiteAlpha.800">
                Curated Bhutan journeys led by local guides, crafted for mindful travelers
                seeking culture, nature, and balance.
              </Text>
              <Stack mt={5} spacing={3}>
                <Text fontSize="sm" fontWeight="600">
                  Join the travel journal
                </Text>
                <Box as="form" onSubmit={handleNewsletterSubmit}>
                  <HStack
                    bg="whiteAlpha.200"
                    borderRadius="full"
                    p={1}
                    border="1px solid"
                    borderColor="whiteAlpha.300"
                  >
                    <Input
                      type="email"
                      placeholder="Email address"
                      variant="unstyled"
                      px={4}
                      color="white"
                      value={newsletterEmail}
                      onChange={(event) => setNewsletterEmail(event.target.value)}
                      _placeholder={{ color: "whiteAlpha.600" }}
                    />
                    <Button
                      type="submit"
                      colorScheme="green"
                      bg="forest.600"
                      color="white"
                      borderRadius="full"
                      size="sm"
                      isLoading={newsletterStatus === "loading"}
                    >
                      Subscribe
                    </Button>
                  </HStack>
                </Box>
                {newsletterStatus === "success" && (
                  <Text fontSize="xs" color="green.200">
                    Thanks for subscribing!
                  </Text>
                )}
                {newsletterStatus === "error" && (
                  <Text fontSize="xs" color="red.200">
                    Could not subscribe. Try again.
                  </Text>
                )}
              </Stack>
              <HStack spacing={3} mt={4}>
                <Button
                  as="a"
                  href="https://wa.me/9752555010"
                  target="_blank"
                  rel="noreferrer"
                  colorScheme="green"
                  bg="forest.600"
                  color="white"
                  borderRadius="full"
                >
                  WhatsApp
                </Button>
                <Button
                  as={NextLink}
                  href="/contact"
                  variant="outline"
                  borderRadius="full"
                  borderColor="whiteAlpha.300"
                  color="white"
                  _hover={{ bg: "whiteAlpha.200" }}
                >
                  Plan a trip
                </Button>
              </HStack>
            </Box>
            <HStack spacing={12} align="flex-start" flexWrap="wrap">
              <Box>
                <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.2em" color="whiteAlpha.600">
                  Contact
                </Text>
                <Text fontSize="sm" color="whiteAlpha.900">hello@himalayanblisstours.com</Text>
                <Text fontSize="sm" color="whiteAlpha.800">+975 2 555 010</Text>
                <Text fontSize="sm" color="whiteAlpha.800">WhatsApp: +975 2 555 010</Text>
              </Box>
              <Box>
                <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.2em" color="whiteAlpha.600">
                  Visit
                </Text>
                <Text fontSize="sm" color="whiteAlpha.800">Thimphu, Bhutan</Text>
                <Text fontSize="sm" color="whiteAlpha.800">Open daily, 9:00–18:00</Text>
              </Box>
              <Box maxW="220px">
                <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.2em" color="whiteAlpha.600">
                  Bhutan Tourism
                </Text>
                <Text fontSize="sm" color="whiteAlpha.800">
                  Travel supports conservation and Gross National Happiness initiatives.
                </Text>
                <HStack spacing={3} mt={4}>
                  <Link href="https://instagram.com" isExternal aria-label="Instagram" color="whiteAlpha.700">
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17" cy="7" r="1.2" fill="currentColor" />
                    </svg>
                  </Link>
                  <Link href="https://facebook.com" isExternal aria-label="Facebook" color="whiteAlpha.700">
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M13 22v-8h3l1-4h-4V7c0-1.2.6-2 2-2h2V2h-3c-3 0-5 2-5 5v3H6v4h3v8h4z" />
                    </svg>
                  </Link>
                  <Link href="https://twitter.com" isExternal aria-label="Twitter" color="whiteAlpha.700">
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M19 3h3l-7 8 8 10h-6l-5-6-6 6H1l8-8-8-10h6l5 6 6-6z" />
                    </svg>
                  </Link>
                </HStack>
              </Box>
            </HStack>
          </Stack>
          <Flex
            mt={10}
            pt={6}
            borderTop="1px solid"
            borderColor="whiteAlpha.200"
            justify="space-between"
            align={{ base: "flex-start", md: "center" }}
            direction={{ base: "column", md: "row" }}
            gap={3}
            fontSize="xs"
            color="whiteAlpha.700"
          >
            <Text>© 2026 Maya Bliss Tours. All rights reserved.</Text>
            <HStack spacing={4}>
              <Link as={NextLink} href="/travel-info" color="whiteAlpha.800">
                Travel Info
              </Link>
              <Link as={NextLink} href="/about" color="whiteAlpha.800">
                About
              </Link>
              <Link as={NextLink} href="/contact" color="whiteAlpha.800">
                Contact
              </Link>
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Drawer isOpen={isNavOpen} placement="left" onClose={onNavClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottom="1px solid" borderColor="blackAlpha.100" px={6} py={5}>
            <Box
              bg="linear-gradient(135deg, #1f4d3a 0%, #3a7f61 100%)"
              color="white"
              borderRadius="xl"
              p={4}
            >
              <Text fontWeight="600" fontFamily="heading">
                Maya Bliss Tours
              </Text>
              <Text fontSize="xs" color="whiteAlpha.800">
                Explore Bhutan
              </Text>
            </Box>
          </DrawerHeader>
          <DrawerBody>
            <Stack spacing={2} mb={6} pt={4}>
              {(user?.role === "admin" ? [{ label: "Admin Dashboard", href: "/admin" }] : navLinks).map((link) => (
                <Button
                  key={link.href}
                  as={NextLink}
                  href={link.href}
                  variant="ghost"
                  justifyContent="flex-start"
                  gap={3}
                  leftIcon={
                    <Box
                      bg="green.50"
                      color="green.700"
                      w="32px"
                      h="32px"
                      borderRadius="full"
                      display="inline-flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {iconMap[link.label] || iconMap.Home}
                    </Box>
                  }
                  borderRadius="lg"
                  _hover={{ bg: "green.50", color: "green.800" }}
                  onClick={onNavClose}
                >
                  {link.label}
                </Button>
              ))}
            </Stack>
            <Button
              as={NextLink}
              href="/contact"
              colorScheme="green"
              bg="forest.600"
              color="white"
              borderRadius="full"
              w="full"
              onClick={onNavClose}
            >
              Plan Your Trip
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Drawer isOpen={isProfileOpen} placement="right" onClose={onProfileClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottom="1px solid" borderColor="blackAlpha.100">
            Profile
          </DrawerHeader>
          <DrawerBody>
            {!user && (
              <Stack spacing={3} pt={4}>
                <Button as={NextLink} href="/login" variant="outline" borderRadius="full" onClick={onProfileClose}>
                  Login
                </Button>
                <Button as={NextLink} href="/register" variant="outline" borderRadius="full" onClick={onProfileClose}>
                  Register
                </Button>
              </Stack>
            )}
            {user && (
              <Stack spacing={3} pt={4}>
                <Flex align="center" gap={3}>
                  <Avatar size="md" name={user.name} />
                  <Box>
                    <Text fontWeight="600">{user.name}</Text>
                    <Text fontSize="sm" color="blackAlpha.600">
                      {user.role}
                    </Text>
                  </Box>
                </Flex>
                <Button as={NextLink} href="/profile" variant="ghost" borderRadius="lg" onClick={onProfileClose}>
                  My Profile
                </Button>
                <Button as={NextLink} href="/notifications" variant="ghost" borderRadius="lg" onClick={onProfileClose}>
                  <HStack spacing={2}>
                    <Text>Notifications</Text>
                    {notificationCount > 0 && (
                      <Badge colorScheme="red" borderRadius="full">
                        {notificationCount}
                      </Badge>
                    )}
                  </HStack>
                </Button>
                <Button onClick={() => { handleLogout(); onProfileClose(); }} variant="outline" borderRadius="full">
                  Logout
                </Button>
              </Stack>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
