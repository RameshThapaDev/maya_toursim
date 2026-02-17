"use client";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  HStack,
  Select,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { useRef, useState } from "react";

const STATUS_OPTIONS = ["demo", "pending", "paid", "failed", "refunded"];

export default function PaymentStatusForm({ id, status }) {
  const [value, setValue] = useState(status || "demo");
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/payments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: value })
      });
      if (res.ok) {
        toast({
          title: "Payment status updated",
          status: "success",
          duration: 2500,
          isClosable: true
        });
      } else {
        toast({
          title: "Update failed",
          status: "error",
          duration: 2500,
          isClosable: true
        });
      }
    } finally {
      setSaving(false);
      onClose();
    }
  };

  return (
    <>
      <HStack spacing={2} align="center">
        <Select size="sm" value={value} onChange={(event) => setValue(event.target.value)}>
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
        <Button size="sm" onClick={onOpen} isLoading={saving}>
          Save
        </Button>
      </HStack>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Update payment status
            </AlertDialogHeader>
            <AlertDialogBody>
              Confirm updating the payment status to "{value}"?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="green" onClick={handleSave} ml={3} isLoading={saving}>
                Update
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
