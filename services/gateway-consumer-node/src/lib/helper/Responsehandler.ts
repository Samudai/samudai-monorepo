import { Response } from 'express';
export abstract class CustomResponse {
    status: number;
    message: string;
    res: Response;
    data: any;
    constructor(status: number, message: string, res: Response, data: any) {
        this.status = status;
        this.message = message;
        this.res = res;
        this.data = data;
    }
}

export class BadGateway extends CustomResponse {
    constructor(res: Response, name: string) {
        super(400, `${name} Failed`, res, null);
        res.send({
            message: this.message,
            data: this.data,
        });
    }
}

export class AddSuccess extends CustomResponse {
    constructor(res: Response, name: string, result: any) {
        if (result.hasOwnProperty('data').hasOwnProperty('data')) {
            super(201, `${name} Added Successfully`, res, result.data.data);
        } else if (result.hasOwnProperty('data')) {
            super(201, `${name} Added Successfully`, res, result.data);
        } else {
            super(201, `${name} Added Successfully`, res, result);
        }
        res.send({
            message: this.message,
            data: this.data,
        });
    }
}

export class FetchSuccess extends CustomResponse {
    constructor(res: Response, name: string, result: any) {
        if (result.hasOwnProperty('data').hasOwnProperty('data')) {
            super(200, `${name} Fetched Successfully`, res, result.data.data);
        } else if (result.hasOwnProperty('data')) {
            super(200, `${name} Fetched Successfully`, res, result.data);
        } else {
            super(200, `${name} Fetched Successfully`, res, result);
        }
        res.send({
            message: this.message,
            data: this.data,
        });
    }
}

export class DeleteSuccess extends CustomResponse {
    constructor(res: Response, name: string, result: any) {
        if (result.hasOwnProperty('data').hasOwnProperty('data')) {
            super(200, `${name} Deleted Successfully`, res, result.data.data);
        } else if (result.hasOwnProperty('data')) {
            super(200, `${name} Deleted Successfully`, res, result.data);
        } else {
            super(200, `${name} Deleted Successfully`, res, result);
        }
        res.send({
            message: this.message,
            data: this.data,
        });
    }
}

export class CreateSuccess extends CustomResponse {
    constructor(res: Response, name: string, result: any) {
        if (result.hasOwnProperty('data').hasOwnProperty('data')) {
            super(201, `${name} Created Successfully`, res, result.data.data);
        } else if (result.hasOwnProperty('data')) {
            super(201, `${name} Created Successfully`, res, result.data);
        } else {
            super(201, `${name} Created Successfully`, res, result);
        }
        res.send({
            message: this.message,
            data: this.data,
        });
    }
}

export class UpdateSuccess extends CustomResponse {
    constructor(res: Response, name: string, result: any) {
        if (result.hasOwnProperty('data').hasOwnProperty('data')) {
            super(201, `${name} Updated Successfully`, res, result.data.data);
        } else if (result.hasOwnProperty('data')) {
            super(201, `${name} Updated Successfully`, res, result.data);
        } else {
            super(201, `${name} Updated Successfully`, res, result);
        }
        res.send({
            message: this.message,
            data: this.data,
        });
    }
}

export class VerifySuccess extends CustomResponse {
    constructor(res: Response, name: string, result: any) {
        if (result.hasOwnProperty('data').hasOwnProperty('data')) {
            super(201, `${name} Verified Successfully`, res, result.data.data);
        } else if (result.hasOwnProperty('data')) {
            super(201, `${name} Verified Successfully`, res, result.data);
        } else {
            super(201, `${name} Verified Successfully`, res, result);
        }
        res.send({
            message: this.message,
            data: this.data,
        });
    }
}

export class FeaturedSuccess extends CustomResponse {
    constructor(res: Response, name: string, result: any) {
        super(201, `${name} Added to Featured Successfully`, res, result);
        res.send({
            message: this.message,
            data: this.data,
        });
    }
}

export class UploadSuccess extends CustomResponse {
    constructor(res: Response, name: string, result: any) {
        super(201, `${name} Upload Successful`, res, result);
        res.send({
            message: this.message,
            data: this.data,
        });
    }
}

export class FoundSuccess extends CustomResponse {
    constructor(res: Response, name: string, result: any) {
        super(201, `${name} FOUND`, res, result);
        res.send({
            message: this.message,
            data: this.data,
        });
    }
}

export class UniversalSuccess extends CustomResponse {
    constructor(res: Response, name: string, result: any) {
        super(200, `${name} Successfully`, res, result);
        res.send({
            message: this.message,
            data: this.data,
        });
    }
}
