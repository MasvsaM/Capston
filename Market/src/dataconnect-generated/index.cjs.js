'use strict';

const ListPetOwnersDocument = `query ListPetOwners {
  petOwners {
    id
    fullName
    email
  }
}`;
const CreatePetOwnerDocument = `mutation CreatePetOwner($owner: PetOwnerInput!) {
  addPetOwner(owner: $owner) {
    id
    fullName
    email
  }
}`;

module.exports = {
  ListPetOwnersDocument,
  CreatePetOwnerDocument,
};
