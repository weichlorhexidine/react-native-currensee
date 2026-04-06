import '@/global.css';
import {Image, Pressable, Text, View} from 'react-native';
import {SafeAreaView as RNSafeAreaView} from 'react-native-safe-area-context';
import {styled} from 'nativewind';
import {useClerk, useUser} from '@clerk/expo';
import images from '@/constants/images';
import dayjs from 'dayjs';

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
	const {signOut} = useClerk();
	const {user} = useUser();

	const displayName = user?.fullName ?? user?.firstName ?? 'Account';
	const email = user?.emailAddresses[0]?.emailAddress ?? '';
	const avatarSource = user?.imageUrl ? {uri: user.imageUrl} : images.avatar;
	const memberSince = user?.createdAt ? dayjs(user.createdAt).format('MMMM YYYY') : '';

	return (
		<SafeAreaView className="flex-1 p-5 bg-background">
			<Text className="list-title">Settings</Text>

			<View className="sub-card mt-6 flex-row items-center gap-4">
				<Image source={avatarSource} className="home-avatar"/>
				<View className="min-w-0 flex-1">
					<Text className="sub-title" numberOfLines={1}>{displayName}</Text>
					<Text className="sub-meta" numberOfLines={1}>{email}</Text>
				</View>
			</View>


			<View className="sub-card gap-4 mt-6">
				<Text className="modal-title mb-2">Account</Text>
				<View className="sub-row">
					<Text className="sub-label">Email</Text>
					<Text className="sub-value text-right" numberOfLines={1}>{email}</Text>
				</View>
				<View className="h-px bg-border"/>
				<View className="sub-row">
					<Text className="sub-label">Member since</Text>
					<Text className="sub-value text-right">{memberSince}</Text>
				</View>
			</View>

			<View className="mt-8">
				<Pressable className="auth-button bg-destructive" onPress={() => signOut()}>
					<Text className="text-white auth-button-text">Sign out</Text>
				</Pressable>
			</View>
		</SafeAreaView>
	);
};

export default Settings;
