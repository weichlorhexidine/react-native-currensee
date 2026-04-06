import '@/global.css';
import React, {useState} from 'react';
import {Pressable, ScrollView, Text, TextInput, View} from 'react-native';
import {SafeAreaView as RNSafeAreaView} from 'react-native-safe-area-context';
import {styled} from 'nativewind';
import {useSignUp} from '@clerk/expo';
import {type Href, Link, useRouter} from 'expo-router';

const SafeAreaView = styled(RNSafeAreaView);

export default function SignUp() {
	const {signUp, errors, fetchStatus} = useSignUp();
	const router = useRouter();

	const [emailAddress, setEmailAddress] = useState('');
	const [password, setPassword] = useState('');
	const [code, setCode] = useState('');
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async () => {
		try {
			setError(null);
			const res = await signUp.password({emailAddress, password});
			if (res.error) {
				setError(res.error.message);
				return;
			}
			await signUp.verifications.sendEmailCode();
		} catch (err: any) {
			setError(err.message || "An unexpected error occurred");
		}
	};

	const handleVerify = async () => {
		try {
			setError(null);
			const res = await signUp.verifications.verifyEmailCode({code});
			if (res.error) {
				setError(res.error.message);
				return;
			}

			if (signUp.status === 'complete') {
				await signUp.finalize({
					navigate: ({session, decorateUrl}) => {
						if (session?.currentTask) return;
						const url = decorateUrl('/(tabs)/');
						router.replace(url as Href);
					},
				});
			}
		} catch (err: any) {
			setError(err.message || "An unexpected error occurred");
		}
	};

	const isVerifying =
		signUp.status === 'missing_requirements' &&
		signUp.unverifiedFields.includes('email_address') &&
		signUp.missingFields.length === 0;

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

						<Text className="auth-title">Verify your email</Text>
						<Text className="auth-subtitle">
							We sent a code to {emailAddress}. Enter it below to activate your account.
						</Text>

						{error && (
							<View className="auth-card mb-4 bg-red-50 border border-red-200">
								<Text className="text-red-600 text-sm p-3">{error}</Text>
							</View>
						)}

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
									<Text className="auth-button-text">Confirm account</Text>
								</Pressable>

								<Pressable
									className="auth-secondary-button"
									onPress={async () => {
										try {
											setError(null);
											const res = await signUp.verifications.sendEmailCode();
											if (res.error) setError(res.error.message);
										} catch (err: any) {
											setError(err.message || "An unexpected error occurred");
										}
									}}
									disabled={fetchStatus === 'fetching'}
								>
									<Text className="auth-secondary-button-text">Resend code</Text>
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

					<Text className="auth-title">Create account</Text>
					<Text className="auth-subtitle">Start tracking your subscriptions</Text>

					{error && (
						<View className="auth-card mb-4 bg-red-50 border border-red-200">
							<Text className="text-red-600 text-sm p-3">{error}</Text>
						</View>
					)}

					<View className="auth-card">
						<View className="auth-form">
							<View className="auth-field">
								<Text className="auth-label">Email address</Text>
								<TextInput
									className={`auth-input${errors?.fields?.emailAddress ? ' auth-input-error' : ''}`}
									autoCapitalize="none"
									value={emailAddress}
									placeholder="you@example.com"
									placeholderTextColor="rgba(0,0,0,0.35)"
									onChangeText={setEmailAddress}
									keyboardType="email-address"
									autoComplete="email"
									textContentType="emailAddress"
								/>
								{errors?.fields?.emailAddress && (
									<Text className="auth-error">{errors.fields.emailAddress.message}</Text>
								)}
							</View>

							<View className="auth-field">
								<Text className="auth-label">Password</Text>
								<TextInput
									className={`auth-input${errors?.fields?.password ? ' auth-input-error' : ''}`}
									value={password}
									placeholder="Create a password"
									placeholderTextColor="rgba(0,0,0,0.35)"
									secureTextEntry
									onChangeText={setPassword}
									autoComplete="new-password"
									textContentType="newPassword"
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
								<Text className="auth-button-text">Create account</Text>
							</Pressable>
						</View>
					</View>

					<View className="auth-link-row">
						<Text className="auth-link-copy">Already have an account?</Text>
						<Link href="/(auth)/sign-in">
							<Text className="auth-link">Sign in</Text>
						</Link>
					</View>

					{/* Required for Clerk bot protection */}
					<View nativeID="clerk-captcha"/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
