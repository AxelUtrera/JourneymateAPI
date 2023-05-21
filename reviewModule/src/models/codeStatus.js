const CodeStatus = {
    OK: 200,
    PROCESS_ERROR: 500,
    DATA_REQUIRED: 400,
    INVALID_DATA: 404,
    PENDING_TO_PROCESS: 1,
    ROUTINE_NOT_FOUND : 403,
    CONFLICT : 409
};


module.exports = CodeStatus;