const User = require('../api/v1/models/user.model');
const { unsubscribe } = require('../api/v1/routes/user.route');

module.exports.requireAuth = async (req, res, next) =>{
    if(req.headers.authorization){
        const token = req.headers.authorization.split(" ")[1];
        const user = await User.findOne({
            token: token,
            deleted: false
        });
        if(!user){
            res.json({
                code: 400,
                message: "token không tồn tại!"
            });
            return;
        }
    
        req.user = user;
        
        next();
    } else{
        res.json({
            code: 400,
            message: "Vui lòng gửi kèm token!"
        });
    }
}