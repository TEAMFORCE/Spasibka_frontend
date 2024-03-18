export function getImageURL(path, name){
  const contextMap = {
    "NewTransferImages": require.context("@/assets/NewTransferImages", false, /\.(png|jpg|jpeg|gif|svg)$/),
    "MainLayoutImages": require.context("@/assets/Layouts/MainLayout", false, /\.(png|jpg|jpeg|gif|svg)$/),
    "AwardsImages": require.context("@/assets/AwardsImages", false, /\.(png|jpg|jpeg|gif|svg)$/),
    "SurveysImages": require.context("@/assets/SurveysImages", false, /\.(png|jpg|jpeg|gif|svg)$/)
  }
  if (contextMap[path]) {
    return contextMap[path](`./${name}`);
  } else {
    throw new Error(`Invalid path: ${path}`);
  }
}