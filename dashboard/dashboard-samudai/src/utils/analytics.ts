import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { UserActivityRequest, sendTrackingAnalytics } from 'utils/activity/sendTrackingAnalytics';

const getPageId = () => {
    const el = document.querySelector('[data-analytics-page]') as HTMLElement | null;
    if (!el) return null;
    return el.dataset.analyticsPage;
};

const getParentId = (element: HTMLElement): string | null => {
    let currentElement = element.parentElement;
    while (currentElement) {
        if (currentElement.hasAttribute('data-analytics-parent')) {
            return currentElement.getAttribute('data-analytics-parent');
        }
        currentElement = currentElement.parentElement;
    }
    return null;
};

export const onClick = (ev: MouseEvent) => {
    sessionSet();
    const target = ev.target as HTMLElement;
    const analyticsEl = target.closest('[data-analytics-click]') as HTMLElement | null;
    if (analyticsEl) {
        const pageId = getPageId();
        const parentId = getParentId(analyticsEl);
        if (!pageId || !parentId) return;
        const clickId = analyticsEl.dataset.analyticsClick;
        const data: UserActivityRequest = {
            page_id: pageId,
            element_id: clickId!,
            parent_id: parentId,
        };
        sendTrackingAnalytics({ data: data });

        // alert(
        //     JSON.stringify(
        //         {
        //             page_id: pageId,
        //             element_id: clickId,
        //             parent_id: parentId,
        //         },
        //         null,
        //         2
        //     )
        // );
    }
};

export const sessionSet = () => {
    const existingSession = localStorage.getItem('session');
    const sessionTimeNumeral = 15;
    const sessionTimeDenomination = 'minute';
    if (existingSession) {
        const session = JSON.parse(existingSession);
        const now = dayjs();
        const expiry = dayjs(session.expiry);
        if (now.isAfter(expiry)) {
            const uid = uuidv4();
            const newExpiry = now.add(sessionTimeNumeral, sessionTimeDenomination);
            const sessionData = {
                sessionId: uid,
                expiry: newExpiry,
            };
            localStorage.setItem('session', JSON.stringify(sessionData));
        } else {
            const newExpiry = now.add(sessionTimeNumeral, sessionTimeDenomination);
            const sessionData = {
                sessionId: session.sessionId || uuidv4(),
                expiry: newExpiry,
            };
            localStorage.setItem('session', JSON.stringify(sessionData));
        }
    } else {
        const now = dayjs();
        const uid = uuidv4();
        const expiry = now.add(sessionTimeNumeral, sessionTimeDenomination);
        const sessionData = {
            sessionId: uid,
            expiry: expiry,
        };
        localStorage.setItem('session', JSON.stringify(sessionData));
    }
};
