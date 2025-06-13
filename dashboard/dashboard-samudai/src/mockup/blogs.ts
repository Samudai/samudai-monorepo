import { IBlog } from 'utils/types/Blogs';
import { getRandomInt } from './utils';

const topics = ['Innovations', 'Product Updates', 'Support Related'];
const images = Array(4)
    .fill(null)
    .map((_, id) => `/mockup/img/blog-${id + 1}.png`);

export const mockup_blogs: IBlog[] = Array.from({ length: 4 }).map((_, id) => ({
    id: id.toString(),
    topic: topics[id % topics.length],
    img: images[id % images.length],
    title: 'A simple and detailed guide to POAP NFT',
    content:
        'We’ve been focused on making a the from also not been afraid to and step away been focused create eye...',
    link: '#',
    read: getRandomInt(10, 5000),
    read_time: `${getRandomInt(2, 30)} m`,
    created_at: `2022-${getRandomInt(1, 12)}-${getRandomInt(1, 28)}`,
}));
