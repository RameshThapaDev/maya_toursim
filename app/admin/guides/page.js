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
  region: "",
  specialty: "",
  summary: "",
  image: "",
  price_per_day: ""
};

export default function AdminGuidesPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const toast = useToast();
  const [confirm, setConfirm] = useState({ type: null, id: null });
  const cancelRef = useRef();

  const loadItems = async () => {
    const res = await fetch("/api/admin/guides");
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
    const method = form.id ? "PATCH" : "POST";
    const url = form.id ? `/api/admin/guides/${form.id}` : "/api/admin/guides";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
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
      title: form.id ? "Guide updated" : "Guide created",
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
      region: item.region || "",
      specialty: item.specialty || "",
      summary: item.summary || "",
      image: item.image || "",
      price_per_day: item.price_per_day ?? ""
    });
  };

  const handleDelete = async (id) => {
    setConfirm({ type: "delete", id });
  };

  const handleConfirmedDelete = async () => {
    if (!confirm.id) return;
    const id = confirm.id;
    const res = await fetch(`/api/admin/guides/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast({
        title: "Guide deleted",
        status: "success",
        duration: 2500,
        isClosable: true
      });
      loadItems();
    }
    setConfirm({ type: null, id: null });
  };

  return (
    <AdminShell title="Manage guides">
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
                  <FormLabel>Region</FormLabel>
                  <Input name="region" value={form.region} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Specialty</FormLabel>
                  <Input name="specialty" value={form.specialty} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Image URL</FormLabel>
                  <Input name="image" value={form.image} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Price per day</FormLabel>
                  <Input name="price_per_day" type="number" value={form.price_per_day} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Summary</FormLabel>
                  <Input name="summary" value={form.summary} onChange={handleChange} />
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
              { header: "Region", accessor: "region" },
              { header: "Specialty", accessor: "specialty" },
              { header: "Price/day", accessor: "price_per_day" },
              { header: "Slug", accessor: "slug" },
              { header: "Created", accessor: "createdAt" }
            ]}
            searchKeys={["name", "region", "specialty", "slug"]}
            filterKey="region"
            filterLabel="Region"
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyText="No guides found."
          />

          <AlertDialog
            isOpen={Boolean(confirm.type)}
            leastDestructiveRef={cancelRef}
            onClose={() => setConfirm({ type: null, id: null })}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  {confirm.type === "delete" ? "Delete guide" : "Confirm changes"}
                </AlertDialogHeader>
                <AlertDialogBody>
                  {confirm.type === "delete"
                    ? "Are you sure you want to delete this guide?"
                    : "Save these guide changes?"}
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
