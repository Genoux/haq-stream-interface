export const banConfiguration = {
  sceneName: "PostDraft",
  itemPrefix: "h-ban-",
  imageFolder: "splash",  // Assuming banned heroes use a different folder
  transformations: (item, index, heroes, color) => {
    const offset = 12;  // Space in pixels between each item
    const itemWidth = item.sceneItemTransform.sourceWidth * (150 / item.sceneItemTransform.sourceWidth);

    return {
      sceneName: "PostDraft",
      sceneItemId: item.sceneItemId,
      sceneItemTransform: {
        alignment: 5,
        positionX: color === 'blue' 
          ? (index * (itemWidth + offset)) + 51 
          : 1920 - (index * (itemWidth + offset)) - itemWidth - 51,
        positionY: 300,
        scaleX: 400 / item.sceneItemTransform.sourceWidth,
        scaleY: 200 / item.sceneItemTransform.sourceHeight,
        cropLeft: 400,
        cropRight: 400,
      }
    };
  }
};


export const selectConfiguration = {
  sceneName: "PostDraft",
  itemPrefix: "h-",
  imageFolder: "splash",  // Assuming selected heroes use a different image folder
  transformations: (item, index, heroes, color) => ({
    sceneName: "PostDraft",
    sceneItemId: item.sceneItemId,
    sceneItemTransform: {
      alignment: 5,
      positionX: color === 'blue' ? 51 : 1920 - 490 - 51, // Fixed X position
      positionY: (index * ((item.sceneItemTransform.sourceHeight * 280 / item.sceneItemTransform.sourceHeight) - (392 * 280 / item.sceneItemTransform.sourceHeight))) + 401, // Calculate Y position based on index
      scaleX: 490 / item.sceneItemTransform.sourceWidth,
      scaleY: 280 / item.sceneItemTransform.sourceHeight,
      cropTop: 112,
      cropBottom: 280,
    }
  })
};
