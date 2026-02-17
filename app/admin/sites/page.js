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
  destination_slug: "",
  slug: "",
  name: "",
  summary: "",
  details: "",
  qr_data: "",
  image: ""
};

export default function AdminSitesPage() {
  const router = useRouter();
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState({ type: null, id: null });
  const cancelRef = useRef();

  const loadItems = async () => {
    const res = await fetch("/api/admin/sites");
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
    const url = form.id ? `/api/admin/sites/${form.id}` : "/api/admin/sites";
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
      title: form.id ? "Site updated" : "Site created",
      status: "success",
      duration: 2500,
      isClosable: true
    });
    setConfirm({ type: null, id: null });
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      destination_slug: item.destination_slug,
      slug: item.slug,
      name: item.name,
      summary: item.summary || "",
      details: item.details || "",
      qr_data: item.qr_data || "",
      image: item.image || ""
    });
  };

  const handleDelete = async (id) => {
    setConfirm({ type: "delete", id });
  };

  const handleConfirmedDelete = async () => {
    if (!confirm.id) return;
    const id = confirm.id;
    const res = await fetch(`/api/admin/sites/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast({
        title: "Site deleted",
        status: "success",
        duration: 2500,
        isClosable: true
      });
      loadItems();
    }
    setConfirm({ type: null, id: null });
  };

  return (
    <AdminShell title="Manage tourist sites">
      <Box>
        <Container maxW="6xl" px={0}>
          <Box as="form" onSubmit={handleSubmit} bg="white" p={5} borderRadius="xl" boxShadow="md" mb={8}>
            <Stack spacing={4}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Destination slug</FormLabel>
                  <Input name="destination_slug" value={form.destination_slug} onChange={handleChange} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Site slug</FormLabel>
                  <Input name="slug" value={form.slug} onChange={handleChange} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Site name</FormLabel>
                  <Input name="name" value={form.name} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Image URL</FormLabel>
                  <Input name="image" value={form.image} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>QR data (URL)</FormLabel>
                  <Input name="qr_data" value={form.qr_data} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Summary</FormLabel>
                  <Input name="summary" value={form.summary} onChange={handleChange} />
                </FormControl>
              </SimpleGrid>
              <FormControl>
                <FormLabel>Details</FormLabel>
                <Textarea name="details" value={form.details} onChange={handleChange} rows={5} />
              </FormControl>
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
              { header: "Site", accessor: "name" },
              { header: "Destination", accessor: "destination_slug" },
              { header: "Slug", accessor: "slug" },
              { header: "QR data", accessor: "qr_data" },
              { header: "Created", accessor: "createdAt" }
            ]}
            searchKeys={["name", "slug", "destination_slug"]}
            filterKey="destination_slug"
            filterLabel="Destination"
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyText="No tourist sites found."
          />

          <AlertDialog
            isOpen={Boolean(confirm.type)}
            leastDestructiveRef={cancelRef}
            onClose={() => setConfirm({ type: null, id: null })}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  {confirm.type === "delete" ? "Delete site" : "Confirm changes"}
                </AlertDialogHeader>
                <AlertDialogBody>
                  {confirm.type === "delete"
                    ? "Are you sure you want to delete this site?"
                    : "Save these site changes?"}
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
