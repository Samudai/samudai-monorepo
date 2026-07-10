import { DiscoveryUser } from 'utils/types/Discovery';
import { DiscoveryFilterType, DiscoverySortType, DiscoveryTeamSize } from './types';

export function getSortList(isDao: boolean): DiscoverySortType[] {
  if (isDao) {
    return [
      // { type: 'team_size', name: 'Team Size', sign: 1 },
      // { type: 'team_size', name: 'Team Size (DESC)', sign: -1 },
      // { type: 'open_bounties', name: 'Open Bounties', sign: 1 },
      // { type: 'open_bounties', name: 'Open Bounties (DESC)', sign: -1 },
      { type: 'projects_ongoing', name: 'Ongoing Projects', sign: 1 },
      { type: 'projects_ongoing', name: 'Ongoing Projects (DESC)', sign: -1 },
    ];
  }
  return [
    // { type: 'bounty_earned', name: 'Bounty Earned', sign: 1 },
    // { type: 'bounty_earned', name: 'Bounty Earned (DESC)', sign: -1 },
    { type: 'tasks_ongoing', name: 'Ongoing Projecs', sign: 1 },
    { type: 'tasks_ongoing', name: 'Ongoing Projecs (DESC)', sign: -1 },
  ];
}

export const filterTeamSizes: DiscoveryTeamSize[] = [
  { id: 0, min: 5, max: 10 },
  { id: 1, min: 10, max: 50 },
  { id: 2, min: 50, max: 100 },
  { id: 3, min: 100 },
];

export const getDefaultDiscoveryFilter = () => ({
  isAll: true,
  bounty: {
    min: 1,
    max: 9999999999,
  },
  opportunity: false,
  rating: [],
  skills: [],
  teamSize: [],
});

export const filterValues = (items: any[], filter: DiscoveryFilterType) => {
  if (filter.isAll) {
    return items;
  }
  let result: any[] = [];

  for (let item of items) {
    let { bounty_earned, team_size, user } = item;

    if (bounty_earned < filter.bounty.min || bounty_earned > filter.bounty.max) {
      continue;
    }

    if (filter.teamSize.length > 0) {
      let inRange = false;

      for (let { min, max } of filter.teamSize) {
        if (team_size >= min && team_size <= (max || 99999999999999)) {
          inRange = true;
        }
      }

      if (!inRange) continue;
    }

    if (filter.skills.length > 0) {
      let inRange = false;

      for (let { id } of filter.skills) {
        if (!!user.skills.find((s: { id: string | number }) => s.id === id)) {
          inRange = true;
        }
      }

      if (!inRange) continue;
    }

    if (filter.rating.length > 0) {
      if (!filter.rating.includes(user.rating)) {
        continue;
      }
    }

    result.push(item);
  }

  return result;
};
