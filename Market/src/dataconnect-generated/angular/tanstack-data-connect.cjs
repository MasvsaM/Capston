const { EnvironmentInjector, inject, signal } = require('@angular/core');
const {
  CallerSdkTypeEnum,
  DataConnect,
  executeMutation,
  executeQuery,
} = require('@angular/fire/data-connect');
const {
  injectMutation,
  injectQuery,
  QueryClient,
} = require('@tanstack/angular-query-experimental');

function getQueryKey(queryRef) {
  const key = [queryRef.name];
  if ('variables' in queryRef && queryRef.variables !== undefined) {
    key.push(queryRef.variables);
  }
  return key;
}

function injectDataConnectQuery(queryRefOrOptionsFn, injector, callerSdkType = CallerSdkTypeEnum.TanstackAngularCore) {
  const dataConnectResult = signal(undefined);
  const finalInjector = injector || inject(EnvironmentInjector);
  const queryKey = signal([]);

  function createOptions() {
    const passedInOptions =
      typeof queryRefOrOptionsFn === 'function'
        ? queryRefOrOptionsFn()
        : undefined;

    const modifiedFn = async () => {
      const ref =
        passedInOptions?.queryFn?.() ||
        (typeof queryRefOrOptionsFn === 'function' ? undefined : queryRefOrOptionsFn);

      if (!ref) {
        throw new Error('DataConnect query requires a query reference.');
      }

      dataConnectResult.set({ ref });
      ref.dataConnect._setCallerSdkType(callerSdkType);
      queryKey.set([ref.name, ref.variables]);
      const response = await executeQuery(ref);
      dataConnectResult.set(response);
      return response.data;
    };

    return {
      queryKey: queryKey(),
      ...passedInOptions,
      queryFn: modifiedFn,
    };
  }

  const originalResult = injectQuery(createOptions, finalInjector);
  return {
    ...originalResult,
    dataConnectResult,
  };
}

function injectDataConnectMutation(factoryFn, optionsFn, injector, callerSdkType = CallerSdkTypeEnum.TanstackAngularCore) {
  const finalInjector = injector || inject(EnvironmentInjector);
  const dataConnect = finalInjector.get(DataConnect);
  const queryClient = finalInjector.get(QueryClient);
  const dataConnectResult = signal(undefined);

  const injectCb = () => {
    const providedOptions = optionsFn?.();
    const modifiedFn = async (args) => {
      const ref =
        (providedOptions &&
          typeof providedOptions === 'object' &&
          'mutationFn' in providedOptions &&
          providedOptions.mutationFn(args)) ||
        (typeof factoryFn === 'function' ? factoryFn(dataConnect, args) : undefined);

      if (!ref) {
        throw new Error('DataConnect mutation requires a mutation factory.');
      }

      dataConnectResult.update((val) => ({
        ...val,
        ref,
      }));
      ref.dataConnect._setCallerSdkType(callerSdkType);
      const response = await executeMutation(ref);

      if (providedOptions?.invalidate) {
        for (const qk of providedOptions.invalidate) {
          if (qk && typeof qk === 'object' && 'name' in qk) {
            const queryKeyValue = getQueryKey(qk);
            const exact = 'variables' in qk && qk.variables !== undefined;
            queryClient.invalidateQueries({
              queryKey: queryKeyValue,
              exact,
            });
          } else {
            queryClient.invalidateQueries({ queryKey: qk });
          }
        }
      }

      dataConnectResult.set(response);
      return response.data;
    };

    return {
      ...providedOptions,
      mutationFn: modifiedFn,
    };
  };

  const originalResult = injectMutation(injectCb, finalInjector);
  return {
    ...originalResult,
    dataConnectResult,
  };
}

module.exports = {
  injectDataConnectQuery,
  injectDataConnectMutation,
};
