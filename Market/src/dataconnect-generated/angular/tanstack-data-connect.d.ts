import type { Signal, Injector } from '@angular/core';
import type {
  QueryRef,
  QueryResult,
  MutationRef,
  MutationResult,
  CallerSdkType,
} from '@angular/fire/data-connect';
import type {
  CreateQueryResult,
  CreateQueryOptions,
  CreateMutationOptions,
  CreateMutationResult,
  QueryKey,
} from '@tanstack/angular-query-experimental';
import type { FirebaseError } from 'firebase/app';

type CreateDataConnectQueryResult<Data, Variables> = CreateQueryResult<Data, FirebaseError> & {
  dataConnectResult: Signal<Partial<QueryResult<Data, Variables>> | undefined>;
};

type CreateDataConnectMutationResult<Data, Variables, Arguments> = CreateMutationResult<Data, FirebaseError, Arguments> & {
  dataConnectResult: Signal<Partial<MutationResult<Data, Variables>> | undefined>;
};

interface CreateDataConnectQueryOptions<Data, Variables>
  extends Omit<CreateQueryOptions<Data, FirebaseError, Data, QueryKey>, 'queryFn' | 'queryKey'> {
  queryFn: () => QueryRef<Data, Variables>;
}

declare function injectDataConnectQuery<Data, Variables>(
  queryRefOrOptionsFn: QueryRef<Data, Variables> | (() => CreateDataConnectQueryOptions<Data, Variables>),
  injector?: Injector,
  callerSdkType?: CallerSdkType,
): CreateDataConnectQueryResult<Data, Variables>;

type GeneratedSignature<Data, Variables> = (dc: any, vars: Variables) => MutationRef<Data, Variables>;

type DataConnectMutationOptionsFn<Data, Error, Variables, Arguments> = () => Omit<
  CreateMutationOptions<Data, Error, Arguments>,
  'mutationFn'
> & {
  invalidate?: QueryKey | QueryRef<unknown, unknown>[];
  dataConnect?: any;
  mutationFn: (args: Arguments) => MutationRef<Data, Variables>;
};

type DataConnectMutationOptionsUndefinedMutationFn<Data, Error, Variables> = () => Omit<
  ReturnType<DataConnectMutationOptionsFn<Data, Error, Variables, Variables>>,
  'mutationFn'
>;

declare function injectDataConnectMutation<Data, Variables, Arguments>(
  factoryFn: undefined | null,
  optionsFn: DataConnectMutationOptionsFn<Data, FirebaseError, Variables, Arguments>,
  injector?: Injector,
  callerSdkType?: CallerSdkType,
): CreateDataConnectMutationResult<Data, Variables, Arguments>;

declare function injectDataConnectMutation<Data, Variables, Arguments = void | undefined>(
  factoryFn: () => MutationRef<Data, Variables>,
  options?: DataConnectMutationOptionsUndefinedMutationFn<Data, FirebaseError, Variables>,
  injector?: Injector,
  callerSdkType?: CallerSdkType,
): CreateDataConnectMutationResult<Data, Variables, Arguments>;

declare function injectDataConnectMutation<Data, Variables extends undefined, Arguments = void | undefined>(
  factoryFn: () => MutationRef<Data, Variables>,
  options?: DataConnectMutationOptionsUndefinedMutationFn<Data, FirebaseError, Variables>,
  injector?: Injector,
  callerSdkType?: CallerSdkType,
): CreateDataConnectMutationResult<Data, Variables, Arguments>;

declare function injectDataConnectMutation<Data, Variables extends undefined, Arguments = Variables>(
  factoryFn: GeneratedSignature<Data, Variables>,
  optionsFn?: DataConnectMutationOptionsUndefinedMutationFn<Data, FirebaseError, Arguments>,
  injector?: Injector,
  callerSdkType?: CallerSdkType,
): CreateDataConnectMutationResult<Data, Variables, Arguments>;

declare function injectDataConnectMutation<Data, Variables, Arguments extends Variables>(
  factoryFn: GeneratedSignature<Data, Variables>,
  optionsFn?: DataConnectMutationOptionsUndefinedMutationFn<Data, FirebaseError, Arguments>,
  injector?: Injector,
  callerSdkType?: CallerSdkType,
): CreateDataConnectMutationResult<Data, Variables, Arguments>;

export type {
  CreateDataConnectQueryOptions,
  DataConnectMutationOptionsFn,
  DataConnectMutationOptionsUndefinedMutationFn,
  GeneratedSignature,
  CreateDataConnectQueryResult,
  CreateDataConnectMutationResult,
};
export { injectDataConnectQuery, injectDataConnectMutation };
