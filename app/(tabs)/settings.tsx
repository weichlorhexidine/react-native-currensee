import {Text, View} from 'react-native';
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import {styled} from "nativewind";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
	return (
		<SafeAreaView className="flex-1 p-5 bg-background">
			<Text>Settings</Text>
		</SafeAreaView>
	)
}

export default Settings;
