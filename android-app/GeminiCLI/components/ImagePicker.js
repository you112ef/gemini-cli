import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActionSheetIOS,
  Platform,
} from 'react-native';
import { pickImage, takePhoto } from '../utils/imageManager';

const ImagePicker = ({ onImageSelected, disabled }) => {
  const showImagePicker = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['إلغاء', 'اختيار من المعرض', 'التقاط صورة'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            handlePickImage();
          } else if (buttonIndex === 2) {
            handleTakePhoto();
          }
        }
      );
    } else {
      Alert.alert(
        'اختيار صورة',
        'كيف تريد إضافة الصورة؟',
        [
          { text: 'إلغاء', style: 'cancel' },
          { text: 'من المعرض', onPress: handlePickImage },
          { text: 'التقاط صورة', onPress: handleTakePhoto },
        ]
      );
    }
  };

  const handlePickImage = async () => {
    try {
      const image = await pickImage();
      if (image) {
        onImageSelected(image);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء اختيار الصورة');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const image = await takePhoto();
      if (image) {
        onImageSelected(image);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء التقاط الصورة');
    }
  };

  return (
    <TouchableOpacity
      style={[styles.imageButton, disabled && styles.imageButtonDisabled]}
      onPress={showImagePicker}
      disabled={disabled}
    >
      <Text style={styles.imageButtonText}>📷</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageButton: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#4285f4',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageButtonDisabled: {
    backgroundColor: '#666666',
  },
  imageButtonText: {
    fontSize: 18,
  },
});

export default ImagePicker;