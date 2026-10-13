import Plan from "../model/planModel.js";
import Subscription from "../model/subscriptionModel.js";
import HandleError from "../helper/handleError.js";

const withSubscriberCount = async (plans) => Promise.all(
  plans.map(async (plan) => ({
    ...plan.toObject(),
    subscribers: await Subscription.countDocuments({ plan: plan._id }),
  }))
);

export const getPlans = async (req, res, next) => {
  try {
    const plans = await Plan.find({ isActive: true }).sort({ price: 1 });
    res.status(200).json({ success: true, plans: await withSubscriberCount(plans) });
  } catch (error) {
    next(error);
  }
};

export const getAdminPlans = async (req, res, next) => {
  try {
    const plans = await Plan.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, plans: await withSubscriberCount(plans) });
  } catch (error) {
    next(error);
  }
};

export const createPlan = async (req, res, next) => {
  try {
    const plan = await Plan.create({
      ...req.body,
      durationMonths: Number(req.body.durationMonths),
      classLimit: Number(req.body.classLimit),
      price: Number(req.body.price),
    });
    res.status(201).json({ success: true, plan });
  } catch (error) {
    next(error);
  }
};

export const updatePlan = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    for (const key of ["durationMonths", "classLimit", "price"]) {
      if (updates[key] !== undefined) updates[key] = Number(updates[key]);
    }
    if (updates.isActive !== undefined) updates.isActive = updates.isActive === true || updates.isActive === "true";
    if (updates.isPopular !== undefined) updates.isPopular = updates.isPopular === true || updates.isPopular === "true";
    const plan = await Plan.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!plan) return next(new HandleError("Plan not found", 404));

    // Keep active and upcoming subscriptions synchronized with plan changes
    const subUpdates = {};
    if (plan.classLimit !== undefined) {
      subUpdates.classesAllowed = plan.classLimit;
      subUpdates["planSnapshot.classLimit"] = plan.classLimit;
    }
    if (plan.name) {
      subUpdates.planName = plan.name;
      subUpdates["planSnapshot.name"] = plan.name;
    }
    if (plan.durationMonths !== undefined) {
      subUpdates["planSnapshot.durationMonths"] = plan.durationMonths;
    }

    if (Object.keys(subUpdates).length > 0) {
      await Subscription.updateMany(
        {
          $or: [{ plan: plan._id }, { "planSnapshot.name": plan.name }],
          state: { $in: ["active", "upcoming"] },
        },
        { $set: subUpdates }
      );
    }

    res.status(200).json({ success: true, plan });
  } catch (error) {
    next(error);
  }
};

export const deletePlan = async (req, res, next) => {
  try {
    const subscribers = await Subscription.countDocuments({ plan: req.params.id });
    if (subscribers > 0) {
      const plan = await Plan.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
      if (!plan) return next(new HandleError("Plan not found", 404));
      return res.status(200).json({
        success: true,
        deactivated: true,
        message: "Plan has subscription history and was hidden instead of deleted.",
      });
    }
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) return next(new HandleError("Plan not found", 404));
    res.status(200).json({ success: true, message: "Plan deleted successfully" });
  } catch (error) {
    next(error);
  }
};