import { mockup_projects } from 'root/mockup/projects';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProjects = createAsyncThunk('projects/fetchProjects', async () => {
    return mockup_projects;
});
