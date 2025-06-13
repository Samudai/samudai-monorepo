import WAbout from '../widgets/w-about/w-about';
import WCalendar from '../widgets/w-calendar/w-calendar';
import WChart from '../widgets/w-chart/w-chart';
import WReviews from '../widgets/w-reviews/w-reviews';

export const getWidgetNames = () => [
    { value: WChart.name, name: 'Chart' },
    { value: WCalendar.name, name: 'Calendar' },
    { value: WAbout.name, name: 'About DAO' },
    { value: WReviews.name, name: 'Reviews' },
];

export const getWidgetData = () => [
    {
        position: 'col1',
        widgets: [
            {
                name: WChart.name,
                draggable: false,
                Widget: WChart,
            },
            {
                name: WCalendar.name,
                draggable: true,
                Widget: WCalendar,
            },
        ],
    },
    {
        position: 'col2',
        widgets: [
            {
                name: WAbout.name,
                draggable: true,
                Widget: WAbout,
            },
            {
                name: WReviews.name,
                draggable: false,
                Widget: WReviews,
            },
        ],
    },
];

export type OnboardingWidgetType = ReturnType<typeof getWidgetData>[0]['widgets'][0];
