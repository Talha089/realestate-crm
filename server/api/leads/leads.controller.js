const { BADREQUEST, SUCCESS, NOTFOUND } = require("../../config/ResponseCodes");
const { errReturned, sendResponse } = require("../../config/dto");
const Leads = require("./leads.model");



/**
 * Create a new lead
 */
exports.createNewLead = async (req, res) => {
    try {
        let { user } = req;
        let { name, email, phone } = req['body'];
        let required = ['name', 'email', 'phone'];


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
            phone
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