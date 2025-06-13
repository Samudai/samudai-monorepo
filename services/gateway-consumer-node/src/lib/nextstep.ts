import axios from 'axios';
import {
    GuildInfoResponse,
    MemberGuilds,
    MembersEnums,
    DAOEnums,
} from '@samudai_xyz/gateway-consumer-types';
import { getGuildsWithSteps } from './guilds';
import { getKeysFromArrayofObjects } from './utils';

export const getNextStepForMember = async (member_id: string) => {
    try {
        //Get onboarding step
        let nextStep;
        let memberOnboardingIntegration: { [key: string]: boolean }[] = [];
        let discord_bot = null;
        let guildInfoResponse: GuildInfoResponse[] = [];
        let memberGuildsResponse: MemberGuilds = {};

        const onboardingStep = await axios.get(`${process.env.SERVICE_ACTIVITY}/onboarding/get/${member_id}`);

        let onboardingStepValue = onboardingStep.data.data.steps.length;
        const last_step = onboardingStep.data.data.steps[onboardingStepValue - 1].step_id;

        console.log(onboardingStep.data.data.steps);
        
        const member_type = onboardingStep.data.data.steps[1] ? onboardingStep.data.data.steps[1].value[onboardingStep.data.data.steps[1].value.length - 1].user : null;
        console.log('Member Type', member_type);

        const last_step_count = MembersEnums.MemberOnboardingFlowStepNumber[last_step] as any;
        
        nextStep = MembersEnums.MemberOnboardingFlow[1];
        nextStep = MembersEnums.MemberOnboardingFlow[last_step_count];
        
        // if (member_type && member_type === 'contributor') {
        //     nextStep = MembersEnums.MemberOnboardingFlow[last_step_count];
        // } else if (member_type && member_type === 'admin') {
        //     if (last_step_count === 3) {
        //         nextStep = DAOEnums.DAOOnboardingFlow[0];
        //     } else {
        //         nextStep = MembersEnums.MemberOnboardingFlow[last_step_count];
        //     }
        // } else {
        //     nextStep = MembersEnums.MemberOnboardingFlow[last_step_count];
        // }

        // const member_type = onboardingStep.data.data.steps[1] ? onboardingStep.data.data.steps[1].value[0].user : null;
        // console.log('Member Type', member_type);
        // if (member_type && member_type === 'contributor') {
        //     console;
        //     if (
        //         onboardingStep.data.data.steps.some((step : any) =>
        //             step.step_id === MembersEnums.MemberOnboardingFlowStep.CONNECT_DISCORD
        //         )
        //     ) {
        //         onboardingStepValue = onboardingStepValue - 1;

        //         // const integrations = getKeysFromArrayofObjects(
        //         //     onboardingStep.data.data.steps[onboardingStepValue].value
        //         // );

        //         // integrations.map((integration) => {
        //         //     memberOnboardingIntegration.push({
        //         //         [integration]: true,
        //         //     });
        //         // });
        //     } else {
        //         onboardingStepValue = onboardingStep.data.data.steps.length;
        //     }
        //     nextStep = MembersEnums.MemberOnboardingFlow[onboardingStepValue];
        // } else if (member_type && member_type === 'admin') {
        //     if (
        //         onboardingStep.data.data.steps.some((step : any) =>
        //             step.step_id === MembersEnums.MemberOnboardingFlowStep.CONNECT_DISCORD
        //         )
        //     ) {
        //         // const integrations = getKeysFromArrayofObjects(
        //         //     onboardingStep.data.data.steps[onboardingStepValue].value
        //         // );
        //         // integrations.map((integration) => {
        //         //     memberOnboardingIntegration.push({
        //         //         [integration]: true,
        //         //     });
        //         // });

        //         // const { guildsInfo, memberGuilds } = await getGuildsWithSteps(member_id);
        //         // guildInfoResponse = guildsInfo;
        //         // memberGuildsResponse = memberGuilds;

        //         // Object.keys(memberGuildsResponse).map((guild) => {
        //         //     if (memberGuildsResponse[guild].onboardingIntegration) {
        //         //         memberGuildsResponse[guild].onboardingIntegration.push(...memberOnboardingIntegration);
        //         //     } else {
        //         //         memberGuildsResponse[guild].onboardingIntegration = memberOnboardingIntegration;
        //         //     }
        //         // });
        //         nextStep = DAOEnums.DAOOnboardingFlow[0];
        //     } else {
        //         onboardingStepValue = onboardingStep.data.data.steps.length;
        //         nextStep = MembersEnums.MemberOnboardingFlow[onboardingStepValue];
        //     }
        //     console.log(onboardingStepValue);
        // } else {
        //     nextStep = MembersEnums.MemberOnboardingFlow[onboardingStepValue];
        // }

        return {
            nextStep: nextStep,
            onboardingData: onboardingStep.data.data,
            onboardingIntegration: memberOnboardingIntegration,
            member_type: member_type,
            guildInfoResponse: guildInfoResponse,
            memberGuildsResponse: memberGuildsResponse,
        };
    } catch (err: any) {
        return err;
    }
};

export const getNextStepForDAO = async (dao_id: string) => {
    try {
        let nextStep;
        let onboardingIntegration: { [key: string]: boolean }[] = [];
        const onboardingStep = await axios.get(`${process.env.SERVICE_ACTIVITY}/onboarding/get/${dao_id}`);

        let onboardingStepValue = onboardingStep.data.data.steps.length;

        if (
            onboardingStep.data.data.steps[onboardingStepValue - 1].step_id ===
            MembersEnums.MemberOnboardingFlowStep.SETUP_PROFILE
        ) {
            onboardingStepValue = onboardingStepValue - 1;

            // const integrations = getKeysFromArrayofObjects(onboardingStep.data.data.steps[onboardingStepValue].value);
            // integrations.map((integration) => {
            //     onboardingIntegration.push({
            //         [integration]: true,
            //     });
            // });
            // onboardingIntegration.push({
            //     'discord bot': true,
            // });
        } else {
            onboardingStepValue = onboardingStep.data.data.steps.length;
        }
        // nextStep = DAOEnums.DAOOnboardingFlow[onboardingStepValue];

        return {
            nextStep: nextStep,
            onboardingData: onboardingStep.data.data,
            onboardingIntegration: onboardingIntegration,
        };
    } catch (err: any) {
        return err;
    }
};
