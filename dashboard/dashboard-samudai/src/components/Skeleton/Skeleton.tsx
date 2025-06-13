import React from 'react';
import Title from './elements/SkeletonTitle';
import Text from './elements/SkeletonText';
import Avatar from './elements/SkeletonAvatar';
import Block from './elements/SkeletonBlock';
import Button from './elements/SkeletonButton';

type SkeletonProps = {
    className?: string;
    afterStart?: JSX.Element;
    beforeEnd?: JSX.Element;
    component?: keyof JSX.IntrinsicElements;
    skeleton: JSX.Element;
    loading: boolean;
    children: React.ReactNode;
};

const Skeleton: React.FC<SkeletonProps> = ({
    className,
    loading,
    afterStart,
    beforeEnd,
    skeleton,
    component: Component = 'div',
    children,
}) => (
    <Component className={className}>
        {afterStart}
        {loading ? skeleton : children}
        {beforeEnd}
    </Component>
);

export default Object.assign(Skeleton, {
    Title,
    Text,
    Avatar,
    Block,
    Button,
});
