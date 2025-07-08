import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { Audio } from 'expo-av';

const AudioRecorder = ({ onAudioRecorded, disabled }) => {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const durationInterval = useRef(null);

  const requestPermissions = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('إذن مطلوب', 'نحتاج لإذن التسجيل لتتمكن من إرسال رسائل صوتية!');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  };

  const startRecording = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      // Configure audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recordingOptions = {
        android: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      };

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(recordingOptions);
      await newRecording.startAsync();

      setRecording(newRecording);
      setIsRecording(true);
      setRecordingDuration(0);

      // Start duration counter
      durationInterval.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء بدء التسجيل');
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      setIsRecording(false);
      clearInterval(durationInterval.current);

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      if (uri && onAudioRecorded) {
        onAudioRecorded({
          uri,
          duration: recordingDuration,
        });
      }

      setRecording(null);
      setRecordingDuration(0);

    } catch (error) {
      console.error('Error stopping recording:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء إيقاف التسجيل');
    }
  };

  const cancelRecording = async () => {
    try {
      if (!recording) return;

      setIsRecording(false);
      clearInterval(durationInterval.current);

      await recording.stopAndUnloadAsync();
      setRecording(null);
      setRecordingDuration(0);

    } catch (error) {
      console.error('Error canceling recording:', error);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isRecording) {
    return (
      <View style={styles.recordingContainer}>
        <View style={styles.recordingInfo}>
          <View style={styles.recordingIndicator} />
          <Text style={styles.recordingText}>
            جاري التسجيل... {formatDuration(recordingDuration)}
          </Text>
        </View>
        <View style={styles.recordingButtons}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={cancelRecording}
          >
            <Text style={styles.buttonText}>✕</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.stopButton}
            onPress={stopRecording}
          >
            <Text style={styles.buttonText}>⏹</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.recordButton, disabled && styles.recordButtonDisabled]}
      onPress={startRecording}
      disabled={disabled}
    >
      <Text style={styles.recordButtonText}>🎤</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  recordButton: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#4285f4',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButtonDisabled: {
    backgroundColor: '#666666',
  },
  recordButtonText: {
    fontSize: 18,
  },
  recordingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d32f2f',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 8,
  },
  recordingInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    marginRight: 8,
  },
  recordingText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  recordingButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AudioRecorder;