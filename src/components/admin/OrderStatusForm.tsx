"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import type { Order } from "@/lib/types";
import { Select, TextArea, FormError } from "@/components/admin/FormFields";
import { updateOrderStatus } from "@/lib/actions/admin/orders";

export function OrderStatusForm({ order }: { order: Order }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await updateOrderStatus(order.id, formData);
      if (!result.success) setError(result.error);
      else setSuccess(true);
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <FormError error={error} />
      {success && <p className="alert-success">Order updated.</p>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select label="Order Status" name="order_status" defaultValue={order.order_status}>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="paid">Paid</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </Select>
        <Select label="Payment Status" name="payment_status" defaultValue={order.payment_status}>
          <option value="unpaid">Unpaid</option>
          <option value="partially_paid">Partially Paid</option>
          <option value="paid">Paid</option>
          <option value="refunded">Refunded</option>
        </Select>
      </div>
      <TextArea label="Notes" name="notes" defaultValue={order.notes ?? ""} rows={4} />
      <button type="submit" disabled={isPending} className="btn-primary">
        {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        Save
      </button>
    </form>
  );
}
