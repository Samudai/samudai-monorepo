import { mockup_projects } from 'root/mockup/projects';
import { tryRandomInt } from 'utils/random';

export class ProjectApi {
    static async getAll() {
        // simulation backend response
        await new Promise((res) => setTimeout(res, tryRandomInt(0, 400)));
        const data = mockup_projects;
        if (!Array.isArray(data)) {
            throw Error('Not exist');
        }
        return data;
    }

    static async getOne(id: string) {
        // simulation backend response
        await new Promise((res) => setTimeout(res, tryRandomInt(0, 400)));
        const data = mockup_projects;
        const project = data.find((project) => project.id === id);
        if (!project) {
            throw Error('Not exist');
        }
        return project;
    }

    static async create() {}
    static async update() {}
}
