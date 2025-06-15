
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Generic for both vehicles and accessories
export function BuyModal({ open, onOpenChange, item, itemType }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  item: { name: string; price: number; image_url?: string };
  itemType: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleBuy = async () => {
    setSubmitting(true);
    // Here: Insert order to Supabase (not implemented; placeholder)
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
      toast.success("Purchase successful!", { duration: 2500 });
      setTimeout(() => {
        onOpenChange(false);
        setDone(false);
        setName("");
        setEmail("");
        setAddress("");
      }, 1800);
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Buy {itemType}</DialogTitle>
          <DialogDescription>
            Complete the form below to purchase <b>{item?.name}</b> for {" "}
            <span className="text-blue-600 font-bold">₹{new Intl.NumberFormat("en-IN").format(item?.price)}</span>
          </DialogDescription>
        </DialogHeader>
        {done ? (
          <div className="text-center py-8 font-semibold text-green-700">
            🎉 Thank you! Your purchase is confirmed.
          </div>
        ) : (
        <>
          <div className="flex flex-col gap-3 py-4">
            <Input placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required />
            <Input placeholder="Your Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <Input placeholder="Address / Delivery Location" value={address} onChange={e => setAddress(e.target.value)} required />
          </div>
          <DialogFooter>
            <Button
              onClick={handleBuy}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
              disabled={!name || !email || !address || submitting}
              loading={submitting}
            >
              {submitting ? "Processing..." : "Confirm & Pay"}
            </Button>
          </DialogFooter>
        </>
        )}
      </DialogContent>
    </Dialog>
  );
}
