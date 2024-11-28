const { BADREQUEST, SUCCESS, NOTFOUND } = require("../../config/ResponseCodes");
const { errReturned, sendResponse } = require("../../config/dto");
const { monthNames } = require('../../config/environment/const');
const Leads = require("./leads.model");



/**
 * Create a new lead
 */
exports.createNewLead = async (req, res) => {
    try {
        let { user } = req;
        let { name, email, phone, status } = req['body'];
        let required = ['name', 'email', 'phone', 'status'];


        for (const field of required) {
            if (!req.body[field])
                return sendResponse(res, BADREQUEST, `Please provide ${field}`, []);
        }

        let leadDetails = await Leads.findOne({
            $or: [{ name }, { email }]
        })
        if (leadDetails) return sendResponse(res, BADREQUEST, "Name or Email of this lead is already created")

        let newLead = new Leads({
            name,
            email,
            phone,
            status
        })
        await newLead.save();

        if (!newLead) return sendResponse(res, BADREQUEST, "Something went wrong")
        return sendResponse(res, SUCCESS, "Lead is created successfully");
    } catch (error) { errReturned(res, error) }
}

/**
 * Get All Leads
 */
exports.getAllLeads = async (req, res) => {
    try {

        const allLeads = await Leads.find();
        if (allLeads.length < 1) return sendResponse(res, BADREQUEST, "Unable to get All Leads");

        return sendResponse(res, SUCCESS, "Leads", allLeads)
    } catch (error) { errReturned(res, error) }
}

/**
 * Get Lead Details
 */
exports.getLeadDetails = async (req, res) => {
    try {
        let { id } = req['params'];
        if (!id || id == null || id == 'undefined') return sendResponse(res, BADREQUEST, "Please send the lead id");

        const leadDetails = await Leads.findById(id);
        if (!leadDetails) return sendResponse(res, BADREQUEST, "No Lead Found");

        return sendResponse(res, SUCCESS, "Lead Details", leadDetails)
    } catch (error) { errReturned(res, error) }
}

/**
 * Update Lead
 */
exports.updateLead = async (req, res) => {
    try {

        let { user } = req;
        let { id } = req['params'];
        if (!user) return sendResponse(res, NOTFOUND, 'User NOTFOUND');

        let updateObj = req['body'];
        var { name, email, phone, status } = updateObj;

        for (let prop in updateObj) if (!updateObj[prop]) delete updateObj[prop];

        await Leads.updateOne({ _id: id }, updateObj)

        const updatedLead = await Leads.findById(id)
        return sendResponse(res, SUCCESS, 'Lead Updated Successfully', updatedLead);

    } catch (error) { errReturned(res, error) }
}

/**
 * Delete Lead
 */
exports.deleteLead = async (req, res) => {
    try {

        let { id } = req['params'];

        const leadDetails = await Leads.findById(id);
        if (!leadDetails) return sendResponse(res, NOTFOUND, "Lead not found");

        let response = await Promise.all([
            await Leads.deleteOne({ _id: id })]);

        return sendResponse(res, SUCCESS, `Lead Deleted !`);


    } catch (error) { errReturned(res, error) }
}

/**
 * Dashboard Stats
 */
exports.getStats = async (req, res) => {
    try {

        const currentDate = new Date();
        const thirtyDaysAgo = new Date(currentDate);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const result = await Promise.all([
            Leads.countDocuments(),
            Leads.countDocuments({ status: 'New' }),
            Leads.countDocuments({ status: 'Contacted' }),
            Leads.countDocuments({ status: 'Qualified' }),
            Leads.countDocuments({ status: 'Lost' }),
            Leads.countDocuments({ status: 'Closed' }),

            Leads.aggregate([
                { $match: { createdAt: { $gte: thirtyDaysAgo, $lte: currentDate } } },
                { $group: { _id: { day: { $dayOfMonth: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } }
            ]),

            Leads.aggregate([
                { $match: { createdAt: { $gte: thirtyDaysAgo, $lte: currentDate }, status: 'New' } },
                { $group: { _id: { day: { $dayOfMonth: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
            ]),

        ])

        return sendResponse(res, SUCCESS, "SUCCESS",
            {
                total_leads: result[0],
                new_leads: result[1],
                contacted_leads: result[2],
                qualified_leads: result[3],
                lost_leads: result[4],
                closed_leads: result[5],
                leads_stats_0: formatChartsData(result[6]),
                leads_stats_1: formatChartsData(result[7])
            })
    } catch (error) { errReturned(res, error) }
}

const formatChartsData = result => {
    // Get jobs from the last 30 days grouped by date
    const currentDate = new Date();
    const thirtyDaysAgo = new Date(currentDate);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Generate a list of all dates within the 30-day range
    const allDates = [];
    for (let i = 0; i < 30; i++) {
        const date = new Date(thirtyDaysAgo);
        date.setDate(date.getDate() + i);
        allDates.push({ _id: { day: date.getDate(), month: date.getMonth() + 1 }, count: 0 });
    }

    // Merge the result with allDates, filling in missing dates with 0 counts
    const mergedResult = allDates.map(date => {
        const match = result.find(item => (item._id.day === date._id.day && item._id.month === date._id.month)); return match || date;
    });

    // Format the month names and display the final result
    const formattedResult = mergedResult.map(item => {
        const monthName = monthNames[item._id.month - 1];
        const dateLabel = `${item._id.day} ${monthName}`;
        return { date: dateLabel, count: item.count };
    });

    return formattedResult;
}