class HttpError extends Error{
    constructor(message,errorCode){
        super(message);
        this.code=console.errorCode;
    }
}

module.exports=HttpError;