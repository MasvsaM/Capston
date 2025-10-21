import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'market',
  location: 'southamerica-west1'
};

export const createUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser', inputVars);
}
createUserRef.operationName = 'CreateUser';

export function createUser(dcOrVars, vars) {
  return executeMutation(createUserRef(dcOrVars, vars));
}

export const getPetRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPet', inputVars);
}
getPetRef.operationName = 'GetPet';

export function getPet(dcOrVars, vars) {
  return executeQuery(getPetRef(dcOrVars, vars));
}

export const updateVaccinationNotesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateVaccinationNotes', inputVars);
}
updateVaccinationNotesRef.operationName = 'UpdateVaccinationNotes';

export function updateVaccinationNotes(dcOrVars, vars) {
  return executeMutation(updateVaccinationNotesRef(dcOrVars, vars));
}

export const listPetsBySpeciesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPetsBySpecies', inputVars);
}
listPetsBySpeciesRef.operationName = 'ListPetsBySpecies';

export function listPetsBySpecies(dcOrVars, vars) {
  return executeQuery(listPetsBySpeciesRef(dcOrVars, vars));
}

