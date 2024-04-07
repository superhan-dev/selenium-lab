import * as sharp from 'sharp';

export const cropImage = async (imageBuffer, rect) => {
  const image = sharp(imageBuffer);
  return await image.extract(rect).jpeg({ mozjpeg: true }).toBuffer();
};
