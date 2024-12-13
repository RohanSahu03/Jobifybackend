const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    budget: {
        type: Number,
        required: true,
    },
    deadline: {
        type: Date,
        required: true,
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CompanyProfile',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

let Project = mongoose.model('Project', projectSchema);
module.exports = Project;