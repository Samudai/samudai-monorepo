export interface GetPageVisitsResponse {
    message: string;
    data: {
        analytics: {
            date: string;
            value: number;
        }[];
    };
}

export interface GetJobApplicantssResponse {
    message: string;
    data: {
        counts: {
            date: string;
            value: number;
        }[];
    };
}

export interface GetActiveProjectTasksResponse {
    message: string;
    data: {
        open_task_count: {
            date: string;
            value: number;
        }[];
    };
}

export interface GetActiveForumsResponse {
    message: string;
    data: {
        active_forum_count: {
            date: string;
            value: number;
        }[];
    };
}

export interface GetPendingProposalsResponse {
    message: string;
    data: {
        pending_proposal_count: {
            date: string;
            value: number;
        }[];
    };
}
