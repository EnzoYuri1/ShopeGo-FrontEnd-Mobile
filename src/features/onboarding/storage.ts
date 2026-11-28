import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = 'shopgo-onboarding-seen';

export async function hasSeenOnboarding(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(ONBOARDING_KEY)) === 'true';
  } catch (error) {
    console.warn('[onboardingStorage] hasSeenOnboarding:', error);
    return false;
  }
}

export async function markOnboardingSeen(): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  } catch (error) {
    console.warn('[onboardingStorage] markOnboardingSeen:', error);
  }
}
