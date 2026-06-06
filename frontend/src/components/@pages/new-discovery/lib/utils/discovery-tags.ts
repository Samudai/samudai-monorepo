export const tagsList = [
    { name: 'Collector', color: '#FFBF87', icon: '#color-filter' },
    { name: 'Grants', color: '#D1B5FF', icon: '#money' },
    { name: 'Impact', color: '#C7FFAC', icon: '#3dcube' },
    { name: 'Investment', color: '#9CDBFF', icon: '#money-recive' },
    { name: 'Media', color: '#FFF7AC', icon: '#music-filter' },
    { name: 'Product', color: '#CCFBD9', icon: '#picture-frame' },
    { name: 'Service', color: '#D1B5FF', icon: '#pen-tool' },
    { name: 'Protocol', color: '#FFF1CE', icon: '#code' },
    { name: 'Social/Community', color: '#7896FF', icon: 'profile' },
    { name: 'Design', color: '#FFBF87', icon: '#color-filter' },
    { name: 'Frontend', color: '#D1B5FF', icon: '#code2' },
    { name: 'Backend', color: '#C7FFAC', icon: '#3dcube' },
    { name: 'Content Creator', color: '#9CDBFF', icon: '#headphone' },
    { name: 'Marketer', color: '#FFF7AC', icon: '#activity' },
    { name: 'Product Manager', color: '#CCFBD9', icon: '#picture-frame' },
];

export const getTagData = (name: string) => {
    return (
        tagsList.find((n) => n.name.toLowerCase().includes(name.toLowerCase())) || {
            name,
            color: '#F9F9F9',
            icon: '#default',
        }
    );
};
