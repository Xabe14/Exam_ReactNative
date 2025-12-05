import { ImageSourcePropType } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";


// Map các ảnh local
const localImages: Record<string, ImageSourcePropType> = {
  bag1: require("../../assets/images/bag1.jpg"),
  hoalen1: require("../../assets/images/hoalen1.jpg"),
  mockhoa1: require("../../assets/images/mockhoa1.jpg"),
  trangsuc: require("../../assets/images/trangsuc.jpg"),
};

// Lấy ảnh cho <Image />: local hoặc Base64
export const getProductImageSource = (
  img: string | null | undefined
): ImageSourcePropType | { uri: string } => {
  if (!img) return localImages.bag1;

  if (img.startsWith("data:image")) {
    // Base64
    return { uri: img };
  }

  // Nếu bạn lưu tên file có đuôi trong DB
  return localImages[img] || localImages.bag1;
};

// --- Chọn ảnh từ thư viện, trả về Base64 ---
export const pickImage = async (): Promise<string | null> => {
  return new Promise((resolve) => {
    launchImageLibrary(
      {
        mediaType: "photo",
        includeBase64: true,
        quality: 0.8,
      },
      (response) => {
        if (
          response.didCancel ||
          !response.assets ||
          response.assets.length === 0
        ) {
          resolve(null);
          return;
        }

        const base64 = response.assets[0].base64;
        if (base64) {
          resolve(`data:image/jpeg;base64,${base64}`);
        } else {
          resolve(null);
        }
      }
    );
  });
};
