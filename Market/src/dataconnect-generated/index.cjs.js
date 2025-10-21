const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'market',
  location: 'southamerica-west1'
};
exports.connectorConfig = connectorConfig;

const createUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser', inputVars);
}
createUserRef.operationName = 'CreateUser';
exports.createUserRef = createUserRef;

exports.createUser = function createUser(dcOrVars, vars) {
  return executeMutation(createUserRef(dcOrVars, vars));
};

const getPetRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPet', inputVars);
}
getPetRef.operationName = 'GetPet';
exports.getPetRef = getPetRef;

exports.getPet = function getPet(dcOrVars, vars) {
  return executeQuery(getPetRef(dcOrVars, vars));
};

const updateVaccinationNotesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateVaccinationNotes', inputVars);
}
updateVaccinationNotesRef.operationName = 'UpdateVaccinationNotes';
exports.updateVaccinationNotesRef = updateVaccinationNotesRef;

exports.updateVaccinationNotes = function updateVaccinationNotes(dcOrVars, vars) {
  return executeMutation(updateVaccinationNotesRef(dcOrVars, vars));
};

const listPetsBySpeciesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPetsBySpecies', inputVars);
}
listPetsBySpeciesRef.operationName = 'ListPetsBySpecies';
exports.listPetsBySpeciesRef = listPetsBySpeciesRef;

exports.listPetsBySpecies = function listPetsBySpecies(dcOrVars, vars) {
  return executeQuery(listPetsBySpeciesRef(dcOrVars, vars));
};
