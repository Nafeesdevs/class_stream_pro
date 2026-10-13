// import crypto from "node:crypto";
// import Razorpay from "razorpay";
// import HandleError from "../helper/handleError.js";
// import Payment from "../model/paymentModel.js";
// import Subscription from "../model/subscriptionModel.js";
// import Plan from "../model/planModel.js";

// const addMonths = (date, months) => {
//   const result = new Date(date);
//   const day = result.getDate();
//   result.setDate(1);
//   result.setMonth(result.getMonth() + months);
//   const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
//   result.setDate(Math.min(day, lastDay));
//   return result;
// };

// const currentState = async (userId) => {
//   const now = new Date();
//   await Subscription.updateMany(
//     { user: userId, state: { $in: ["active", "upcoming"] }, endDate: { $lte: now } },
//     { $set: { state: "expired" } }
//   );
//   await Subscription.updateMany(
//     { user: userId, state: "upcoming", startDate: { $lte: now }, endDate: { $gt: now } },
//     { $set: { state: "active" } }
//   );
//   return Subscription.find({ user: userId }).sort({ startDate: -1, createdAt: -1 });
// };

// const withClassesLeft = (subscription) => ({
//   ...subscription.toObject(),
//   classesLeft: Math.max(0, subscription.classesAllowed - subscription.classesUsed),
//   daysLeft: Math.max(0, Math.ceil((subscription.endDate.getTime() - Date.now()) / 86400000)),
//   status: subscription.state,
// });

// const testPaymentsAllowed = () => process.env.NODE_ENV !== "production";

// export const createSubscriptionOrder = async (req, res, next) => {
//   try {
//     if (req.user.role === "admin") return next(new HandleError("Administrators cannot purchase plans.", 403));
//     const plan = await Plan.findOne({ _id: req.body.planId, isActive: true });
//     if (!plan) return next(new HandleError("Plan not found or no longer available.", 404));

//     let orderId;
//     let keyId = process.env.RAZORPAY_KEY_ID;
//     if (keyId && process.env.RAZORPAY_KEY_SECRET) {
//       const razorpay = new Razorpay({ key_id: keyId, key_secret: process.env.RAZORPAY_KEY_SECRET });
//       const order = await razorpay.orders.create({
//         amount: Math.round(plan.price * 100),
//         currency: plan.currency || "INR",
//         receipt: `plan_${Date.now()}_${String(req.user._id).slice(-5)}`,
//         notes: { userId: String(req.user._id), planId: String(plan._id) },
//       });
//       orderId = order.id;
//     } else {
//       if (!testPaymentsAllowed()) return next(new HandleError("Payment service is not configured.", 503));
//       orderId = `order_test_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
//       keyId = null;
//     }

//     await Payment.create({
//       user: req.user._id,
//       type: "subscription",
//       plan: plan._id,
//       planSnapshot: {
//         name: plan.name,
//         durationMonths: plan.durationMonths,
//         classLimit: plan.classLimit,
//         price: plan.price,
//       },
//       razorpayOrderId: orderId,
//       amount: plan.price,
//       currency: plan.currency || "INR",
//       status: "created",
//     });

//     res.status(200).json({
//       success: true,
//       order: { id: orderId, amount: Math.round(plan.price * 100), currency: plan.currency || "INR", planName: plan.name },
//       keyId,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const verifySubscriptionPayment = async (req, res, next) => {
//   try {
//     const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = req.body;
//     if (!orderId || !paymentId) return next(new HandleError("Payment reference IDs are missing.", 400));

//     const payment = await Payment.findOne({
//       razorpayOrderId: orderId,
//       user: req.user._id,
//       type: "subscription",
//     });
//     if (!payment) return next(new HandleError("Payment order not found for this account.", 404));

//     let subscription = await Subscription.findOne({ payment: payment._id });
//     if (payment.status === "paid" && !subscription) {
//       return next(new HandleError("The paid order is missing its subscription record.", 409));
//     }
//     if (payment.status !== "paid") {
//       const now = new Date();
//       const secret = process.env.RAZORPAY_KEY_SECRET;
//       const testOrder = orderId.startsWith("order_test_") && testPaymentsAllowed();
//       if (secret) {
//         const expected = crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
//         const actualBuffer = Buffer.from(String(signature || ""));
//         const expectedBuffer = Buffer.from(expected);
//         const valid = actualBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(actualBuffer, expectedBuffer);
//         if (!valid) return next(new HandleError("Payment verification failed. Invalid signature.", 400));
//       } else if (!testOrder || !paymentId.startsWith("pay_test_")) {
//         return next(new HandleError("Payment verification is not configured.", 503));
//       }

//       if (!subscription) {
//         const snapshot = payment.planSnapshot;
//         if (!snapshot?.name || !snapshot.durationMonths || !snapshot.classLimit) {
//           return next(new HandleError("The saved plan details for this order are incomplete.", 409));
//         } 
//         // const records = await currentState(req.user._id);

//         // const endOfExisting = records
//         //   .filter((item) => ["active", "upcoming"].includes(item.state) && item.endDate > now)
//         //   .reduce((latest, item) => item.endDate > latest ? item.endDate : latest, now);
//         // const startsNow = endOfExisting.getTime() === now.getTime();
//         // const startDate = startsNow ? now : endOfExisting;
//         // const endDate = addMonths(startDate, snapshot.durationMonths);

//         const records = await currentState(req.user._id);

// // Find the plan the user is on right now
// const activeNow = records.find(
//   (item) => item.state === "active" && item.startDate <= now && item.endDate > now
// );

// if (activeNow && snapshot.classLimit < activeNow.planSnapshot.classLimit) {
//   return next(new HandleError("You can only upgrade to a plan with more classes.", 400));
// }

// // The new plan always starts immediately
// const startDate = now;
// const endDate = addMonths(startDate, snapshot.durationMonths);

//         try {
//           subscription = await Subscription.create({
//             user: req.user._id,
//             plan: payment.plan,
//             payment: payment._id,
//             planName: snapshot.name,
//             planSnapshot: {
//               name: snapshot.name,
//               durationMonths: snapshot.durationMonths,
//               classLimit: snapshot.classLimit,
//             },
//             pricePaid: payment.amount,
//             currency: payment.currency,
//             // classesAllowed: snapshot.classLimit,
//             // classesUsed: 0,
//             // state: startsNow ? "active" : "upcoming",
//             // startDate,
//             // endDate,
//             classesAllowed: snapshot.classLimit,
// classesUsed: activeNow ? Math.min(activeNow.classesUsed, snapshot.classLimit) : 0,
// assignedLessons: activeNow ? activeNow.assignedLessons : [],
// state: "active",
// startDate,
// endDate,
//           });
//         } catch (error) {
//           if (error.code !== 11000) throw error;
//           subscription = await Subscription.findOne({ payment: payment._id });
//           if (!subscription) throw error;
//         }
//       }

//       payment.status = "paid";
//       payment.razorpayPaymentId = paymentId;
//       payment.razorpaySignature = signature || "test_signature";
//       payment.paidAt = now;
//       payment.subscription = subscription._id;
//       await payment.save();
//     }

//     res.status(200).json({
//       success: true,
//       message: "Payment verified successfully.",
//       payment,
//       subscription: withClassesLeft(subscription),
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getMySubscription = async (req, res, next) => {
//   try {
//     const subscriptions = await currentState(req.user._id);
//     const now = new Date();
//     const current = subscriptions.find((item) => item.state === "active" && item.startDate <= now && item.endDate > now);
//     const upcoming = subscriptions.filter((item) => item.state === "upcoming").map(withClassesLeft);
//     const history = subscriptions
//       .filter((item) => item.state === "expired" || item.state === "cancelled")
//       .map(withClassesLeft);
//     res.status(200).json({
//       success: true,
//       current: current ? withClassesLeft(current) : null,
//       upcoming,
//       history,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getAdminSubscriptions = async (req, res, next) => {
//   try {
//     const subscriptions = await Subscription.find()
//       .populate("user", "name email avatar")
//       .populate("plan", "name durationMonths classLimit price")
//       .populate("payment", "amount status razorpayPaymentId razorpayOrderId paidAt")
//       .sort({ createdAt: -1 });
//     res.status(200).json({ success: true, subscriptions: subscriptions.map(withClassesLeft), count: subscriptions.length });
//   } catch (error) {
//     next(error);
//   }
// };

// export const cancelSubscription = async (req, res, next) => {
//   try {
//     const subscription = await Subscription.findById(req.params.id);
//     if (!subscription) return next(new HandleError("Subscription not found.", 404));
//     if (subscription.state !== "active" && subscription.state !== "upcoming") {
//       return next(new HandleError("This subscription can no longer be cancelled.", 400));
//     }
//     subscription.state = "cancelled";
//     await subscription.save();
//     res.status(200).json({ success: true, subscription: withClassesLeft(subscription) });
//   } catch (error) {
//     next(error);
//   }
// };

import crypto from "node:crypto";
import Razorpay from "razorpay";
import HandleError from "../helper/handleError.js";
import Payment from "../model/paymentModel.js";
import Subscription from "../model/subscriptionModel.js";
import Plan from "../model/planModel.js";

const addMonths = (date, months) => {
  const result = new Date(date);
  const day = result.getDate();
  result.setDate(1);
  result.setMonth(result.getMonth() + months);
  const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(day, lastDay));
  return result;
};

const currentState = async (userId) => {
  const now = new Date();
  await Subscription.updateMany(
    { user: userId, state: { $in: ["active", "upcoming"] }, endDate: { $lte: now } },
    { $set: { state: "expired" } }
  );
  await Subscription.updateMany(
    { user: userId, state: "upcoming", startDate: { $lte: now }, endDate: { $gt: now } },
    { $set: { state: "active" } }
  );
  return Subscription.find({ user: userId }).sort({ startDate: -1, createdAt: -1 });
};

const withClassesLeft = (subscription) => ({
  ...subscription.toObject(),
  classesLeft: Math.max(0, subscription.classesAllowed - subscription.classesUsed),
  daysLeft: Math.max(0, Math.ceil((subscription.endDate.getTime() - Date.now()) / 86400000)),
  status: subscription.state,
});

const testPaymentsAllowed = () => process.env.NODE_ENV !== "production";

export const createSubscriptionOrder = async (req, res, next) => {
  try {
    if (req.user.role === "admin") return next(new HandleError("Administrators cannot purchase plans.", 403));
    const plan = await Plan.findOne({ _id: req.body.planId, isActive: true });
    if (!plan) return next(new HandleError("Plan not found or no longer available.", 404));

    // Block downgrades BEFORE the user is charged.
    // Delete this block if you want to allow switching to a smaller plan.
    const records = await currentState(req.user._id);
    const now = new Date();
    const activeNow = records.find(
      (item) => item.state === "active" && item.startDate <= now && item.endDate > now
    );
    if (activeNow && plan.classLimit < activeNow.classesAllowed) {
      return next(new HandleError("You can only switch to a plan with the same or more classes than your current plan.", 400));
    }

    let orderId;
    let keyId = process.env.RAZORPAY_KEY_ID;
    if (keyId && process.env.RAZORPAY_KEY_SECRET) {
      const razorpay = new Razorpay({ key_id: keyId, key_secret: process.env.RAZORPAY_KEY_SECRET });
      const order = await razorpay.orders.create({
        amount: Math.round(plan.price * 100),
        currency: plan.currency || "INR",
        receipt: `plan_${Date.now()}_${String(req.user._id).slice(-5)}`,
        notes: { userId: String(req.user._id), planId: String(plan._id) },
      });
      orderId = order.id;
    } else {
      if (!testPaymentsAllowed()) return next(new HandleError("Payment service is not configured.", 503));
      orderId = `order_test_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
      keyId = null;
    }

    await Payment.create({
      user: req.user._id,
      type: "subscription",
      plan: plan._id,
      planSnapshot: {
        name: plan.name,
        durationMonths: plan.durationMonths,
        classLimit: plan.classLimit,
        price: plan.price,
      },
      razorpayOrderId: orderId,
      amount: plan.price,
      currency: plan.currency || "INR",
      status: "created",
    });

    res.status(200).json({
      success: true,
      order: { id: orderId, amount: Math.round(plan.price * 100), currency: plan.currency || "INR", planName: plan.name },
      keyId,
    });
  } catch (error) {
    next(error);
  }
};

export const verifySubscriptionPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = req.body;
    if (!orderId || !paymentId) return next(new HandleError("Payment reference IDs are missing.", 400));

    const payment = await Payment.findOne({
      razorpayOrderId: orderId,
      user: req.user._id,
      type: "subscription",
    });
    if (!payment) return next(new HandleError("Payment order not found for this account.", 404));

    let subscription = await Subscription.findOne({ payment: payment._id });
    if (payment.status === "paid" && !subscription) {
      return next(new HandleError("The paid order is missing its subscription record.", 409));
    }
    if (payment.status !== "paid") {
      const now = new Date();
      const secret = process.env.RAZORPAY_KEY_SECRET;
      const testOrder = orderId.startsWith("order_test_") && testPaymentsAllowed();
      if (secret) {
        const expected = crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
        const actualBuffer = Buffer.from(String(signature || ""));
        const expectedBuffer = Buffer.from(expected);
        const valid = actualBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(actualBuffer, expectedBuffer);
        if (!valid) return next(new HandleError("Payment verification failed. Invalid signature.", 400));
      } else if (!testOrder || !paymentId.startsWith("pay_test_")) {
        return next(new HandleError("Payment verification is not configured.", 503));
      }

      if (!subscription) {
        const snapshot = payment.planSnapshot;
        if (!snapshot?.name || !snapshot.durationMonths || !snapshot.classLimit) {
          return next(new HandleError("The saved plan details for this order are incomplete.", 409));
        }
        const records = await currentState(req.user._id);

        // The plan the user is on right now (if any)
        const activeNow = records.find(
          (item) => item.state === "active" && item.startDate <= now && item.endDate > now
        );

        // A new purchase ALWAYS starts immediately and replaces the current plan
        const startDate = now;
        const endDate = addMonths(startDate, snapshot.durationMonths);

        try {
          subscription = await Subscription.create({
            user: req.user._id,
            plan: payment.plan,
            payment: payment._id,
            planName: snapshot.name,
            planSnapshot: {
              name: snapshot.name,
              durationMonths: snapshot.durationMonths,
              classLimit: snapshot.classLimit,
            },
            pricePaid: payment.amount,
            currency: payment.currency,
            classesAllowed: snapshot.classLimit,
            // Carry over classes already unlocked so they don't lock after upgrading
            classesUsed: activeNow ? Math.min(activeNow.classesUsed, snapshot.classLimit) : 0,
            assignedLessons: activeNow ? activeNow.assignedLessons : [],
            state: "active",
            startDate,
            endDate,
          });
        } catch (error) {
          if (error.code !== 11000) throw error;
          subscription = await Subscription.findOne({ payment: payment._id });
          if (!subscription) throw error;
        }

        // Retire the old active plan and any previously queued plans
        await Subscription.updateMany(
          {
            user: req.user._id,
            _id: { $ne: subscription._id },
            state: { $in: ["active", "upcoming"] },
          },
          { $set: { state: "cancelled" } }
        );
      }

      payment.status = "paid";
      payment.razorpayPaymentId = paymentId;
      payment.razorpaySignature = signature || "test_signature";
      payment.paidAt = now;
      payment.subscription = subscription._id;
      await payment.save();
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully.",
      payment,
      subscription: withClassesLeft(subscription),
    });
  } catch (error) {
    next(error);
  }
};

export const getMySubscription = async (req, res, next) => {
  try {
    const subscriptions = await currentState(req.user._id);
    const now = new Date();
    const current = subscriptions.find((item) => item.state === "active" && item.startDate <= now && item.endDate > now);
    const upcoming = subscriptions.filter((item) => item.state === "upcoming").map(withClassesLeft);
    const history = subscriptions
      .filter((item) => item.state === "expired" || item.state === "cancelled")
      .map(withClassesLeft);
    res.status(200).json({
      success: true,
      current: current ? withClassesLeft(current) : null,
      upcoming,
      history,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find()
      .populate("user", "name email avatar")
      .populate("plan", "name durationMonths classLimit price")
      .populate("payment", "amount status razorpayPaymentId razorpayOrderId paidAt")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, subscriptions: subscriptions.map(withClassesLeft), count: subscriptions.length });
  } catch (error) {
    next(error);
  }
};

export const cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) return next(new HandleError("Subscription not found.", 404));
    if (subscription.state !== "active" && subscription.state !== "upcoming") {
      return next(new HandleError("This subscription can no longer be cancelled.", 400));
    }
    subscription.state = "cancelled";
    await subscription.save();
    res.status(200).json({ success: true, subscription: withClassesLeft(subscription) });
  } catch (error) {
    next(error);
  }
};
