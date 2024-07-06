const asyncHandler = (requestfunction) => {
    return (req,res,next) => {
        Promise.resolve(requestfunction(req,res,next)).catch((err)=> next(err))
    }
}


export {asyncHandler};



/*const asyncHandler = (requestfunction) =>  async (req,res,next) => {
    try {
        await requestfunction(req,res,next);
    } catch (error) {
        res.status(error.code || 500).json({
            success : File,
            message : error.message
        })
    }
}

export {asyncHandler};*/