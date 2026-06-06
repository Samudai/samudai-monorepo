import axios from 'axios';
import { jobs } from 'googleapis/build/src/apis/jobs';
import { Bounty, Opportunity } from '@samudai_xyz/gateway-consumer-types';
import { bulkMemberMap } from './memberUtils';

export const getAttachmentJob = async (job: any) => {
    try {
        const depMap = new Map();
        const departmentResponse = await axios.get(`${process.env.SERVICE_DAO}/department/list/${job.dao_id}`);

        departmentResponse.data?.forEach((dep: any) => {
            if (dep.department_id === job.department) {
                depMap.set(dep.department_id, dep.name);
            }
        });

        const jobfiles = await axios.get(`${process.env.SERVICE_JOB}/jobfile/list/${job.job_id}`);

        const created_by = job.created_by;
        const poc_list = job.poc_member_id;
        const memberList = await bulkMemberMap([...[created_by], ...[poc_list]]);
        const memberMap = new Map();
        memberList?.forEach((member: any) => {
            memberMap.set(member.member_id, member);
        });

        job.created_by = memberMap.get(job.created_by) || job.created_by;
        job.poc_member_id = memberMap.get(job.poc_member_id) || job.poc_member_id;
        job.department = depMap.get(job.department) || '';
        job.files = jobfiles.data || [];

        return job;
    } catch (err) {
        return null;
    }
};

export const getAttachmentJobs = async (jobs: Opportunity[]) => {
    try {
        const departments = jobs
            .filter((job: any) => job.department)
            .map((job: any) => {
                return {
                    dao_id: job.dao_id,
                    department_id: job.department,
                };
            });

        const depMap = new Map();
        await Promise.all(
            departments.map(async (department: any) => {
                const departmentResponse = await axios.get(
                    `${process.env.SERVICE_DAO}/department/list/${department.dao_id}`
                );
                departmentResponse.data?.forEach((dep: any) => {
                    if (dep.department_id === department.department_id) {
                        depMap.set(dep.department_id, dep.name);
                    }
                });
            })
        );

        const fileMap = new Map();
        await Promise.all(
            jobs.map(async (job: any) => {
                const jobfiles = await axios.get(`${process.env.SERVICE_JOB}/jobfile/list/${job.job_id}`);

                fileMap.set(job.job_id, jobfiles.data);
            })
        );

        const created_by = jobs.map((job: any) => job.created_by);
        const poc_list = jobs.map((job: any) => job.poc_member_id);
        const memberList = await bulkMemberMap([...created_by, ...poc_list]);
        const memberMap = new Map();
        memberList?.forEach((member: any) => {
            memberMap.set(member.member_id, member);
        });
        jobs = jobs.map((job: any) => {
            job.created_by = memberMap.get(job.created_by) || job.created_by;
            job.poc_member_id = memberMap.get(job.poc_member_id) || job.poc_member_id;
            job.department = depMap.get(job.department) || '';
            job.files = fileMap.get(job.job_id) || [];
            return job;
        });

        return jobs;
    } catch (err) {
        return null;
    }
};

export const getAttachmentBounty = async (bounty: any) => {
    try {
        const depMap = new Map();
        const departmentResponse = await axios.get(`${process.env.SERVICE_DAO}/department/list/${bounty.dao_id}`);

        departmentResponse.data?.forEach((dep: any) => {
            if (dep.department_id === bounty.department) {
                depMap.set(dep.department_id, dep.name);
            }
        });

        const created_by = bounty.created_by;
        const poc_list = bounty.poc_member_id;
        const memberList = await bulkMemberMap([...[created_by!], ...[poc_list!]]);
        const memberMap = new Map();
        memberList?.forEach((member: any) => {
            memberMap.set(member.member_id, member);
        });

        const bountyFiles = await axios.get(`${process.env.SERVICE_JOB}/bountyfile/list/${bounty.bounty_id}`);

        bounty.created_by = memberMap.get(bounty.created_by) || bounty.created_by;
        bounty.poc_member_id = memberMap.get(bounty.poc_member_id) || bounty.poc_member_id;
        bounty.department = depMap.get(bounty.department) || '';
        bounty.files = bountyFiles.data || [];
        return bounty;
    } catch (err) {
        return null;
    }
};

export const getAttachmentBounties = async (bounties: Bounty[]) => {
    try {
        const departments = bounties
            .filter((bounty: any) => bounty.department)
            .map((bounty: any) => {
                return {
                    dao_id: bounty.dao_id,
                    department_id: bounty.department,
                };
            });

        const depMap = new Map();
        await Promise.all(
            departments.map(async (department: any) => {
                const departmentResponse = await axios.get(
                    `${process.env.SERVICE_DAO}/department/list/${department.dao_id}`
                );
                departmentResponse.data?.forEach((dep: any) => {
                    if (dep.department_id === department.department_id) {
                        depMap.set(dep.department_id, dep.name);
                    }
                });
            })
        );

        const fileMap = new Map();
        await Promise.all(
            bounties.map(async (bounty: any) => {
                const bountyFiles = await axios.get(`${process.env.SERVICE_JOB}/bountyfile/list/${bounty.bounty_id}`);
                fileMap.set(bounty.bounty_id, bountyFiles.data);
            })
        );

        const created_by = bounties.map((bounty: any) => bounty.created_by);
        const poc_list = bounties.map((bounty: any) => bounty.poc_member_id);
        const memberList = await bulkMemberMap([...created_by, ...poc_list]);
        const memberMap = new Map();
        memberList?.forEach((member: any) => {
            memberMap.set(member.member_id, member);
        });

        bounties = bounties.map((bounty: any) => {
            bounty.created_by = memberMap.get(bounty.created_by) || bounty.created_by;
            bounty.poc_member_id = memberMap.get(bounty.poc_member_id) || bounty.poc_member_id;
            bounty.department = depMap.get(bounty.department) || '';
            bounty.files = fileMap.get(bounty.bounty_id) || [];
            return bounty;
        });

        return bounties;
    } catch (err) {
        return null;
    }
};
