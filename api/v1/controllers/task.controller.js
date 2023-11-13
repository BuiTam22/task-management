const Task = require("../models/task.model");
const paginationHelper = require('../../../helper/pagination.js')
const searchHelper = require("../../../helper/search.js");
// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    let objectSearch = searchHelper(req.query);
    const find = {
        deleted: false
    }
    if (req.query.status) {
        find.status = req.query.status
    }

    if (req.query.keyword) {
        find.title = objectSearch.regex;
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


// [GET] /api/v1/tasks/detail/:id
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


// [PATCH] /api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) =>{
    try {
        const id = req.params.id;
        const status = req.body.status;

        await Task.updateOne({
            _id:id
        },
        {
            status:status
        });
        res.json({
            // xác nhận thành công
            code: 200,
            message: "Cập nhật trạng thái thành công"
        });
    } catch (error) {
        res.json({
            // xác nhận thất bại
            code: 400,
            message: "không tồn tại"
        });
    }
    
}


// [PATCH] /api/v1/tasks/change-multi
module.exports.changeMulti = async (req, res) =>{
    try {
        const {ids, key, value} = req.body;''

        switch (key) {
            case "status":
                await Task.updateMany(
                    {_id: ids},
                    {status: value}
                )
                
                res.json({
                    // xác nhận thành công
                    code: 200,
                    message: "Cập nhật trạng thái thành công"
                });
                break; 
            default:
                res.json({
                    // xác nhận thất bại
                    code: 400,
                    message: "không tồn tại"
                });
                break;
        }
    } catch (error) {
        res.json({
            // xác nhận thất bại
            code: 400,
            message: "không tồn tại"
        });
    }
    
}


// [POST] /api/v1/tasks/create
module.exports.create = async (req, res) =>{
    try {
       const task = new Task(req.body);
       const data = await task.save();
       
    res.json({
    // xác nhận thành công
    code: 200,
    message: "Cập nhật trạng thái thành công",
    data: data
    });
    } catch (error) {
        res.json({
            // xác nhận thất bại
            code: 400,
            message: "không tồn tại"
        });
    }
}


// [POST] /api/v1/tasks/edit/:id
module.exports.edit = async (req, res) =>{
    try {
        const id = req.params.id;

        await Task.updateOne({_id: id}, req.body);

        res.json({
            // xác nhận thành công
            code: 200,
            message: "Cập nhật trạng thái thành công"
        });
    } catch (error) {
        res.json({
            // xác nhận thất bại
            code: 400,
            message: "không tồn tại"
        });
    }
}


// [POST] /api/v1/tasks/edit/:id
module.exports.delete = async (req, res) =>{
    try {
        const id = req.params.id;

        await Task.updateOne({_id: id},{
            deleted: true,
            deleteAt: new Date()
        });

        res.json({
            // xác nhận thành công
            code: 200,
            message: "Xóa thành công"
        });
    } catch (error) {
        res.json({
            // xác nhận thất bại
            code: 400,
            message: "không tồn tại"
        });
    }
}