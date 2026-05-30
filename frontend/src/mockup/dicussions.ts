import { DiscussionType, IDiscussion } from 'utils/types/Discussions';
import { mockup_users } from './users';
import { getRandomArrayElement, getRandomArrayLength, getRandomInt } from './utils';

export const mockup_discussions: IDiscussion[] = Array(8)
    .fill(null)
    .map((_, id) => ({
        id: (id + 1).toString(),
        author: getRandomArrayElement(mockup_users),
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
        participants: getRandomArrayLength(3, 10).map(() => getRandomArrayElement(mockup_users)),
        topic: 'I live in any area that drives experience — whether it’s initial exploration, critically',
        type: getRandomArrayElement(Object.values(DiscussionType)),
        created_at: `2022-09-${getRandomInt(1, 28)}`,
    }));
