import User from "../../models/User.js";
import Quotation from "../company/quotation/quotation.model.js";

/**
 * @desc    Get public customer showcase data
 * @route   GET /api/public/customers
 * @access  Public
 */
export const getPublicCustomers = async (req, res) => {
  try {
    const companies = await User.find({ role: "user" })
      .select("companyName ownerName createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const data = await Promise.all(
      companies.map(async (company) => {
        const quotationCount = await Quotation.countDocuments({
          createdBy: company._id,
        });

        return {
          companyName: company.companyName || company.ownerName,
          quotationCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: companies.length,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch public customers",
    });
  }
};
