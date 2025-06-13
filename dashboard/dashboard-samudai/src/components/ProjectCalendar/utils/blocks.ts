import dayjs, { Dayjs, UnitTypeShort, QUnitType } from 'dayjs';
import { ProjectResponse } from '@samudai_xyz/gateway-consumer-types';

/* 
  Types
*/
export interface BlockOutput {
    project: ProjectResponse;
    projectStart: Dayjs;
    projectEnd: Dayjs;
    prevRange: boolean;
    nextRange: boolean;
    monthsDuration: number;
    realCols: number;
    cols: number;
    isEmpty: boolean;
}

interface BlockParams {
    type: 'day' | 'week' | 'month';
    minCols: number;
}

type UserBlockParams = {
    [T in keyof BlockParams]?: BlockParams[T];
};

const defaultValues: BlockParams = {
    type: 'day',
    minCols: 2,
};

/* 
  Functions
*/

function getUnits(type: 'day' | 'week' | 'month') {
    return {
        compare: type === 'day' ? 'M' : type === 'week' ? 'quarter' : 'year',
        diff: type === 'day' ? 'd' : type === 'week' ? 'd' : 'M',
    } as {
        compare: QUnitType | UnitTypeShort;
        diff: QUnitType | UnitTypeShort;
    };
}

function _extend(def: BlockParams, params?: UserBlockParams) {
    return { ...def, ...(params || {}) } as BlockParams;
}

export function getBlocks(projects: ProjectResponse[], month: Dayjs, params?: UserBlockParams) {
    const blocks: BlockOutput[] = [];
    const settings = _extend(defaultValues, params);

    const unit = getUnits(settings.type);

    for (const project of projects) {
        const isEmpty = project.start_date === undefined && project.end_date === undefined;
        let projectStart = dayjs(project?.start_date?.substring(0, 10));
        let projectEnd = dayjs(project?.end_date?.substring(0, 10));
        const isBeforeDate = projectEnd.isBefore(month, unit.compare);
        const isAfterDate = projectStart.isAfter(month, unit.compare);
        const monthsDuration = projectEnd.diff(projectStart, 'M');
        let prevRange = false;
        let nextRange = false;
        let realCols = 0;
        let cols = 0;

        if (isBeforeDate || isAfterDate) {
            continue;
        }

        if (projectStart.isBefore(month, unit.compare)) {
            projectStart = month.startOf(unit.compare);
            prevRange = true;
        }

        if (projectEnd.isAfter(month, unit.compare)) {
            projectEnd = month.endOf(unit.compare);
            nextRange = true;
        }

        realCols = projectEnd.diff(projectStart, unit.diff);
        cols = Math.max(realCols, settings.minCols);
        blocks.push({
            projectStart,
            projectEnd,
            project,
            nextRange,
            prevRange,
            monthsDuration,
            realCols,
            cols,
            isEmpty,
        });
    }

    return blocks;
}
