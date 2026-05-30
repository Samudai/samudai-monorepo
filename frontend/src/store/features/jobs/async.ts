import { mockup_projects } from 'root/mockup/projects';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProjects = createAsyncThunk('projects/fetchProjects', async (id?: number) => {
    return mockup_projects;
});
