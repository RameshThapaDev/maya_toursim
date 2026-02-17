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
  title: "",
  duration_days: "",
  difficulty: "",
  summary: "",
  overview: "",
  theme: "",
  image: "",
  video_url: "",
  inclusions: "",
  exclusions: "",
  itinerary: "",
  faq: ""
};

export default function AdminToursPage() {
  const router = useRouter();
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState({ type: null, id: null });
  const cancelRef = useRef();

  const loadItems = async () => {
    const res = await fetch("/api/admin/tours");
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
    const url = form.id ? `/api/admin/tours/${form.id}` : "/api/admin/tours";
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
      title: form.id ? "Tour updated" : "Tour created",
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
      title: item.title,
      duration_days: item.duration_days,
      difficulty: item.difficulty || "",
      summary: item.summary || "",
      overview: item.overview || "",
      theme: Array.isArray(item.theme) ? item.theme.join(", ") : "",
      image: item.image || "",
      video_url: item.video_url || "",
      inclusions: Array.isArray(item.inclusions) ? item.inclusions.join(", ") : "",
      exclusions: Array.isArray(item.exclusions) ? item.exclusions.join(", ") : "",
      itinerary: item.itinerary ? JSON.stringify(item.itinerary, null, 2) : "",
      faq: item.faq ? JSON.stringify(item.faq, null, 2) : ""
    });
  };

  const handleDelete = async (id) => {
    setConfirm({ type: "delete", id });
  };

  const handleConfirmedDelete = async () => {
    if (!confirm.id) return;
    const id = confirm.id;
    const res = await fetch(`/api/admin/tours/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast({
        title: "Tour deleted",
        status: "success",
        duration: 2500,
        isClosable: true
      });
      loadItems();
    }
    setConfirm({ type: null, id: null });
  };

  return (
    <AdminShell title="Manage tours">
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
                  <FormLabel>Title</FormLabel>
                  <Input name="title" value={form.title} onChange={handleChange} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Duration (days)</FormLabel>
                  <Input name="duration_days" type="number" value={form.duration_days} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Difficulty</FormLabel>
                  <Input name="difficulty" value={form.difficulty} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Theme (comma separated)</FormLabel>
                  <Input name="theme" value={form.theme} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Image URL</FormLabel>
                  <Input name="image" value={form.image} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Video URL</FormLabel>
                  <Input name="video_url" value={form.video_url} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Summary</FormLabel>
                  <Input name="summary" value={form.summary} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Overview</FormLabel>
                  <Textarea name="overview" value={form.overview} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Inclusions (comma separated)</FormLabel>
                  <Input name="inclusions" value={form.inclusions} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Exclusions (comma separated)</FormLabel>
                  <Input name="exclusions" value={form.exclusions} onChange={handleChange} />
                </FormControl>
              </SimpleGrid>
              <FormControl>
                <FormLabel>Itinerary (JSON array)</FormLabel>
                <Textarea name="itinerary" value={form.itinerary} onChange={handleChange} rows={6} />
              </FormControl>
              <FormControl>
                <FormLabel>FAQ (JSON array)</FormLabel>
                <Textarea name="faq" value={form.faq} onChange={handleChange} rows={6} />
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
              { header: "Title", accessor: "title" },
              { header: "Duration", accessor: "duration_days" },
              { header: "Difficulty", accessor: "difficulty" },
              { header: "Video", accessor: "video_url" },
              { header: "Slug", accessor: "slug" },
              { header: "Created", accessor: "createdAt" }
            ]}
            searchKeys={["title", "slug", "difficulty", "video_url"]}
            filterKey="difficulty"
            filterLabel="Difficulty"
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyText="No tours found."
          />

          <AlertDialog
            isOpen={Boolean(confirm.type)}
            leastDestructiveRef={cancelRef}
            onClose={() => setConfirm({ type: null, id: null })}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  {confirm.type === "delete" ? "Delete tour" : "Confirm changes"}
                </AlertDialogHeader>
                <AlertDialogBody>
                  {confirm.type === "delete"
                    ? "Are you sure you want to delete this tour?"
                    : "Save these tour changes?"}
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
