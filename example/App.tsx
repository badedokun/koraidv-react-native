/**
 * Kora IDV — bare React Native integration example.
 *
 * Demonstrates the minimum wiring needed to consume @koraidv/react-native
 * in a stock RN app:
 *   1. Import KoraIDV from the SDK
 *   2. Call KoraIDV.configure({ apiKey, tenantId, environment })
 *   3. Trigger a verification with KoraIDV.startVerification({...})
 *
 * For build steps see ./SETUP.md.
 */

import React, {useEffect, useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';

import {KoraIDV} from '@koraidv/react-native';

// Drop your sandbox API key + tenant ID here. Sign up at
// https://sandbox.korastratum.com to get one. The example renders without
// these set, but startVerification will return a 401 from the gateway.
const SANDBOX_API_KEY = process.env.KORAIDV_SANDBOX_API_KEY ?? '';
const SANDBOX_TENANT_ID = process.env.KORAIDV_SANDBOX_TENANT_ID ?? '';

export default function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [status, setStatus] = useState<string>('not configured');
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    if (!SANDBOX_API_KEY || !SANDBOX_TENANT_ID) {
      setStatus('skipped — set KORAIDV_SANDBOX_API_KEY + KORAIDV_SANDBOX_TENANT_ID');
      return;
    }
    setStatus('configuring…');
    KoraIDV.configure({
      apiKey: SANDBOX_API_KEY,
      tenantId: SANDBOX_TENANT_ID,
      environment: 'sandbox',
    })
      .then(() => setStatus('configured ✓'))
      .catch((err: Error) => {
        setStatus('configure failed');
        setLastError(err.message);
      });
  }, []);

  const handleStart = async () => {
    try {
      setStatus('starting verification…');
      const result = await KoraIDV.startVerification({
        externalId: `example-${Date.now()}`,
        tier: 'standard',
      });
      setStatus(`completed: ${result?.status ?? 'unknown'}`);
    } catch (err) {
      const e = err as Error;
      setStatus('verification failed');
      setLastError(e.message);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.section}>
          <Text style={[styles.heading, isDarkMode && styles.textDark]}>
            Kora IDV — RN Example
          </Text>
          <Text style={[styles.body, isDarkMode && styles.textDark]}>
            Bare React Native 0.79 integration of @koraidv/react-native.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, isDarkMode && styles.textDark]}>Status</Text>
          <Text style={[styles.mono, isDarkMode && styles.textDark]}>{status}</Text>
          {lastError && (
            <Text style={[styles.mono, styles.error]}>error: {lastError}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Button
            title="Start verification"
            onPress={handleStart}
            disabled={!status.startsWith('configured')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5'},
  containerDark: {backgroundColor: '#0a0a0a'},
  section: {paddingHorizontal: 20, paddingVertical: 16},
  heading: {fontSize: 24, fontWeight: '700', color: '#111'},
  body: {marginTop: 4, fontSize: 14, color: '#444'},
  label: {fontSize: 12, fontWeight: '600', color: '#666', marginBottom: 4},
  mono: {fontFamily: 'Menlo', fontSize: 13, color: '#111'},
  error: {color: '#c00', marginTop: 4},
  textDark: {color: '#eee'},
});
