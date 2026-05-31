import nft1 from './images/1.png';
import nft2 from './images/2.png';
import nft3 from './images/3.png';
import nft4 from './images/4.png';
import nft5 from './images/5.png';
import nft6 from './images/6.png';

const data = [nft1, nft2, nft3, nft4, nft5, nft6];
export default Array.from({ length: 50 }).map((_, id) => ({
    id,
    img: data[id % 6],
}));
