import { NHLTeam } from '../lib/nhl-teams.types';

class NHLTeamAPIPrototype {
    async fetchTeams(): Promise<NHLTeam[]> {
        const response = await fetch('https://api-web.nhle.com/v1/standings/now');
        if (!response.ok) throw new Error("Failed to fetch teams");
        const data = await response.json();
        return data.standings as NHLTeam[];
    }
}

export const NHLTeamAPI = new NHLTeamAPIPrototype();
