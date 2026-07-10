import { ISkill } from 'utils/types/User';
import { v4 as uuid } from 'uuid';

export class SkillHelper {
    static getDafault(): ISkill[] {
        return [
            { id: 1, name: 'Product Design', icon: '/img/skills/product.svg' },
            { id: 2, name: 'Design systems', icon: '/img/skills/systems.svg' },
            { id: 3, name: 'UI Design', icon: '/img/skills/ui.svg' },
            { id: 4, name: 'User Flow', icon: '/img/skills/user_flow.svg' },
            { id: 5, name: 'User Research', icon: '/img/skills/user_research.svg' },
        ];
    }

    static find(name: string) {
        const sName = name.toLowerCase();

        for (const skill of SkillHelper.getDafault()) {
            if (skill.name.toLowerCase().includes(sName)) {
                return skill;
            }
        }

        return null;
    }

    static create(name: string, find?: boolean) {
        const skill = find === false ? null : SkillHelper.find(name);

        return (
            skill || {
                id: uuid(),
                icon: null,
                name,
            }
        );
    }
}
