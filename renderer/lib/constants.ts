export const banConfiguration = {
  sceneName: "PostDraft",
  itemPrefix: "h-ban-",
  imageFolder: "tiles",  // Assuming banned heroes use a different folder
  transformations: (item, index, heroes, color) => ({
    sceneName: "PostDraft",
    sceneItemId: item.sceneItemId,
    sceneItemTransform: {
      alignment: 5,
      positionX: color === 'blue' ? (index * (item.sceneItemTransform.sourceWidth * 111 / item.sceneItemTransform.sourceWidth)) + 16 :
                                   (1920 - ((heroes.length - 1 - index + 1) * (item.sceneItemTransform.sourceWidth * 111 / item.sceneItemTransform.sourceWidth))) - 16,
      positionY: 1080 - 111 - 413,
      scaleX: 111 / item.sceneItemTransform.sourceWidth,
      scaleY: 111 / item.sceneItemTransform.sourceHeight,
      cropLeft: 0,
      cropRight: 0,
    }
  })
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
      positionX: color === 'blue' ? (index * ((item.sceneItemTransform.sourceWidth * 730 / item.sceneItemTransform.sourceWidth) - (960 * 730 / item.sceneItemTransform.sourceWidth))) + 16 :
                                   (1920 - ((heroes.length - 1 - index + 1) * ((item.sceneItemTransform.sourceWidth * 730 / item.sceneItemTransform.sourceWidth) - (960 * 730 / item.sceneItemTransform.sourceWidth)))) - 16,
      positionY: 1080 - 413,
      scaleX: 730 / item.sceneItemTransform.sourceWidth,
      scaleY: 413 / item.sceneItemTransform.sourceHeight,
      cropLeft: 480,
      cropRight: 480,
    }
  })
};