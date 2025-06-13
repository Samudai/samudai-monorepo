const nftData = [
    require('./images/1.png'),
    require('./images/2.png'),
    require('./images/3.png'),
    require('./images/4.png'),
    require('./images/5.png'),
    require('./images/6.png'),
];
export default Array.from({ length: 50 }).map((_, id) => ({
    id,
    img: nftData[id % 6],
}));
