/**
 * Get model properties and remove those proeprties which are not
 * valuable i.e _meta
 * @param {Model} model - Model object
 */
export const getModelProperties = (model) => {
  return Object.getOwnPropertyNames(model).removeArray([
    "_meta",
    "_setupComplete",
  ]);
};
