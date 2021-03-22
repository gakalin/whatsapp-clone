const userController = {};

/* User Registration */
userController.register = (req, res) => {
    try {

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error,
        })
    }
};

module.exports = userController;