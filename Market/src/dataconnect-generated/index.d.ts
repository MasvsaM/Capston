import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Appointment_Key {
  id: UUIDString;
  __typename?: 'Appointment_Key';
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserVariables {
  displayName: string;
  email?: string | null;
  photoUrl?: string | null;
}

export interface GetPetData {
  pet?: {
    name: string;
    species: string;
    breed: string;
    dateOfBirth: DateString;
  };
}

export interface GetPetVariables {
  id: UUIDString;
}

export interface ListPetsBySpeciesData {
  pets: ({
    id: UUIDString;
    name: string;
    breed: string;
  } & Pet_Key)[];
}

export interface ListPetsBySpeciesVariables {
  species: string;
}

export interface Medication_Key {
  id: UUIDString;
  __typename?: 'Medication_Key';
}

export interface Pet_Key {
  id: UUIDString;
  __typename?: 'Pet_Key';
}

export interface UpdateVaccinationNotesData {
  vaccination_update?: Vaccination_Key | null;
}

export interface UpdateVaccinationNotesVariables {
  id: UUIDString;
  notes?: string | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

export interface Vaccination_Key {
  id: UUIDString;
  __typename?: 'Vaccination_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface GetPetRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPetVariables): QueryRef<GetPetData, GetPetVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetPetVariables): QueryRef<GetPetData, GetPetVariables>;
  operationName: string;
}
export const getPetRef: GetPetRef;

export function getPet(vars: GetPetVariables): QueryPromise<GetPetData, GetPetVariables>;
export function getPet(dc: DataConnect, vars: GetPetVariables): QueryPromise<GetPetData, GetPetVariables>;

interface UpdateVaccinationNotesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateVaccinationNotesVariables): MutationRef<UpdateVaccinationNotesData, UpdateVaccinationNotesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateVaccinationNotesVariables): MutationRef<UpdateVaccinationNotesData, UpdateVaccinationNotesVariables>;
  operationName: string;
}
export const updateVaccinationNotesRef: UpdateVaccinationNotesRef;

export function updateVaccinationNotes(vars: UpdateVaccinationNotesVariables): MutationPromise<UpdateVaccinationNotesData, UpdateVaccinationNotesVariables>;
export function updateVaccinationNotes(dc: DataConnect, vars: UpdateVaccinationNotesVariables): MutationPromise<UpdateVaccinationNotesData, UpdateVaccinationNotesVariables>;

interface ListPetsBySpeciesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListPetsBySpeciesVariables): QueryRef<ListPetsBySpeciesData, ListPetsBySpeciesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListPetsBySpeciesVariables): QueryRef<ListPetsBySpeciesData, ListPetsBySpeciesVariables>;
  operationName: string;
}
export const listPetsBySpeciesRef: ListPetsBySpeciesRef;

export function listPetsBySpecies(vars: ListPetsBySpeciesVariables): QueryPromise<ListPetsBySpeciesData, ListPetsBySpeciesVariables>;
export function listPetsBySpecies(dc: DataConnect, vars: ListPetsBySpeciesVariables): QueryPromise<ListPetsBySpeciesData, ListPetsBySpeciesVariables>;

