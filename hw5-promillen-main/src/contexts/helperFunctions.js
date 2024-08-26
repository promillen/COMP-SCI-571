export const saveCatToSession = (catId) => {
    const savedCatIds = getSavedCatIds();
    if (!savedCatIds.includes(catId)) {
      savedCatIds.push(catId);
      sessionStorage.setItem('savedCatIds', JSON.stringify(savedCatIds));
    }
  };
  
  export const getSavedCatIds = () => {
    const savedCatIds = sessionStorage.getItem('savedCatIds');
    return savedCatIds ? JSON.parse(savedCatIds) : [];
  };
  
  export const isCatSaved = (catId) => {
    const savedCatIds = getSavedCatIds();
    return savedCatIds.includes(catId);
  };