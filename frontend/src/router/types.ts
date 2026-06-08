export type RouteComponent = React.LazyExoticComponent<any> | ((props?: any) => JSX.Element);

export interface IRoute {
    path: string;
    component: RouteComponent;
    sidebar: boolean;
    access: string[];
    children?: IRouteChild[];
    meta?: {
        [key: string]: string;
    };
}

export interface IRouteChild {
    path: string;
    component: RouteComponent;
    meta?: {
        [key: string]: string;
    };
}
