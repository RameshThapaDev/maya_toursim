"use client";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  useToast
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "../../components/admin/AdminShell";
import AdminCrudTable from "../../components/admin/AdminCrudTable";

const emptyForm = {
  id: null,
  slug: "",
  name: "",
  best_time: "",
  description: "",
  highlights: "",
  image: "",
  weather_info: "",
  seasonal_info: "",
  travel_tips: "",
  transport_info: "",
  accommodations: ""
};

export default function AdminDestinationsPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const toast = useToast();
  const [confirm, setConfirm] = useState({ type: null, id: null });
  const cancelRef = useRef();

  const loadItems = async () => {
    const res = await fetch("/api/admin/destinations");
    const data = await res.json();
    setItems(data.items || []);
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.user || data.user.role !== "admin") {
          router.push("/login");
          return;
        }
        loadItems();
      })
      .catch(() => router.push("/login"));
  }, [router]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setConfirm({ type: form.id ? "update" : "create", id: null });
  };

  const handleConfirmedSubmit = async () => {
    setError("");
    const payload = {
      ...form,
      highlights: form.highlights
        ? form.highlights.split(",").map((item) => item.trim()).filter(Boolean)
        : [],
      accommodations: form.accommodations
        ? form.accommodations.split(",").map((item) => item.trim()).filter(Boolean)
        : []
    };
    const method = form.id ? "PATCH" : "POST";
    const url = form.id ? `/api/admin/destinations/${form.id}` : "/api/admin/destinations";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.message || "Save failed.");
      setConfirm({ type: null, id: null });
      return;
    }
    setForm(emptyForm);
    loadItems();
    toast({
      title: form.id ? "Destination updated" : "Destination created",
      status: "success",
      duration: 2500,
      isClosable: true
    });
    setConfirm({ type: null, id: null });
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      slug: item.slug,
      name: item.name,
      best_time: item.best_time || "",
      description: item.description || "",
      highlights: Array.isArray(item.highlights) ? item.highlights.join(", ") : "",
      image: item.image || "",
      weather_info: item.weather_info || "",
      seasonal_info: item.seasonal_info || "",
      travel_tips: item.travel_tips || "",
      transport_info: item.transport_info || "",
      accommodations: Array.isArray(item.accommodations) ? item.accommodations.join(", ") : ""
    });
  };

  const handleDelete = async (id) => {
    setConfirm({ type: "delete", id });
  };

  const handleConfirmedDelete = async () => {
    if (!confirm.id) return;
    const id = confirm.id;
    const res = await fetch(`/api/admin/destinations/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast({
        title: "Destination deleted",
        status: "success",
        duration: 2500,
        isClosable: true
      });
      loadItems();
    }
    setConfirm({ type: null, id: null });
  };

  return (
    <AdminShell title="Manage destinations">
      <Box>
        <Container maxW="6xl" px={0}>
          <Box as="form" onSubmit={handleSubmit} bg="white" p={5} borderRadius="xl" boxShadow="md" mb={8}>
            <Stack spacing={4}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Slug</FormLabel>
                  <Input name="slug" value={form.slug} onChange={handleChange} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input name="name" value={form.name} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Best time</FormLabel>
                  <Input name="best_time" value={form.best_time} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Image URL</FormLabel>
                  <Input name="image" value={form.image} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Highlights (comma separated)</FormLabel>
                  <Input name="highlights" value={form.highlights} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Accommodation listings (comma separated)</FormLabel>
                  <Input name="accommodations" value={form.accommodations} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea name="description" value={form.description} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Weather info</FormLabel>
                  <Textarea name="weather_info" value={form.weather_info} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Seasonal info</FormLabel>
                  <Textarea name="seasonal_info" value={form.seasonal_info} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Travel tips</FormLabel>
                  <Textarea name="travel_tips" value={form.travel_tips} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Transportation info</FormLabel>
                  <Textarea name="transport_info" value={form.transport_info} onChange={handleChange} />
                </FormControl>
              </SimpleGrid>
              {error && <Text color="red.500">{error}</Text>}
              <Button type="submit" colorScheme="green" borderRadius="full">
                {form.id ? "Update" : "Create"}
              </Button>
            </Stack>
          </Box>

          <AdminCrudTable
            rows={items.map((item) => ({
              ...item,
              createdAt: item.created_at
                ? new Date(item.created_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
                : "-"
            }))}
            columns={[
              { header: "Name", accessor: "name" },
              { header: "Best time", accessor: "best_time" },
              { header: "Slug", accessor: "slug" },
              { header: "Created", accessor: "createdAt" }
            ]}
            searchKeys={["name", "best_time", "slug"]}
            filterKey="best_time"
            filterLabel="Best time"
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyText="No destinations found."
          />

          <AlertDialog
            isOpen={Boolean(confirm.type)}
            leastDestructiveRef={cancelRef}
            onClose={() => setConfirm({ type: null, id: null })}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  {confirm.type === "delete" ? "Delete destination" : "Confirm changes"}
                </AlertDialogHeader>
                <AlertDialogBody>
                  {confirm.type === "delete"
                    ? "Are you sure you want to delete this destination?"
                    : "Save these destination changes?"}
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={() => setConfirm({ type: null, id: null })}>
                    Cancel
                  </Button>
                  <Button
                    colorScheme="green"
                    ml={3}
                    onClick={confirm.type === "delete" ? handleConfirmedDelete : handleConfirmedSubmit}
                  >
                    Confirm
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Container>
      </Box>
    </AdminShell>
  );
}
