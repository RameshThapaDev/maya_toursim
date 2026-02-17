import { getUserFromToken } from "../lib/auth";
import { getPool } from "../lib/db";
import { getToken } from "next-auth/jwt";
import SiteLayout from "../components/SiteLayout";
import {
  Avatar,
  Badge,
  Box,
  Container,
  Divider,
  HStack,
  Heading,
  SimpleGrid,
  Stack,
  Text
} from "@chakra-ui/react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import LoginActivityTable from "../components/profile/LoginActivityTable";

function normalizeUser(user, token) {
  if (user) return user;
  if (token) {
    return {
      id: token.id,
      name: token.name,
      email: token.email,
      role: token.role || "user"
    };
  }
  return null;
}

export default async function ProfilePage() {
  const user = getUserFromToken();
  const token = await getToken({
    req: { headers: Object.fromEntries(headers()) },
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET
  });
  const effectiveUser = normalizeUser(user, token);

  if (!effectiveUser) {
    redirect("/login");
  }

  const pool = getPool();
  const normalizedEmail = effectiveUser.email ? effectiveUser.email.toLowerCase() : null;
  let userRecord = null;
  if (normalizedEmail) {
    const result = await pool.query("SELECT id, name, email, role FROM users WHERE LOWER(email) = $1", [
      normalizedEmail
    ]);
    userRecord = result.rows[0];
  }

  if (normalizedEmail) {
    const recentActivity = await pool.query(
      "SELECT 1 FROM login_activity WHERE email = $1 AND created_at > NOW() - INTERVAL '1 hour' LIMIT 1",
      [normalizedEmail]
    );
    if (recentActivity.rowCount === 0) {
      const requestHeaders = headers();
      const forwardedFor = requestHeaders.get("x-forwarded-for");
      const ipAddress = forwardedFor ? forwardedFor.split(",")[0].trim() : requestHeaders.get("x-real-ip");
      const userAgent = requestHeaders.get("user-agent");
      const country = requestHeaders.get("x-vercel-ip-country") || requestHeaders.get("cf-ipcountry");
      const city = requestHeaders.get("x-vercel-ip-city");
      await pool.query(
        "INSERT INTO login_activity (user_id, email, ip_address, user_agent, country, city) VALUES ($1,$2,$3,$4,$5,$6)",
        [userRecord?.id || null, normalizedEmail, ipAddress || null, userAgent || null, country || null, city || null]
      );
    }
  }

  const activityResult = await pool.query(
    "SELECT ip_address, user_agent, country, city, created_at FROM login_activity WHERE email = $1 ORDER BY created_at DESC LIMIT 20",
    [normalizedEmail]
  );
  const activityRows = activityResult.rows.map((row, index) => ({
    id: `${row.created_at}-${index}`,
    createdAt: row.created_at,
    ip: row.ip_address,
    location: `${row.city ? `${row.city}, ` : ""}${row.country || "Unknown"}`,
    device: row.user_agent
  }));

  const bookingsResult = await pool.query(
    `SELECT id, tour_name, travel_date, status, created_at
     FROM booking_inquiries
     WHERE email = $1
     ORDER BY created_at DESC`,
    [normalizedEmail]
  );
  const bookingRows = bookingsResult.rows;

  return (
    <SiteLayout>
      <Box py={{ base: 10, md: 16 }}>
        <Container maxW="6xl">
          <Stack spacing={8}>
            <Box
              bg="linear-gradient(135deg, rgba(31,77,58,0.16) 0%, rgba(58,127,97,0.12) 100%)"
              borderRadius="3xl"
              p={{ base: 6, md: 10 }}
              border="1px solid"
              borderColor="green.100"
            >
              <HStack spacing={4} align="flex-start" flexWrap="wrap">
                <Avatar size="lg" name={userRecord?.name || effectiveUser.name} />
                <Stack spacing={2} flex="1">
                  <Text fontSize="xs" letterSpacing="0.2em" textTransform="uppercase" color="green.700">
                    Profile
                  </Text>
                  <Heading fontFamily="heading" size="lg">
                    {userRecord?.name || effectiveUser.name || "Traveler"}
                  </Heading>
                  <Text color="blackAlpha.700">{userRecord?.email || effectiveUser.email || "—"}</Text>
                  <Badge alignSelf="flex-start" colorScheme="green" variant="subtle">
                    {(userRecord?.role || effectiveUser.role) === "admin" ? "Administrator" : "Traveler"}
                  </Badge>
                </Stack>
              </HStack>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <Box bg="white" borderRadius="2xl" p={5} border="1px solid" borderColor="blackAlpha.100" boxShadow="sm">
                <Text fontSize="xs" letterSpacing="0.2em" textTransform="uppercase" color="blackAlpha.600">
                  Account
                </Text>
                <Text mt={2} fontWeight="600">
                  {userRecord?.name || effectiveUser.name || "—"}
                </Text>
                <Text fontSize="sm" color="blackAlpha.600">
                  {userRecord?.email || effectiveUser.email || "—"}
                </Text>
              </Box>
              <Box bg="white" borderRadius="2xl" p={5} border="1px solid" borderColor="blackAlpha.100" boxShadow="sm">
                <Text fontSize="xs" letterSpacing="0.2em" textTransform="uppercase" color="blackAlpha.600">
                  Role
                </Text>
                <Text mt={2} fontWeight="600">
                  {(userRecord?.role || effectiveUser.role) === "admin" ? "Admin access" : "Traveler access"}
                </Text>
                <Text fontSize="sm" color="blackAlpha.600">
                  Secure session active
                </Text>
              </Box>
              <Box bg="white" borderRadius="2xl" p={5} border="1px solid" borderColor="blackAlpha.100" boxShadow="sm">
                <Text fontSize="xs" letterSpacing="0.2em" textTransform="uppercase" color="blackAlpha.600">
                  Activity
                </Text>
                <Text mt={2} fontWeight="600">
                  {(userRecord?.role || effectiveUser.role) === "admin"
                    ? `${activityRows.length} recent logins`
                    : `${bookingRows.length} bookings`}
                </Text>
                <Text fontSize="sm" color="blackAlpha.600">
                  Updated moments ago
                </Text>
              </Box>
            </SimpleGrid>

            <Divider />

            {(userRecord?.role || effectiveUser.role) === "admin" ? (
              <Box bg="white" borderRadius="2xl" p={{ base: 5, md: 6 }} border="1px solid" borderColor="blackAlpha.100" boxShadow="sm">
                <Stack spacing={4}>
                  <Box>
                    <Text fontWeight="600">Login activity</Text>
                    <Text fontSize="sm" color="blackAlpha.600">
                      Recent sign-ins for this account.
                    </Text>
                  </Box>
                  <LoginActivityTable rows={activityRows} />
                </Stack>
              </Box>
            ) : (
              <Box bg="white" borderRadius="2xl" p={{ base: 5, md: 6 }} border="1px solid" borderColor="blackAlpha.100" boxShadow="sm">
                <Stack spacing={4}>
                  <Box>
                    <Text fontWeight="600">Your bookings</Text>
                    <Text fontSize="sm" color="blackAlpha.600">
                      Confirmed and upcoming journeys.
                    </Text>
                  </Box>
                  <Stack spacing={3}>
                    {bookingRows.map((row) => (
                      <Box
                        key={row.id}
                        border="1px solid"
                        borderColor="blackAlpha.100"
                        borderRadius="xl"
                        p={4}
                        bg="gray.50"
                      >
                        <HStack justify="space-between" flexWrap="wrap">
                          <Box>
                            <Text fontWeight="600">{row.tour_name || "Custom itinerary"}</Text>
                            <Text fontSize="sm" color="blackAlpha.600">
                              Date: {row.travel_date}
                            </Text>
                          </Box>
                          <Badge colorScheme={row.status === "confirmed" ? "green" : "orange"} textTransform="capitalize">
                            {row.status}
                          </Badge>
                        </HStack>
                      </Box>
                    ))}
                    {bookingRows.length === 0 && (
                      <Text color="blackAlpha.600">No bookings yet.</Text>
                    )}
                  </Stack>
                </Stack>
              </Box>
            )}
          </Stack>
        </Container>
      </Box>
    </SiteLayout>
  );
}
