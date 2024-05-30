export const banConfiguration = {
  sceneName: "PostDraft",
  itemPrefix: "h-ban-",
  imageFolder: "tiles",  // Assuming banned heroes use a different folder
  transformations: (item, index, heroes, color) => {
    const offset = 12;  // Space in pixels between each item
    const itemWidth = item.sceneItemTransform.sourceWidth * (100 / item.sceneItemTransform.sourceWidth);

    return {
      sceneName: "PostDraft",
      sceneItemId: item.sceneItemId,
      sceneItemTransform: {
        alignment: 5,
        positionX: color === 'blue' 
          ? (index * (itemWidth + offset)) + 51 
          : 1920 - (index * (itemWidth + offset)) - itemWidth - 51,
        positionY: 277 + offset,
        scaleX: 100 / item.sceneItemTransform.sourceWidth,
        scaleY: 100 / item.sceneItemTransform.sourceHeight,
        cropLeft: 0,
        cropRight: 0,
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
      positionX: color === 'blue' ? 51 : 1920 - 500 - 51, // Fixed X position
      positionY: (index * ((item.sceneItemTransform.sourceHeight * 280 / item.sceneItemTransform.sourceHeight) - (392 * 280 / item.sceneItemTransform.sourceHeight))) + 401, // Calculate Y position based on index
      scaleX: 500 / item.sceneItemTransform.sourceWidth,
      scaleY: 280 / item.sceneItemTransform.sourceHeight,
      cropTop: 112,
      cropBottom: 280,
    }
  })
};
