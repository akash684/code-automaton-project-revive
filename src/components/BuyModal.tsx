
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export function BuyModal({
  open,
  onOpenChange,
  item,
  itemType
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  item: { name: string; price: number; image_url?: string };
  itemType: string;
}) {
  const [step, setStep] = useState(1); // For step indicator (future extensible)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isMobile = useIsMobile();

  async function handleBuy() {
    setSubmitting(true);
    setErrorMsg(""); // Reset possible errors

    // Simulate payment submission - would integrate real payment here
    setTimeout(() => {
      if (!name || !email.includes("@") || !address) {
        setErrorMsg("Please fill all fields with valid details.");
        setSubmitting(false);
        return;
      }
      // Simulate success
      setSubmitting(false);
      setDone(true);
      toast.success("Purchase successful! 🎉", { duration: 2500 });
      setTimeout(() => {
        onOpenChange(false);
        setDone(false);
        setName("");
        setEmail("");
        setAddress("");
        setStep(1);
      }, 1800);
    }, 1000);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`max-w-2xl px-0 py-0 overflow-visible md:flex ${
          !isMobile && "items-stretch"
        }`}
        style={{ minHeight: 380 }}
      >
        {/* Sticky summary for desktop */}
        {!isMobile && (
          <div className="hidden md:flex flex-col bg-card border rounded-l-2xl w-96 p-6 sticky top-0 min-h-full shadow-2xl justify-center">
            <div className="flex flex-col items-center gap-4">
              <img
                src={item.image_url || "/placeholder.svg"}
                alt={item.name}
                className="rounded-xl shadow-lg object-cover w-32 h-32 border mb-4 bg-white"
                style={{ objectFit: "cover" }}
              />
              <div className="font-semibold text-xl mb-1">{item.name}</div>
              <div className="text-lg font-bold text-blue-700 mb-2">
                ₹{new Intl.NumberFormat("en-IN").format(item.price)}
              </div>
              <div className="text-xs text-muted-foreground mb-1">Tax included</div>
              <div className="flex items-center gap-1 text-sm text-accent">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                Instant Confirmation
              </div>
            </div>
          </div>
        )}
        {/* Form */}
        <div className={`flex-1 min-w-0 bg-background rounded-2xl p-5 md:rounded-l-none`}>
          <DialogHeader>
            <StepIndicator step={done ? 2 : 1} />
            <DialogTitle className="text-2xl font-bold mb-1">Buy {itemType}</DialogTitle>
            <DialogDescription>
              Complete the form to purchase <b>{item?.name}</b> for{" "}
              <span className="text-blue-600 font-bold">
                ₹{new Intl.NumberFormat("en-IN").format(item?.price)}
              </span>
            </DialogDescription>
          </DialogHeader>
          {done ? (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <svg width={48} height={48} fill="none" className="animate-scale-in text-green-500" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M8 12.5L11 15l5-5"/></svg>
              <div className="font-bold text-green-700 text-lg">Payment Successful!</div>
              <div className="text-muted-foreground">Thank you for your purchase.</div>
              <Button className="mt-2" onClick={() => onOpenChange(false)}>Close</Button>
            </div>
          ) : (
            <form
              className="flex flex-col gap-4 pt-2"
              onSubmit={e => {
                e.preventDefault();
                handleBuy();
              }}
            >
              {/* Floating Labels for inputs */}
              <div className="relative">
                <Input
                  id="user-name"
                  placeholder=" "
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="peer"
                  autoComplete="name"
                />
                <label
                  htmlFor="user-name"
                  className={`label-pointer transition-all absolute left-3 top-2 text-muted-foreground duration-200 origin-[0] scale-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-2 peer-placeholder-shown:text-muted-foreground peer-focus:scale-75 peer-focus:-translate-y-5 peer-focus:text-accent z-10`}
                >
                  Name
                </label>
              </div>
              <div className="relative">
                <Input
                  id="user-email"
                  type="email"
                  placeholder=" "
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="peer"
                  autoComplete="email"
                />
                <label
                  htmlFor="user-email"
                  className={`label-pointer transition-all absolute left-3 top-2 text-muted-foreground duration-200 origin-[0] scale-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-2 peer-placeholder-shown:text-muted-foreground peer-focus:scale-75 peer-focus:-translate-y-5 peer-focus:text-accent z-10`}
                >
                  Email
                </label>
              </div>
              <div className="relative">
                <Input
                  id="user-address"
                  placeholder=" "
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  required
                  className="peer"
                  autoComplete="street-address"
                />
                <label
                  htmlFor="user-address"
                  className={`label-pointer transition-all absolute left-3 top-2 text-muted-foreground duration-200 origin-[0] scale-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-2 peer-placeholder-shown:text-muted-foreground peer-focus:scale-75 peer-focus:-translate-y-5 peer-focus:text-accent z-10`}
                >
                  Address / Delivery Location
                </label>
              </div>
              {/* Payment Buttons */}
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 mt-1">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold"
                  disabled={submitting}
                >
                  {submitting ? "Processing..." : "Pay with Card"}
                </Button>
                <Button
                  type="button"
                  className="w-full border border-blue-400 bg-white dark:bg-gray-900 text-blue-700 dark:text-blue-200 font-semibold"
                  disabled={submitting}
                  onClick={() => {
                    toast.info("UPI coming soon!");
                  }}
                >
                  Pay via UPI
                </Button>
              </div>
              {errorMsg && (
                <div className="bg-red-100 text-red-700 px-3 py-2 rounded-lg border border-red-300 mt-2 text-sm animate-fade-in">
                  {errorMsg}
                </div>
              )}
              <DialogFooter className="!mt-5 flex flex-col">
                <div className="text-xs text-muted-foreground text-center">
                  <span>Secured by ShadCN & Supabase</span>
                </div>
              </DialogFooter>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Simple step indicator above form
const StepIndicator = ({ step }: { step: 1 | 2 }) => (
  <div className="flex items-center gap-2 mb-3 justify-center">
    <div
      className={`w-6 h-6 rounded-full flex items-center justify-center font-semibold transition-all ${
        step === 1
          ? "bg-blue-600 text-white"
          : "bg-green-500 text-white"
      }`}
    >
      {step === 1 ? 1 : <svg viewBox="0 0 20 20" width={18} height={18} className="inline" fill="none"><circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2"/><path d="M6 10.5L9 13 14 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}
    </div>
    <span className="text-base font-medium">{step === 1 ? "Enter Details" : "Payment Complete"}</span>
  </div>
);

export default BuyModal;

