"use client";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { useRef, useState } from "react";

export default function ResendEmailButton({ id }) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const handleResend = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/emails/${id}/resend`, { method: "POST" });
      if (res.ok) {
        toast({
          title: "Email resent",
          status: "success",
          duration: 2500,
          isClosable: true
        });
      } else {
        toast({
          title: "Resend failed",
          status: "error",
          duration: 2500,
          isClosable: true
        });
      }
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <>
      <Button size="xs" variant="outline" onClick={onOpen} isLoading={loading}>
        Resend
      </Button>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Resend email
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to resend this email?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="green" onClick={handleResend} ml={3} isLoading={loading}>
                Resend
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
