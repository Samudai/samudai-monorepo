import React from 'react';
import { DiscussionResponse } from '@samudai_xyz/gateway-consumer-types/';
import { useAddParticipantMutation } from 'store/services/Discussion/discussion';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';

export const useOptIn = (data: DiscussionResponse) => {
    const [optedIn, setOptedIn] = React.useState(data?.opted_in);
    const [addParticipant] = useAddParticipantMutation();

    const handleOptIn = async () => {
        try {
            setOptedIn(true);

            // if (data?.discussion_id) return;
            await addParticipant({
                participant: { discussion_id: data.discussion_id, member_id: getMemberId() },
            }).unwrap();
        } catch (err: any) {
            setOptedIn(false);
            toast('Failure', 5000, 'Cannot Opt-In', err?.data?.message)();
        }
    };

    return {
        optedIn,
        handleOptIn,
    };
};
