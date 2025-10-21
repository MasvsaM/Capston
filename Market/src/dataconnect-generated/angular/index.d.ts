import { CreateUserData, CreateUserVariables, GetPetData, GetPetVariables, UpdateVaccinationNotesData, UpdateVaccinationNotesVariables, ListPetsBySpeciesData, ListPetsBySpeciesVariables } from '../';
import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise} from '@angular/fire/data-connect';
import { CreateQueryResult, CreateMutationResult} from '@tanstack/angular-query-experimental';
import { CreateDataConnectQueryResult, CreateDataConnectQueryOptions, CreateDataConnectMutationResult, DataConnectMutationOptionsUndefinedMutationFn } from '@tanstack-query-firebase/angular/data-connect';
import { FirebaseError } from 'firebase/app';
import { Injector } from '@angular/core';

type CreateUserOptions = DataConnectMutationOptionsUndefinedMutationFn<CreateUserData, FirebaseError, CreateUserVariables>;
export function injectCreateUser(options?: CreateUserOptions, injector?: Injector): CreateDataConnectMutationResult<CreateUserData, CreateUserVariables, CreateUserVariables>;

type GetPetArgs = GetPetVariables | (() => GetPetVariables);
export type GetPetOptions = () => Omit<CreateDataConnectQueryOptions<GetPetData, GetPetVariables>, 'queryFn'>;
export function injectGetPet(args: GetPetArgs, options?: GetPetOptions, injector?: Injector): CreateDataConnectQueryResult<GetPetData, GetPetVariables>;

type UpdateVaccinationNotesOptions = DataConnectMutationOptionsUndefinedMutationFn<UpdateVaccinationNotesData, FirebaseError, UpdateVaccinationNotesVariables>;
export function injectUpdateVaccinationNotes(options?: UpdateVaccinationNotesOptions, injector?: Injector): CreateDataConnectMutationResult<UpdateVaccinationNotesData, UpdateVaccinationNotesVariables, UpdateVaccinationNotesVariables>;

type ListPetsBySpeciesArgs = ListPetsBySpeciesVariables | (() => ListPetsBySpeciesVariables);
export type ListPetsBySpeciesOptions = () => Omit<CreateDataConnectQueryOptions<ListPetsBySpeciesData, ListPetsBySpeciesVariables>, 'queryFn'>;
export function injectListPetsBySpecies(args: ListPetsBySpeciesArgs, options?: ListPetsBySpeciesOptions, injector?: Injector): CreateDataConnectQueryResult<ListPetsBySpeciesData, ListPetsBySpeciesVariables>;
