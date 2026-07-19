import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    // ── Core Identity ─────────────────────────────────────────
    name: {
      type: String,
      required: [true, "Plan name is required"],
      trim: true,
    },

    shortDescription: {
      type: String,
      trim: true,
      default: "",
    },

    // ── Pricing ───────────────────────────────────────────────
    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP", "INR"],
      default: "USD",
    },

    billingCycle: {
      type: String,
      enum: ["monthly", "yearly"],
      default: "monthly",
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    discountedPrice: {
      type: Number,
      default: null,
    },

    // ── Features / Benefits (display only, not enforced) ─────
    features: {
      type: [String],
      default: [],
    },

    // ── Limitations (ENFORCED numeric caps) ───────────────────
    limitations: {
      numberOfQuotations: {
        type: Number,
        default: 0, // 0 could mean "no active quotes allowed" — consider -1 for unlimited
      },
      numberOfTemplates: {
        type: Number,
        default: 0,
      },
    },

    // ── Permissions (ENFORCED boolean feature flags) ──────────
    permissions: {
      emailSupport: { type: Boolean, default: false },
      pdfExport: { type: Boolean, default: false },
      advancedPdfExport: { type: Boolean, default: false },
      customBranding: { type: Boolean, default: false },
      apiAccess: { type: Boolean, default: false },
      prioritySupport: { type: Boolean, default: false },
    },

    // ── Status & Display ──────────────────────────────────────
    isActive: {
      type: Boolean,
      default: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

planSchema.pre("save", async function () {
  if (this.discountPercent > 0) {
    this.discountedPrice = parseFloat(
      (this.price * (1 - this.discountPercent / 100)).toFixed(2)
    );
  } else {
    this.discountedPrice = null;
  }
});

const Plan = mongoose.model("Plan", planSchema);

export default Plan;