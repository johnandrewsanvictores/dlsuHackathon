import jobsInfo from "../models/jobsInfoModel.js";



export const getJobInfo = async(req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page -1) * limit;

        const {sort = 'createdAt', order = 'desc'} = req.query;

        const filters = req.query;
        const jobInfos = await jobsInfo.find(filters).sort({ [sort]: order === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limit);;
        res.json({jobInfos});
    } catch (err) {
        res.status(500).json({ error: err });
    }
}

export const getJobs = async (query) => {
    try {
        const page = query.page || 1;
        const limit = query.limit || 10;
        const skip = (page -1) * limit;

        const {sort = 'createdAt', order = 'desc'} = query;

        const filters = query;
        const jobInfos = await jobsInfo.find(filters).sort({ [sort]: order === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limit);;

            return {success: true, jobInfos};
    } catch (err) {
        return {success: false, error: err };
    }
}