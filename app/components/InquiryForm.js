"use client";

import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Progress,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const initialState = {
  name: "",
  email: "",
  travelers: "",
  date: "",
  notes: "",
  tourName: "",
  hotelName: "",
  guideName: "",
  vehicleName: "",
  documentType: "",
  documentName: "",
  documentData: "",
  paymentMethod: "",
  paymentReference: "",
  upiId: "",
  binancePayId: "",
  transportMode: "",
  preferredTimezone: ""
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_DOC_SIZE = 2 * 1024 * 1024;

export default function InquiryForm({ tourName, tours, hotels, guides, vehicles }) {
  const [form, setForm] = useState({
    ...initialState,
    tourName: tourName || ""
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [step, setStep] = useState(1);
  const [travelersDetails, setTravelersDetails] = useState([]);

  const [hotelOptions, setHotelOptions] = useState(hotels || []);
  const [guideOptions, setGuideOptions] = useState(guides || []);
  const [vehicleOptions, setVehicleOptions] = useState(vehicles || []);
  const [tourOptions, setTourOptions] = useState(tours || []);

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) {
        setForm((prev) => ({ ...prev, preferredTimezone: tz }));
      }
    } catch (error) {
      // ignore timezone detection failure
    }
    if (!tours) {
      fetch("/api/public/tours")
        .then((res) => res.json())
        .then((data) => setTourOptions(data.items || []))
        .catch(() => setTourOptions([]));
    }
    if (!hotels) {
      fetch("/api/public/hotels")
        .then((res) => res.json())
        .then((data) => setHotelOptions(data.items || []))
        .catch(() => setHotelOptions([]));
    }
    if (!guides) {
      fetch("/api/public/guides")
        .then((res) => res.json())
        .then((data) => setGuideOptions(data.items || []))
        .catch(() => setGuideOptions([]));
    }
    if (!vehicles) {
      fetch("/api/public/vehicles")
        .then((res) => res.json())
        .then((data) => setVehicleOptions(data.items || []))
        .catch(() => setVehicleOptions([]));
    }
  }, [tours, hotels, guides, vehicles]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTravelerChange = (index, field, value) => {
    setTravelersDetails((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setForm((prev) => ({ ...prev, documentName: "", documentData: "" }));
      return;
    }
    if (file.size > MAX_DOC_SIZE) {
      setErrors((prev) => ({
        ...prev,
        documentName: "Document must be 2 MB or smaller."
      }));
      setForm((prev) => ({ ...prev, documentName: "", documentData: "" }));
      return;
    }
    setErrors((prev) => ({ ...prev, documentName: "" }));
    setForm((prev) => ({ ...prev, documentName: file.name }));
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, documentData: reader.result || "" }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    if (form.email && !emailRegex.test(form.email))
      nextErrors.email = "Enter a valid email.";
    if (!form.travelers) nextErrors.travelers = "Number of travelers is required.";
    if (!form.date.trim()) nextErrors.date = "Preferred date is required.";
    if (tours && !form.tourName) nextErrors.tourName = "Please select a tour.";
    if (step >= 2) {
      travelersDetails.forEach((traveler, index) => {
        if (!traveler?.fullName) {
          nextErrors[`traveler_${index}`] = "Traveler name is required.";
        }
      });
      if (!form.documentType) nextErrors.documentType = "Document type is required.";
      if (!form.documentName) nextErrors.documentName = "Document upload is required.";
      if (form.documentData?.length > MAX_DOC_SIZE * 1.37) {
        nextErrors.documentName = "Document must be 2 MB or smaller.";
      }
    }
    if (step >= 3) {
      if (!form.paymentMethod) nextErrors.paymentMethod = "Select a payment method.";
    }
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("loading");
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tourName: tourName || form.tourName,
          travelersDetails
        })
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
      setForm({
        ...initialState,
        tourName: tourName || ""
      });
      setTravelersDetails([]);
      setStep(1);
    } catch (error) {
      setStatus("error");
    }
  };

  useEffect(() => {
    const count = Number(form.travelers || 0);
    if (!Number.isNaN(count) && count > 0) {
      setTravelersDetails((prev) => {
        if (prev.length === count) return prev;
        return Array.from({ length: count }).map((_, idx) => ({
          fullName: prev[idx]?.fullName || "",
          age: prev[idx]?.age || "",
          gender: prev[idx]?.gender || "",
          nationality: prev[idx]?.nationality || ""
        }));
      });
    }
  }, [form.travelers]);

  return (
    <Box as="form" onSubmit={handleSubmit} bg="white" p={6} borderRadius="2xl" boxShadow="md">
      <Stack spacing={4} mb={4}>
        <Text fontWeight="600">Step {step} of 3</Text>
        <Progress value={(step / 3) * 100} colorScheme="green" borderRadius="full" />
      </Stack>

      {step === 1 && (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {tourOptions.length > 0 && !tourName && (
          <FormControl isInvalid={errors.tourName} gridColumn={{ base: "auto", md: "1 / -1" }}>
            <FormLabel>Tour</FormLabel>
            <Select
              name="tourName"
              value={form.tourName}
              onChange={handleChange}
              placeholder="Select a tour"
            >
              {tourOptions.map((tour) => (
                <option key={tour.slug} value={tour.title}>
                  {tour.title}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.tourName}</FormErrorMessage>
          </FormControl>
        )}
        {hotelOptions.length > 0 && (
          <FormControl gridColumn={{ base: "auto", md: "1 / -1" }}>
            <FormLabel>Preferred hotel</FormLabel>
            <Select
              name="hotelName"
              value={form.hotelName}
              onChange={handleChange}
              placeholder="Select a hotel"
            >
              {hotelOptions.map((hotel) => (
                <option key={hotel.slug} value={hotel.name}>
                  {hotel.name} · {hotel.location}
                </option>
              ))}
            </Select>
          </FormControl>
        )}
        {guideOptions.length > 0 && (
          <FormControl gridColumn={{ base: "auto", md: "1 / -1" }}>
            <FormLabel>Preferred tour guide</FormLabel>
            <Select
              name="guideName"
              value={form.guideName}
              onChange={handleChange}
              placeholder="Select a guide"
            >
              {guideOptions.map((guide) => (
                <option key={guide.slug} value={guide.name}>
                  {guide.name} · {guide.specialty}
                </option>
              ))}
            </Select>
          </FormControl>
        )}
        {vehicleOptions.length > 0 && (
          <FormControl gridColumn={{ base: "auto", md: "1 / -1" }}>
            <FormLabel>Preferred vehicle</FormLabel>
            <Select
              name="vehicleName"
              value={form.vehicleName}
              onChange={handleChange}
              placeholder="Select a vehicle"
            >
              {vehicleOptions.map((vehicle) => (
                <option key={vehicle.slug} value={vehicle.name}>
                  {vehicle.name} · {vehicle.capacity} seats
                </option>
              ))}
            </Select>
          </FormControl>
        )}
        <FormControl gridColumn={{ base: "auto", md: "1 / -1" }}>
          <FormLabel>Bringing your own vehicle?</FormLabel>
          <Select
            name="transportMode"
            value={form.transportMode}
            onChange={handleChange}
            placeholder="Select an option"
          >
            <option value="none">No, need local transport</option>
            <option value="own-car">Yes, bringing own car</option>
            <option value="own-bike">Yes, bringing own bike</option>
          </Select>
        </FormControl>
        <FormControl isInvalid={errors.name}>
          <FormLabel>Full name</FormLabel>
          <Input name="name" value={form.name} onChange={handleChange} placeholder="Your name" />
          <FormErrorMessage>{errors.name}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.email}>
          <FormLabel>Email</FormLabel>
          <Input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@email.com"
          />
          <FormErrorMessage>{errors.email}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.travelers}>
          <FormLabel>Travelers</FormLabel>
          <Input
            name="travelers"
            type="number"
            min="1"
            value={form.travelers}
            onChange={handleChange}
            placeholder="2"
          />
          <FormErrorMessage>{errors.travelers}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.date}>
          <FormLabel>Preferred date</FormLabel>
          <Input name="date" value={form.date} onChange={handleChange} placeholder="April 2026" />
          <FormErrorMessage>{errors.date}</FormErrorMessage>
        </FormControl>
        <FormControl gridColumn={{ base: "auto", md: "1 / -1" }}>
          <FormLabel>Trip wishes</FormLabel>
          <Textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Tell us about your ideal journey."
          />
        </FormControl>
        </SimpleGrid>
      )}

      {step === 2 && (
        <Stack spacing={4}>
          <Text fontWeight="600">Traveler details</Text>
          {travelersDetails.map((traveler, index) => (
            <SimpleGrid key={index} columns={{ base: 1, md: 2 }} spacing={3} bg="sand.50" p={3} borderRadius="xl">
              <FormControl isInvalid={errors[`traveler_${index}`]}>
                <FormLabel>Full name</FormLabel>
                <Input
                  value={traveler.fullName}
                  onChange={(e) => handleTravelerChange(index, "fullName", e.target.value)}
                />
                <FormErrorMessage>{errors[`traveler_${index}`]}</FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel>Nationality</FormLabel>
                <Input
                  value={traveler.nationality}
                  onChange={(e) => handleTravelerChange(index, "nationality", e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Age</FormLabel>
                <Input
                  type="number"
                  value={traveler.age}
                  onChange={(e) => handleTravelerChange(index, "age", e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Gender</FormLabel>
                <Select
                  value={traveler.gender}
                  onChange={(e) => handleTravelerChange(index, "gender", e.target.value)}
                  placeholder="Select"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not">Prefer not to say</option>
                </Select>
              </FormControl>
            </SimpleGrid>
          ))}

          <Text fontWeight="600">Identity proof</Text>
          <FormControl isInvalid={errors.documentType}>
            <FormLabel>Document type</FormLabel>
            <Select name="documentType" value={form.documentType} onChange={handleChange} placeholder="Select document">
              <option value="passport">Passport</option>
              <option value="cid">Citizen ID</option>
              <option value="driving-license">Driving license</option>
            </Select>
            <FormErrorMessage>{errors.documentType}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.documentName}>
            <FormLabel>Upload document</FormLabel>
            <Input type="file" onChange={handleFileChange} />
            <FormErrorMessage>{errors.documentName}</FormErrorMessage>
          </FormControl>
        </Stack>
      )}

      {step === 3 && (
        <Stack spacing={4}>
          <Text fontWeight="600">Payment (demo)</Text>
          <FormControl isInvalid={errors.paymentMethod}>
            <FormLabel>Select payment method</FormLabel>
            <Select
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
              placeholder="Choose a payment option"
            >
              <option value="stripe">Stripe (Card)</option>
              <option value="binance">Binance Pay</option>
              <option value="upi">UPI (India)</option>
            </Select>
            <FormErrorMessage>{errors.paymentMethod}</FormErrorMessage>
          </FormControl>

          {form.paymentMethod === "stripe" && (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
              <FormControl>
                <FormLabel>Card number</FormLabel>
                <Input placeholder="4242 4242 4242 4242" />
              </FormControl>
              <FormControl>
                <FormLabel>Name on card</FormLabel>
                <Input placeholder="Traveler name" />
              </FormControl>
              <FormControl>
                <FormLabel>Expiry</FormLabel>
                <Input placeholder="MM/YY" />
              </FormControl>
              <FormControl>
                <FormLabel>CVC</FormLabel>
                <Input placeholder="123" />
              </FormControl>
              <FormControl gridColumn={{ base: "auto", md: "1 / -1" }}>
                <FormLabel>Payment reference (optional)</FormLabel>
                <Input
                  name="paymentReference"
                  value={form.paymentReference}
                  onChange={handleChange}
                  placeholder="e.g., Demo-Stripe-1234"
                />
              </FormControl>
            </SimpleGrid>
          )}

          {form.paymentMethod === "binance" && (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
              <FormControl>
                <FormLabel>Binance Pay ID</FormLabel>
                <Input
                  name="binancePayId"
                  value={form.binancePayId}
                  onChange={handleChange}
                  placeholder="e.g., 8976 4321"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Transaction reference</FormLabel>
                <Input
                  name="paymentReference"
                  value={form.paymentReference}
                  onChange={handleChange}
                  placeholder="e.g., BNB-ORDER-001"
                />
              </FormControl>
              <Box
                gridColumn={{ base: "auto", md: "1 / -1" }}
                border="1px solid"
                borderColor="blackAlpha.200"
                borderRadius="lg"
                p={4}
                bg="gray.50"
              >
                <Text fontSize="sm" color="blackAlpha.700" mb={2}>
                  Binance Pay QR (demo)
                </Text>
                <Center bg="white" borderRadius="md" border="1px dashed" borderColor="blackAlpha.300" p={4}>
                  <svg width="140" height="140" viewBox="0 0 140 140" aria-label="Binance Pay QR">
                    <rect width="140" height="140" fill="#fff" />
                    <rect x="10" y="10" width="30" height="30" fill="#111" />
                    <rect x="100" y="10" width="30" height="30" fill="#111" />
                    <rect x="10" y="100" width="30" height="30" fill="#111" />
                    <rect x="55" y="55" width="30" height="30" fill="#111" />
                    <rect x="55" y="10" width="10" height="10" fill="#111" />
                    <rect x="70" y="25" width="10" height="10" fill="#111" />
                    <rect x="85" y="40" width="10" height="10" fill="#111" />
                    <rect x="40" y="70" width="10" height="10" fill="#111" />
                    <rect x="85" y="70" width="10" height="10" fill="#111" />
                    <rect x="70" y="85" width="10" height="10" fill="#111" />
                  </svg>
                </Center>
                <Text fontSize="xs" color="blackAlpha.600" mt={2}>
                  Demo QR only. No real charge will be made.
                </Text>
              </Box>
            </SimpleGrid>
          )}

          {form.paymentMethod === "upi" && (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
              <FormControl>
                <FormLabel>UPI ID</FormLabel>
                <Input
                  name="upiId"
                  value={form.upiId}
                  onChange={handleChange}
                  placeholder="name@upi"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Transaction reference</FormLabel>
                <Input
                  name="paymentReference"
                  value={form.paymentReference}
                  onChange={handleChange}
                  placeholder="e.g., UPI-REF-1234"
                />
              </FormControl>
            </SimpleGrid>
          )}
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            This is a demo payment step. No real charge will be made.
          </Alert>
        </Stack>
      )}

      <Flex mt={6} justify="space-between" gap={3} flexWrap="wrap">
        {step > 1 && (
          <Button variant="outline" borderRadius="full" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
        {step < 3 && (
          <Button
            colorScheme="green"
            bg="forest.600"
            color="white"
            borderRadius="full"
            onClick={() => {
              const nextErrors = validate();
              setErrors(nextErrors);
              if (Object.keys(nextErrors).length === 0) {
                setStep(step + 1);
              }
            }}
          >
            Continue
          </Button>
        )}
        {step === 3 && (
          <Button
            type="submit"
            colorScheme="green"
            bg="forest.600"
            color="white"
            borderRadius="full"
            isLoading={status === "loading"}
          >
            Complete booking
          </Button>
        )}
      </Flex>
      {status === "success" && (
        <Alert mt={4} status="success" borderRadius="md">
          <AlertIcon />
          Your inquiry has been received. We will reply within 24 hours.
        </Alert>
      )}
      {status === "error" && (
        <Alert mt={4} status="error" borderRadius="md">
          <AlertIcon />
          Something went wrong. Please try again.
        </Alert>
      )}
    </Box>
  );
}
