"use client";

import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  Stack,
  Text
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function ReviewSection({ targetType, targetSlug }) {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ rating: "", comment: "" });
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [canReview, setCanReview] = useState(false);
  const [eligibilityReason, setEligibilityReason] = useState("");

  const loadReviews = async () => {
    const response = await fetch(`/api/reviews?targetType=${targetType}&targetSlug=${targetSlug}`);
    const data = await response.json();
    setReviews(data.reviews || []);
  };

  useEffect(() => {
    loadReviews();
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user || null))
      .catch(() => setUser(null));
    fetch(`/api/reviews/eligibility?targetType=${targetType}&targetSlug=${targetSlug}`)
      .then((res) => res.json())
      .then((data) => {
        setCanReview(Boolean(data.canReview));
        setEligibilityReason(data.reason || "");
      })
      .catch(() => {
        setCanReview(false);
        setEligibilityReason("error");
      });
  }, [targetType, targetSlug]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType,
          targetSlug,
          rating: form.rating,
          comment: form.comment
        })
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Unable to save review.");
        setStatus("error");
        return;
      }
      setForm({ rating: "", comment: "" });
      setStatus("success");
      setMessage("Thanks for your feedback!");
      loadReviews();
    } catch (error) {
      setStatus("error");
      setMessage("Unable to save review.");
    }
  };

  const averageRating = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <Box bg="white" borderRadius="2xl" p={5} boxShadow="sm">
      <Stack spacing={4}>
        <HStack spacing={3} align="center">
          <Text fontWeight="600">Guest ratings</Text>
          <Badge colorScheme="green">{averageRating} / 5</Badge>
          <Text fontSize="sm" color="blackAlpha.600">
            {reviews.length} review{reviews.length === 1 ? "" : "s"}
          </Text>
        </HStack>

        <Stack spacing={3}>
          {reviews.length === 0 && (
            <Text fontSize="sm" color="blackAlpha.600">
              Be the first to leave a review.
            </Text>
          )}
          {reviews.map((review) => (
            <Box key={review.id} borderTop="1px solid" borderColor="blackAlpha.100" pt={3}>
              <HStack spacing={3} mb={1}>
                <Badge colorScheme="green">{review.rating} / 5</Badge>
                <Text fontWeight="600" fontSize="sm">
                  {review.name}
                </Text>
              </HStack>
              <Text fontSize="sm" color="blackAlpha.700">
                {review.comment || "No comment provided."}
              </Text>
            </Box>
          ))}
        </Stack>

        {!user && (
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            Log in to leave a rating and comment.
          </Alert>
        )}

        {user && !canReview && (
          <Alert status="warning" borderRadius="md">
            <AlertIcon />
            Only travelers with completed bookings can leave reviews.
          </Alert>
        )}

        {user && canReview && (
          <Box as="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <FormControl isRequired>
                <FormLabel>Rating</FormLabel>
                <Select name="rating" value={form.rating} onChange={handleChange} placeholder="Select rating">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Comment</FormLabel>
                <Input
                  name="comment"
                  value={form.comment}
                  onChange={handleChange}
                  placeholder="Share your experience"
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="green"
                bg="forest.600"
                color="white"
                borderRadius="full"
                isLoading={status === "loading"}
              >
                Submit review
              </Button>
              {message && (
                <Alert status={status === "error" ? "error" : "success"} borderRadius="md">
                  <AlertIcon />
                  {message}
                </Alert>
              )}
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
