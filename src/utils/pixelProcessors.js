/**
 * 图像像素处理工具集
 */

/**
 * 将图片数据中的黑色背景转换为透明
 * @param {ImageData} imageData - Canvas 的 ImageData 对象
 * @param {number} threshold - 黑色阈值 (0-255)，低于此值的 RGB 将被视为背景
 */
export function removeBlackBackground(imageData, threshold = 20) {
  const data = imageData.data
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    
    // 核心算法：如果你想优化边缘平滑度，可以在这里改
    if (r < threshold && g < threshold && b < threshold) {
      data[i + 3] = 0 // Alpha 设为 0 (完全透明)
    }
  }
  
  return imageData
}
