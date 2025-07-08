import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export const requestPermissions = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('عذراً، نحتاج لإذن الوصول للصور لتتمكن من رفعها!');
    return false;
  }
  return true;
};

export const pickImage = async () => {
  const hasPermission = await requestPermissions();
  if (!hasPermission) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
    base64: true,
  });

  if (!result.canceled) {
    return result.assets[0];
  }
  return null;
};

export const takePhoto = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    alert('عذراً، نحتاج لإذن الوصول للكاميرا!');
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
    base64: true,
  });

  if (!result.canceled) {
    return result.assets[0];
  }
  return null;
};

export const convertImageToBase64 = async (uri) => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
};

export const getImageMimeType = (uri) => {
  const extension = uri.split('.').pop().toLowerCase();
  switch (extension) {
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'webp':
      return 'image/webp';
    default:
      return 'image/jpeg';
  }
};