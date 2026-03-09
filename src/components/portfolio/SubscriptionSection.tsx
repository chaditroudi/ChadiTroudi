import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  GraduationCap,
  Rocket,
  Crown,
  Check,
  Smartphone,
  Building2,
  Mail as MailIcon,
  Send,
  Star,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "49",
    currency: "TND",
    period: "/month",
    icon: GraduationCap,
    color: "from-emerald-500 to-teal-500",
    border: "border-emerald-500/20",
    features: [
      "AI Coding Tutor access",
      "10 challenge evaluations/day",
      "Basic code analysis",
      "Community support",
      "Email support",
    ],
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "129",
    currency: "TND",
    period: "/month",
    icon: Rocket,
    color: "from-primary to-emerald-400",
    border: "border-primary/30",
    features: [
      "Everything in Starter",
      "Unlimited challenge evaluations",
      "Advanced debugging assistance",
      "1-on-1 weekly session (30 min)",
      "Priority support",
      "Custom learning path",
    ],
    popular: true,
  },
  {
    id: "bootcamp",
    name: "Bootcamp",
    price: "299",
    currency: "TND",
    period: "one-time",
    icon: Crown,
    color: "from-amber-500 to-orange-500",
    border: "border-amber-500/20",
    features: [
      "10-day intensive Java program",
      "Java + SQL + Real project",
      "Daily 1-on-1 sessions",
      "Code review & mentorship",
      "Certificate of completion",
      "Lifetime community access",
      "Job preparation support",
    ],
    popular: false,
  },
];

const paymentMethods = [
  {
    id: "d17",
    name: "D17",
    icon: Smartphone,
    description: "Mobile payment via D17 app",
    instructions: "Send payment to the D17 number provided after registration",
  },
  {
    id: "bank_transfer",
    name: "Bank Transfer",
    icon: Building2,
    description: "Direct bank transfer (virement bancaire)",
    instructions: "Transfer to the bank account details sent to your email",
  },
  {
    id: "mandat_minute",
    name: "Mandat Minute",
    icon: MailIcon,
    description: "La Poste Tunisienne postal order",
    instructions: "Send a Mandat Minute to the details provided after registration",
  },
];

const SubscriptionSection = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState("d17");
  const [formData, setFormData] = useState({ full_name: "", email: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan || !formData.full_name || !formData.email) {
      toast.error("Please fill in your name and email");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("subscription_requests").insert({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone || null,
        plan: selectedPlan,
        payment_method: selectedPayment,
        message: formData.message || null,
      });

      if (error) throw error;
      setSubmitted(true);
      toast.success("Registration submitted! Check your email for payment instructions.");
    } catch (err) {
      console.error("Subscription error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="subscribe" className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Star className="w-4 h-4" />
            Start Learning Today
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            Choose Your Learning Path
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Learn coding with Tunisia's best AI-powered tutor. Flexible plans, local payment methods, and real results.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            const isSelected = selectedPlan === plan.id;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => { setSelectedPlan(plan.id); setSubmitted(false); }}
                className={`relative cursor-pointer rounded-2xl border p-6 transition-all hover:shadow-lg ${
                  isSelected
                    ? `border-primary shadow-xl shadow-primary/10 scale-[1.02]`
                    : `border-border bg-card hover:border-primary/30`
                } ${plan.popular ? "ring-2 ring-primary/20" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    Most Popular
                  </div>
                )}

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-xl font-bold text-foreground mb-1">{plan.name}</h3>

                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.currency}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-primary/10"
                  }`}
                >
                  {isSelected ? "Selected ✓" : "Select Plan"}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Registration Form */}
        <AnimatePresence>
          {selectedPlan && !submitted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="max-w-2xl mx-auto bg-card rounded-2xl border border-border p-8">
                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Complete Your Registration
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Info */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.full_name}
                        onChange={(e) => setFormData((p) => ({ ...p, full_name: e.target.value }))}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Phone (optional)</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="+216 XX XXX XXX"
                    />
                  </div>

                  {/* Payment Methods */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">Payment Method</label>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {paymentMethods.map((pm) => {
                        const PMIcon = pm.icon;
                        return (
                          <button
                            key={pm.id}
                            type="button"
                            onClick={() => setSelectedPayment(pm.id)}
                            className={`p-4 rounded-xl border text-left transition-all ${
                              selectedPayment === pm.id
                                ? "border-primary bg-primary/5 shadow-sm"
                                : "border-border bg-background hover:border-primary/30"
                            }`}
                          >
                            <PMIcon className={`w-5 h-5 mb-2 ${selectedPayment === pm.id ? "text-primary" : "text-muted-foreground"}`} />
                            <h4 className="font-semibold text-sm text-foreground">{pm.name}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{pm.description}</p>
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 bg-muted/50 rounded-lg p-3">
                      📋 {paymentMethods.find((p) => p.id === selectedPayment)?.instructions}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Message (optional)</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                      rows={3}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Any questions or comments..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-3.5 font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Register & Get Payment Instructions
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success State */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Registration Submitted! 🎉</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Thank you! You'll receive an email with payment instructions for the{" "}
                <strong>{plans.find((p) => p.id === selectedPlan)?.name}</strong> plan via{" "}
                <strong>{paymentMethods.find((p) => p.id === selectedPayment)?.name}</strong>.
              </p>
              <p className="text-xs text-muted-foreground">
                Chadi will confirm your enrollment within 24 hours after payment.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default SubscriptionSection;
