"use client";

import {
  Badge,
  Box,
  Button,
  Flex,
  Input,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Stack,
  Text
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

function barChart(items, maxValue, color) {
  return (
    <svg viewBox="0 0 320 140" width="100%" height="180">
      {items.map((item, index) => {
        const barHeight = maxValue ? (item.total / maxValue) * 90 : 0;
        const x = 20 + index * 26;
        const y = 105 - barHeight;
        return (
          <g key={item.label}>
            <rect x={x} y={y} width="14" height={barHeight} fill={color} rx="3" />
            <text x={x + 7} y="125" textAnchor="middle" fontSize="9" fill="#666">
              {item.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function lineChart(items, maxValue, color) {
  const points = items
    .map((item, index) => {
      const x = 20 + index * 26;
      const y = 100 - (maxValue ? (item.total / maxValue) * 70 : 0);
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 320 140" width="100%" height="180">
      <polyline fill="none" stroke={color} strokeWidth="3" points={points} />
      {items.map((item, index) => {
        const x = 20 + index * 26;
        const y = 100 - (maxValue ? (item.total / maxValue) * 70 : 0);
        return (
          <g key={item.label}>
            <circle cx={x} cy={y} r="3" fill={color} />
            <text x={x} y="125" textAnchor="middle" fontSize="9" fill="#666">
              {item.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function AnalyticsClient({ initialData, defaultFrom, defaultTo }) {
  const [data, setData] = useState(initialData);
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/analytics?from=${from}&to=${to}`);
    const json = await res.json();
    if (json?.totals) {
      setData(json);
    }
    setLoading(false);
  };

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const statusCounts = useMemo(() => {
    const map = {};
    data.statusCounts?.forEach((row) => {
      map[row.status] = row.total;
    });
    return map;
  }, [data]);

  const maxDaily = Math.max(1, ...(data.dailyBookings || []).map((i) => i.total || 0));
  const maxMonthly = Math.max(1, ...(data.monthlyBookings || []).map((i) => i.total || 0));
  const maxUsers = Math.max(1, ...(data.usersMonthly || []).map((i) => i.total || 0));
  const maxReviews = Math.max(1, ...(data.reviewsMonthly || []).map((i) => i.total || 0));

  return (
    <Stack spacing={6}>
      <Flex gap={3} direction={{ base: "column", md: "row" }} align={{ md: "flex-end" }}>
        <Box>
          <Text fontSize="sm" color="blackAlpha.700" mb={1}>
            From
          </Text>
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </Box>
        <Box>
          <Text fontSize="sm" color="blackAlpha.700" mb={1}>
            To
          </Text>
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </Box>
        <Button colorScheme="green" borderRadius="full" onClick={load} isLoading={loading}>
          Apply range
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
        {[
          { label: "Inquiries", value: data.totals?.inquiries || 0 },
          { label: "Reviews", value: data.totals?.reviews || 0 },
          { label: "Emails", value: data.totals?.emails || 0 },
          { label: "Users", value: data.totals?.users || 0 }
        ].map((item) => (
          <Stat key={item.label} bg="white" borderRadius="lg" border="1px solid" borderColor="blackAlpha.100" p={4}>
            <StatLabel color="blackAlpha.600">{item.label}</StatLabel>
            <StatNumber>{item.value}</StatNumber>
          </Stat>
        ))}
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Box bg="white" borderRadius="lg" border="1px solid" borderColor="blackAlpha.100" p={5}>
          <Text fontWeight="600" mb={3}>Daily bookings</Text>
          {barChart(data.dailyBookings || [], maxDaily, "#4f8876")}
        </Box>
        <Box bg="white" borderRadius="lg" border="1px solid" borderColor="blackAlpha.100" p={5}>
          <Text fontWeight="600" mb={3}>Monthly bookings</Text>
          {barChart(data.monthlyBookings || [], maxMonthly, "#2a4f45")}
        </Box>
      </SimpleGrid>

      <Box bg="white" borderRadius="lg" border="1px solid" borderColor="blackAlpha.100" p={5}>
        <Text fontWeight="600" mb={3}>Inquiry funnel</Text>
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          {[
            { label: "Pending", value: statusCounts.pending || 0 },
            { label: "Confirmed", value: statusCounts.confirmed || 0 },
            { label: "Completed", value: statusCounts.completed || 0 },
            { label: "Canceled", value: statusCounts.canceled || 0 }
          ].map((item) => (
            <Box key={item.label} border="1px solid" borderColor="blackAlpha.100" borderRadius="lg" p={4}>
              <Text fontSize="sm" color="blackAlpha.600">{item.label}</Text>
              <Text fontSize="xl" fontWeight="700">{item.value}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Box bg="white" borderRadius="lg" border="1px solid" borderColor="blackAlpha.100" p={5}>
          <Text fontWeight="600" mb={3}>Top tours</Text>
          <Stack spacing={2}>
            {(data.topTours || []).map((row) => (
              <Flex key={row.label} justify="space-between">
                <Text fontSize="sm">{row.label}</Text>
                <Badge>{row.total}</Badge>
              </Flex>
            ))}
            {(data.topTours || []).length === 0 && <Text fontSize="sm" color="blackAlpha.600">No data</Text>}
          </Stack>
        </Box>
        <Box bg="white" borderRadius="lg" border="1px solid" borderColor="blackAlpha.100" p={5}>
          <Text fontWeight="600" mb={3}>Top hotels</Text>
          <Stack spacing={2}>
            {(data.topHotels || []).map((row) => (
              <Flex key={row.label} justify="space-between">
                <Text fontSize="sm">{row.label}</Text>
                <Badge>{row.total}</Badge>
              </Flex>
            ))}
            {(data.topHotels || []).length === 0 && <Text fontSize="sm" color="blackAlpha.600">No data</Text>}
          </Stack>
        </Box>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Box bg="white" borderRadius="lg" border="1px solid" borderColor="blackAlpha.100" p={5}>
          <Text fontWeight="600" mb={3}>Top guides</Text>
          <Stack spacing={2}>
            {(data.topGuides || []).map((row) => (
              <Flex key={row.label} justify="space-between">
                <Text fontSize="sm">{row.label}</Text>
                <Badge>{row.total}</Badge>
              </Flex>
            ))}
            {(data.topGuides || []).length === 0 && <Text fontSize="sm" color="blackAlpha.600">No data</Text>}
          </Stack>
        </Box>
        <Box bg="white" borderRadius="lg" border="1px solid" borderColor="blackAlpha.100" p={5}>
          <Text fontWeight="600" mb={3}>Top vehicles</Text>
          <Stack spacing={2}>
            {(data.topVehicles || []).map((row) => (
              <Flex key={row.label} justify="space-between">
                <Text fontSize="sm">{row.label}</Text>
                <Badge>{row.total}</Badge>
              </Flex>
            ))}
            {(data.topVehicles || []).length === 0 && <Text fontSize="sm" color="blackAlpha.600">No data</Text>}
          </Stack>
        </Box>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Box bg="white" borderRadius="lg" border="1px solid" borderColor="blackAlpha.100" p={5}>
          <Text fontWeight="600" mb={3}>New users</Text>
          {lineChart(data.usersMonthly || [], maxUsers, "#4f8876")}
        </Box>
        <Box bg="white" borderRadius="lg" border="1px solid" borderColor="blackAlpha.100" p={5}>
          <Text fontWeight="600" mb={3}>Reviews</Text>
          {lineChart(data.reviewsMonthly || [], maxReviews, "#2a4f45")}
        </Box>
      </SimpleGrid>

      <Box bg="white" borderRadius="lg" border="1px solid" borderColor="blackAlpha.100" p={5}>
        <Text fontWeight="600" mb={3}>Average rating by type</Text>
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          {(data.reviewAverages || []).map((row) => (
            <Box key={row.target_type} border="1px solid" borderColor="blackAlpha.100" borderRadius="lg" p={4}>
              <Text fontSize="sm" color="blackAlpha.600">{row.target_type}</Text>
              <Text fontSize="xl" fontWeight="700">{row.avg}</Text>
            </Box>
          ))}
          {(data.reviewAverages || []).length === 0 && (
            <Text fontSize="sm" color="blackAlpha.600">No data</Text>
          )}
        </SimpleGrid>
      </Box>
    </Stack>
  );
}
