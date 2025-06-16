import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import * as Speech from 'expo-speech';

interface VoiceSearchProps {
  visible: boolean;
  onClose: () => void;
  onSearchResult: (query: string) => void;
}

export function VoiceSearch({ visible, onClose, onSearchResult }: VoiceSearchProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = async () => {
    try {
      setIsListening(true);
      setTranscript('');
      
      // Mock voice recognition since expo-speech doesn't have recognition
      // In a real app, you would use a service like Google Speech-to-Text
      setTimeout(() => {
        const mockTranscripts = [
          'pizza near me',
          'chinese food delivery',
          'burger restaurants',
          'vegetarian options',
          'italian cuisine',
          'spicy food',
          'desserts and sweets',
          'healthy food options'
        ];
        
        const randomTranscript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
        setTranscript(randomTranscript);
        setIsListening(false);
        
        // Speak the recognized text
        Speech.speak(`I heard: ${randomTranscript}`, {
          language: 'en',
          pitch: 1.0,
          rate: 0.8,
        });
      }, 2000);
      
    } catch (error) {
      setIsListening(false);
      Alert.alert('Error', 'Voice recognition failed. Please try again.');
    }
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const handleSearch = () => {
    if (transcript.trim()) {
      onSearchResult(transcript);
      onClose();
      setTranscript('');
    }
  };

  const handleCancel = () => {
    setIsListening(false);
    setTranscript('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleCancel}>
              <IconSymbol name="xmark" size={24} color={colors.icon} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.text }]}>Voice Search</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Voice Animation */}
          <View style={styles.voiceContainer}>
            <View style={[
              styles.voiceCircle,
              {
                backgroundColor: isListening ? colors.primary : colors.secondary,
                transform: [{ scale: isListening ? 1.2 : 1 }],
              }
            ]}>
              <IconSymbol 
                name={isListening ? "waveform" : "mic.fill"} 
                size={48} 
                color={isListening ? 'white' : colors.icon} 
              />
            </View>
            
            {isListening && (
              <View style={styles.pulseContainer}>
                {[1, 2, 3].map((i) => (
                  <View
                    key={i}
                    style={[
                      styles.pulseRing,
                      {
                        borderColor: colors.primary,
                        animationDelay: `${i * 0.3}s`,
                      }
                    ]}
                  />
                ))}
              </View>
            )}
          </View>

          {/* Status Text */}
          <View style={styles.statusContainer}>
            <Text style={[styles.statusText, { color: colors.text }]}>
              {isListening 
                ? 'Listening...' 
                : transcript 
                  ? 'Tap search to continue' 
                  : 'Tap the microphone to start'
              }
            </Text>
            
            {transcript && (
              <View style={[styles.transcriptContainer, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.transcriptText, { color: colors.text }]}>
                  "{transcript}"
                </Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            {!isListening && !transcript && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                onPress={startListening}
              >
                <IconSymbol name="mic.fill" size={20} color="white" />
                <Text style={styles.actionButtonText}>Start Listening</Text>
              </TouchableOpacity>
            )}

            {isListening && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.accent }]}
                onPress={stopListening}
              >
                <IconSymbol name="stop.fill" size={20} color="white" />
                <Text style={styles.actionButtonText}>Stop</Text>
              </TouchableOpacity>
            )}

            {transcript && !isListening && (
              <View style={styles.resultButtons}>
                <TouchableOpacity
                  style={[styles.secondaryButton, { backgroundColor: colors.secondary }]}
                  onPress={startListening}
                >
                  <IconSymbol name="arrow.clockwise" size={16} color={colors.primary} />
                  <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>
                    Try Again
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.primary }]}
                  onPress={handleSearch}
                >
                  <IconSymbol name="magnifyingglass" size={16} color="white" />
                  <Text style={styles.actionButtonText}>Search</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Tips */}
          <View style={styles.tipsContainer}>
            <Text style={[styles.tipsTitle, { color: colors.text }]}>Try saying:</Text>
            <Text style={[styles.tipsText, { color: colors.icon }]}>
              • "Pizza near me"
            </Text>
            <Text style={[styles.tipsText, { color: colors.icon }]}>
              • "Chinese food delivery"
            </Text>
            <Text style={[styles.tipsText, { color: colors.icon }]}>
              • "Vegetarian restaurants"
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  voiceContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  voiceCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    opacity: 0.6,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
  },
  transcriptContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    maxWidth: '100%',
  },
  transcriptText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  tipsContainer: {
    width: '100%',
    alignItems: 'flex-start',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 12,
    marginBottom: 4,
  },
});
