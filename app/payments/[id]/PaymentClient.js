"use client";

import { Button, useToast } from "@chakra-ui/react";
import { useState } from "react";

export default function PaymentClient({ inquiryId, disabled }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/payments/${inquiryId}/pay`, { method: "POST" });
      if (res.ok) {
        toast({
          title: "Payment recorded",
          status: "success",
          duration: 2500,
          isClosable: true
        });
        window.location.reload();
      } else {
        toast({
          title: "Payment failed",
          status: "error",
          duration: 2500,
          isClosable: true
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      colorScheme="green"
      bg="forest.600"
      color="white"
      borderRadius="full"
      isDisabled={disabled}
      isLoading={loading}
      onClick={handlePay}
    >
      Pay now (demo)
    </Button>
  );
}
