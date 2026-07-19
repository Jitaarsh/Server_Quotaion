import express from "express";
import crypto from "crypto";
import Razorpay from "razorpay";

const router = express.Router();

const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY;
  const key_secret = process.env.RAZORPAY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error("Razorpay credentials are not configured");
  }

  return new Razorpay({ key_id, key_secret });
};

router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid amount is required",
      });
    }

    const order = await getRazorpayInstance().orders.create({
      amount: Math.round(numericAmount * 100),
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    res.status(500).json({
      success: false,
      message: "Unable to create Razorpay order",
    });
  }
});

router.post("/verify", (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification data is incomplete",
      });
    }

    if (!process.env.RAZORPAY_SECRET) {
      throw new Error("Razorpay secret is not configured");
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (error) {
    console.error("Razorpay payment verification failed:", error);
    res.status(500).json({
      success: false,
      message: "Unable to verify Razorpay payment",
    });
  }
});

export default router;
