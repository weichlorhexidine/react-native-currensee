import '@/global.css';
import React, {useState} from 'react';
import {Pressable, ScrollView, Text, TextInput, View} from 'react-native';
import {SafeAreaView as RNSafeAreaView} from 'react-native-safe-area-context';
import {styled} from 'nativewind';
import {useSignIn} from '@clerk/expo';
import {type Href, Link, useRouter} from 'expo-router';

const SafeAreaView = styled(RNSafeAreaView);

export default function SignIn() {
    const {signIn, errors, fetchStatus} = useSignIn();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');

    const handleSubmit = async () => {
        const {error} = await signIn.password({emailAddress, password});
        if (error) return;

        if (signIn.status === 'complete') {
            await signIn.finalize({
                navigate: ({session, decorateUrl}) => {
                    if (session?.currentTask) return;
                    const url = decorateUrl('/(tabs)/');
                    router.replace(url as Href);
                },
            });
        } else if (
            signIn.status === 'needs_client_trust' ||
            signIn.status === 'needs_second_factor'
        ) {
            const emailCodeFactor = signIn.supportedSecondFactors?.find(
                (f) => f.strategy === 'email_code',
            );
            if (emailCodeFactor) {
                await signIn.mfa.sendEmailCode();
            }
        }
    };

    const handleVerify = async () => {
        await signIn.mfa.verifyEmailCode({code});

        if (signIn.status === 'complete') {
            await signIn.finalize({
                navigate: ({session, decorateUrl}) => {
                    if (session?.currentTask) return;
                    const url = decorateUrl('/(tabs)/');
                    router.replace(url as Href);
                },
            });
        }
    };

    const isVerifying =
        signIn.status === 'needs_client_trust' ||
        signIn.status === 'needs_second_factor';

    if (isVerifying) {
        return (
            <SafeAreaView className="auth-safe-area">
                <ScrollView className="auth-scroll" keyboardShouldPersistTaps="handled">
                    <View className="auth-content">
                        <View className="auth-brand-block">
                            <View className="auth-logo-wrap">
                                <View className="auth-logo-mark">
                                    <Text className="auth-logo-mark-text">C</Text>
                                </View>
                                <View>
                                    <Text className="auth-wordmark">Currensee</Text>
                                    <Text className="auth-wordmark-sub">subscription management</Text>
                                </View>
                            </View>
                        </View>

                        <Text className="auth-title">Check your email</Text>
                        <Text className="auth-subtitle">
                            We sent a verification code to {emailAddress}
                        </Text>

                        <View className="auth-card">
                            <View className="auth-form">
                                <View className="auth-field">
                                    <Text className="auth-label">Verification code</Text>
                                    <TextInput
                                        className={`auth-input${errors?.fields?.code ? ' auth-input-error' : ''}`}
                                        value={code}
                                        placeholder="Enter code"
                                        placeholderTextColor="rgba(0,0,0,0.35)"
                                        onChangeText={setCode}
                                        keyboardType="number-pad"
                                        autoComplete="one-time-code"
                                    />
                                    {errors?.fields?.code && (
                                        <Text className="auth-error">{errors.fields.code.message}</Text>
                                    )}
                                </View>

                                <Pressable
                                    className={`auth-button${!code || fetchStatus === 'fetching' ? ' auth-button-disabled' : ''}`}
                                    onPress={handleVerify}
                                    disabled={!code || fetchStatus === 'fetching'}
                                >
                                    <Text className="auth-button-text">Verify</Text>
                                </Pressable>

                                <Pressable
                                    className="auth-secondary-button"
                                    onPress={() => signIn.mfa.sendEmailCode()}
                                    disabled={fetchStatus === 'fetching'}
                                >
                                    <Text className="auth-secondary-button-text">Resend code</Text>
                                </Pressable>

                                <Pressable
                                    className="auth-secondary-button"
                                    onPress={() => signIn.reset()}
                                    disabled={fetchStatus === 'fetching'}
                                >
                                    <Text className="auth-secondary-button-text">Start over</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="auth-safe-area">
            <ScrollView className="auth-scroll" keyboardShouldPersistTaps="handled">
                <View className="auth-content">
                    <View className="auth-brand-block">
                        <View className="auth-logo-wrap">
                            <View className="auth-logo-mark">
                                <Text className="auth-logo-mark-text">C</Text>
                            </View>
                            <View>
                                <Text className="auth-wordmark">Currensee</Text>
                                <Text className="auth-wordmark-sub">subscription management</Text>
                            </View>
                        </View>
                    </View>

                    <Text className="auth-title">Welcome back</Text>
                    <Text className="auth-subtitle">Sign in to your account</Text>

                    <View className="auth-card">
                        <View className="auth-form">
                            <View className="auth-field">
                                <Text className="auth-label">Email address</Text>
                                <TextInput
                                    className={`auth-input${errors?.fields?.identifier ? ' auth-input-error' : ''}`}
                                    autoCapitalize="none"
                                    value={emailAddress}
                                    placeholder="you@example.com"
                                    placeholderTextColor="rgba(0,0,0,0.35)"
                                    onChangeText={setEmailAddress}
                                    keyboardType="email-address"
                                    autoComplete="email"
                                    textContentType="emailAddress"
                                />
                                {errors?.fields?.identifier && (
                                    <Text className="auth-error">{errors.fields.identifier.message}</Text>
                                )}
                            </View>

                            <View className="auth-field">
                                <Text className="auth-label">Password</Text>
                                <TextInput
                                    className={`auth-input${errors?.fields?.password ? ' auth-input-error' : ''}`}
                                    value={password}
                                    placeholder="Your password"
                                    placeholderTextColor="rgba(0,0,0,0.35)"
                                    secureTextEntry
                                    onChangeText={setPassword}
                                    autoComplete="current-password"
                                    textContentType="password"
                                />
                                {errors?.fields?.password && (
                                    <Text className="auth-error">{errors.fields.password.message}</Text>
                                )}
                            </View>

                            <Pressable
                                className={`auth-button${!emailAddress || !password || fetchStatus === 'fetching' ? ' auth-button-disabled' : ''}`}
                                onPress={handleSubmit}
                                disabled={!emailAddress || !password || fetchStatus === 'fetching'}
                            >
                                <Text className="auth-button-text">Continue</Text>
                            </Pressable>
                        </View>
                    </View>

                    <View className="auth-link-row">
                        <Text className="auth-link-copy">Don't have an account?</Text>
                        <Link href="/(auth)/sign-up">
                            <Text className="auth-link">Sign up</Text>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
