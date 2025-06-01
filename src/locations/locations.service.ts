// locations/locations.service.ts
import { Injectable } from '@nestjs/common';
import { countries } from 'countries-list';
import { UsaStates } from 'usa-states';

export interface Country {
  code: string;
  name: string;
}

export interface State {
  code: string;
  name: string;
}

@Injectable()
export class LocationsService {
  getAllCountries(): any[] {
    return Object.entries(countries).map(([code, details]) => ({
      value:code,
      label: details.name,
    }));
  }

  getCountryByCode(code: string): Country | null {
    const country = countries[code.toUpperCase()];
    if (!country) return null;

    return {
      code,
      name: country.name,
    };
  }

  searchCountries(query: string): Country[] {
    const lowercaseQuery = query.toLowerCase();
    return this.getAllCountries().filter(
      (country) =>
        country.name.toLowerCase().includes(lowercaseQuery) ||
        country.code.toLowerCase().includes(lowercaseQuery),
    );
  }

  getAllUsStates(): any {
    const usStates = new UsaStates();

    return usStates.states.map(state=>({label:state.name, value:state.abbreviation}));
  }

  getStateByCode(code: string): State | null {
    const sanitizedCode = undefined;
    if (!sanitizedCode) return null;

    return {
      code: sanitizedCode,
      name: '',
    };
  }

  searchStates(query: string): State[] {
    const lowercaseQuery = query.toLowerCase();
    return this.getAllUsStates().filter(
      (state) =>
        state.name.toLowerCase().includes(lowercaseQuery) ||
        state.code.toLowerCase().includes(lowercaseQuery),
    );
  }
}
