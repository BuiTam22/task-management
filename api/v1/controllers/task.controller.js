const Task = require("../models/task.model");
const paginationHelper = require('../../../helper/pagination.js')
// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    }
    if (req.query.status) {
        find.status = req.query.status
    }
    // Pagination
    let initPagination = {
        currentPage: 1,
        limitItems: 2
    };

    const countTask = await Task.countDocuments(find);
    const objectPagination = paginationHelper(initPagination, req.query, countTask);
    // Sort
    const sort = {};

    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    }
    // End Sort

    const tasks = await Task.find(find)
        .sort(sort) 
        // hàm limit là số lượng tối đa của 1 page
        .limit(objectPagination.limitItems)
        // hàm skip là số lượng phần tử cần phải bỏ qua để bắt đầu 1 trang
        .skip(objectPagination.skip);;
    res.json(tasks);
};


// [GET] /api/v1/task/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;

        const task = await Task.findOne({
            _id: id,
            deleted: false
        });

        res.json(task);
    } catch (error) {
        res.json("Không tìm thấy!");
    }
};