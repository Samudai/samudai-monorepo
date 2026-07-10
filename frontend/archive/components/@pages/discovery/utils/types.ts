import { DiscoveryUser } from 'utils/types/Discovery';
import { ISkill, UserRating } from 'utils/types/User';

export type DiscoverySortType = {
  type: keyof DiscoveryUser;
  name: string;
  sign: number;
};

export type DiscoveryTeamSize = {
  id: number;
  min: number;
  max?: number;
}

export type DiscoveryFilterType = {
  opportunity: boolean;
  rating: UserRating[];
  skills: ISkill[];
  bounty: {
    min: number;
    max: number;
  }
  teamSize: DiscoveryTeamSize[];
  isAll: boolean;
};
