"use client";

import { useState } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/student/section-card";
import { StatCard } from "@/components/student/stat-card";
import { DebtBanner } from "@/components/student/debt-banner";
import { PaymentRow } from "@/components/student/payment-row";
import { mockPayments, mockFinancialSummary } from "@/constants/student-mock-data";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CreditCard, DollarSign, Mail, Phone } from "lucide-react";

export default function FinancePage() {
  const { currentDebt, totalOwed, totalPaid, currency, nextPaymentDate, nextPaymentAmount } = mockFinancialSummary;

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentAmount, setPaymentAmount] = useState(String(nextPaymentAmount ?? currentDebt));
  const [paySuccess, setPaySuccess] = useState(false);

  const handlePay = () => {
    setPaySuccess(true);
  };

  return (
    <div>
      <PageHeader title="Finance" description="Tuition payments and financial status" />

      {currentDebt > 0 && (
        <DebtBanner
          amount={currentDebt}
          currency={currency}
          nextPaymentDate={nextPaymentDate}
        />
      )}

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Tuition" value={`${currency} ${totalOwed.toLocaleString()}`} icon={DollarSign} />
        <StatCard label="Total Paid" value={`${currency} ${totalPaid.toLocaleString()}`} icon={DollarSign} />
        <StatCard
          label="Outstanding"
          value={`${currency} ${currentDebt.toLocaleString()}`}
          icon={CreditCard}
          className={currentDebt > 0 ? "border-amber-200" : ""}
        />
        <StatCard
          label="Next Payment"
          value={nextPaymentAmount ? `${currency} ${nextPaymentAmount.toLocaleString()}` : "—"}
          icon={CreditCard}
          subtitle={
            nextPaymentDate
              ? new Date(nextPaymentDate).toLocaleDateString("en-US", { day: "numeric", month: "short" })
              : undefined
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Payment History */}
        <SectionCard title="Payment History">
          <div className="divide-y divide-border">
            {mockPayments.map((payment) => (
              <PaymentRow key={payment.id} payment={payment} />
            ))}
          </div>
        </SectionCard>

        {/* Make a Payment */}
        <div className="space-y-4">
          <SectionCard title="Make a Payment">
            {paySuccess ? (
              <div className="py-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
                <p className="mt-3 font-semibold">Payment submitted!</p>
                <p className="mt-1 text-sm text-secondary-foreground">
                  Your payment is being processed. You will receive a confirmation email shortly.
                </p>
                <Button variant="outline" className="mt-4" onClick={() => setPaySuccess(false)}>
                  Make another payment
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Amount ({currency})</label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    min="1"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">Payment Method</label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Credit / Debit Card</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full"
                  onClick={handlePay}
                  disabled={!paymentAmount || Number(paymentAmount) <= 0}
                >
                  Pay {currency} {Number(paymentAmount).toLocaleString()}
                </Button>

                <p className="text-xs text-secondary-foreground">
                  Payments are processed within 1-2 business days.
                </p>
              </div>
            )}
          </SectionCard>

          <SectionCard title="Finance Department Contact">
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-secondary-foreground">
                <Mail className="h-4 w-4" />
                <span>finance@uou.edu</span>
              </div>
              <div className="flex items-center gap-2 text-secondary-foreground">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 000-1234</span>
              </div>
              <Separator />
              <p className="text-secondary-foreground">
                Working hours: Mon–Fri, 9:00–17:00
              </p>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
