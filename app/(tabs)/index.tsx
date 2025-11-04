import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import HelloWorldScreen from '@/components/Lesson 1/HelloWordScreen';
import ProfileScreen from '@/components/Lesson 1/ProfileScreen';
import ProfileUseState from '@/components/Lesson 1/ProfileUseState.';
import HomeWork from '@/components/Lesson 1/HomeWork';
import Baitap1 from '@/components/Lesson 2/Baitap1';
import Calculator3 from '@/components/Lesson 4/Calculate';
import BMICalculator from '@/components/Lesson 5/BMICalculator';
import BMI from '@/components/Lesson 6/BMI';
import Layout from '@/components/Lesson 7/Layout';
import GridLayout from '@/components/Lesson 7/GridLayout';
import GridLayoutMap from '@/components/Lesson 7/GridLayoutMap';
import HomePage from '@/components/Lesson 7/HomePage';
import HomePage2 from '@/components/Lesson 7/HomePage2';
import StudentManager from '@/components/Lesson 9/Array';
import Array2 from '@/components/Lesson 9/Array2';
import Danhba from '@/components/KiemTra/Danhba';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          // source={require('@/assets/images/partial-react-logo.png')}
          // style={styles.reactLogo}
        />
      }>
      {/* <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert('Share pressed')}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert('Delete pressed')}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>

        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView> */}
      {/* <HelloWorldScreen /> */}
      {/* <ProfileScreen name="Y Xa Bế" age={21} /> */}
      {/* <ProfileUseState /> */}
      {/* <HomeWork /> */}
      {/* <Calculator3 /> */}
      {/* <BMICalculator /> */}
      {/* <BMI /> */}
      {/* <Layout /> */}
      {/* <GridLayout /> */}
      {/* <HomePage/> */}
      {/* <Baitap1/> */}
      {/* <StudentManager /> */}
      <Danhba />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
