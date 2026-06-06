export interface ChartGradientType {
    offset: number;
    color: string;
}

export interface ChartPeriodType {
    name: string;
    value: number;
}

export interface ChartTabType {
    type: string;
    name: string;
    color: string;
    gradient: ChartGradientType[];
    value: string | number;
    // icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
    icon: string;
}

export interface ChartTooltipProps {
    active: boolean;
    payload: { value: number }[];
}

export interface ChartData {
    date: string;
    value: number;
}

export interface ChartLineProps {
    period: ChartPeriodType;
    tab: ChartTabType;
    values: ChartData[];
}
