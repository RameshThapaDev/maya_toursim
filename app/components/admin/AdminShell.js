"use client";

import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Stack,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import NextLink from "next/link";

const MenuIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const adminNav = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  { label: "Tours", href: "/admin/tours", icon: "route" },
  { label: "Hotels", href: "/admin/hotels", icon: "home" },
  { label: "Guides", href: "/admin/guides", icon: "user" },
  { label: "Vehicles", href: "/admin/vehicles", icon: "car" },
  { label: "Destinations", href: "/admin/destinations", icon: "map" },
  { label: "Tourist Sites", href: "/admin/sites", icon: "pin" },
  { label: "Charges", href: "/admin/charges", icon: "wallet" },
  { label: "Payments", href: "/admin/payments", icon: "card" },
  { label: "Emails", href: "/admin/emails", icon: "mail" },
  { label: "Analytics", href: "/admin/analytics", icon: "chart" }
];

const iconMap = {
  dashboard: (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  route: (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h6a3 3 0 1 1 0 6H8a3 3 0 0 0 0 6h8" />
      <path d="M18 18l2 2-2 2" />
    </svg>
  ),
  home: (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 10v9h14v-9" />
    </svg>
  ),
  user: (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  ),
  car: (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 13l2-5h14l2 5" />
      <path d="M5 13h14v6H5z" />
      <circle cx="7" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
    </svg>
  ),
  card: (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <path d="M6 15h6" />
    </svg>
  ),
  wallet: (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 7h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H3z" />
      <path d="M3 7V6a2 2 0 0 1 2-2h12" />
      <circle cx="17" cy="12" r="1" />
    </svg>
  ),
  map: (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3z" />
      <path d="M9 3v15" />
      <path d="M15 6v15" />
    </svg>
  ),
  pin: (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  mail: (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16v12H4z" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  ),
  chart: (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3v18h18" />
      <path d="M7 14l3-3 4 4 5-6" />
    </svg>
  )
};

export default function AdminShell({ title, children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const NavLinks = () => (
    <Stack spacing={1} fontSize="sm" color="blackAlpha.700">
      {adminNav.map((item) => (
        <Button
          key={item.href}
          as={NextLink}
          href={item.href}
          variant="ghost"
          justifyContent="flex-start"
          gap={3}
          leftIcon={iconMap[item.icon]}
          borderRadius="lg"
          _hover={{ bg: "green.50", color: "green.800" }}
        >
          {item.label}
        </Button>
      ))}
    </Stack>
  );

  return (
    <Flex minH="100vh" bg="gray.50">
      <Box
        display={{ base: "none", md: "block" }}
        w="240px"
        borderRight="1px solid"
        borderColor="blackAlpha.100"
        bg="white"
        px={5}
        py={6}
      >
        <Box
          bg="linear-gradient(135deg, #1f4d3a 0%, #3a7f61 100%)"
          color="white"
          borderRadius="xl"
          p={4}
          mb={6}
        >
          <Text fontWeight="600" fontFamily="heading">
            Maya Bliss
          </Text>
          <Text fontSize="xs" color="whiteAlpha.800">
            Admin dashboard
          </Text>
        </Box>
        <NavLinks />
      </Box>

      <Box flex="1" px={{ base: 4, md: 8 }} py={{ base: 6, md: 10 }}>
        <Flex align="center" justify="space-between" mb={6}>
          <Flex align="center" gap={3}>
            <IconButton
              aria-label="Open admin menu"
              icon={<MenuIcon />}
              display={{ base: "inline-flex", md: "none" }}
              onClick={onOpen}
              variant="outline"
            />
            <Text fontSize="xl" fontFamily="heading" fontWeight="600">
              {title}
            </Text>
          </Flex>
          <Button
            as={NextLink}
            href="/"
            variant="outline"
            borderRadius="full"
            size="sm"
          >
            Switch to Website
          </Button>
        </Flex>
        <Box
          bg="white"
          borderRadius="2xl"
          border="1px solid"
          borderColor="blackAlpha.100"
          p={{ base: 4, md: 6 }}
          boxShadow="sm"
        >
          {children}
        </Box>
      </Box>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Admin Menu</DrawerHeader>
          <DrawerBody>
            <NavLinks />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}
