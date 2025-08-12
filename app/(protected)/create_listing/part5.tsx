import { useTheme } from "@/hooks/useTheme";
import { Fragment } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FormSection, useListingForm } from "./components";
import { FORM_LABELS } from "./constants";

export default function TitleDescriptionPage() {
  const theme = useTheme();
  const { bottom } = useSafeAreaInsets();

  // Use Jotai form state
  const { title, description, handleTitleChange, handleDescriptionChange } =
    useListingForm();

  const titleCharacterLimit = 60;
  const descriptionCharacterLimit = 500;

  return (
    <Fragment>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: bottom + 120,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            entering={FadeInUp.delay(100).springify()}
            style={styles.headerContainer}
          >
            <Text
              style={[
                styles.title,
                { color: theme.colors.appTextPrimary },
                theme.fontStyles.bold,
              ]}
            >
              Tell Your Story
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: theme.colors.appTextSecondary },
                theme.fontStyles.medium,
              ]}
            >
              Create a compelling title and description that will attract guests
              to your property
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(200).springify()}
            style={styles.formContainer}
          >
            <FormSection label={FORM_LABELS.title} hint={FORM_LABELS.titleHint}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.titleInput,
                    {
                      backgroundColor: theme.colors.appSurface,
                      borderColor:
                        title.length > 0
                          ? theme.colors.appPrimary
                          : theme.colors.elementsTextFieldBorder,
                      color: theme.colors.appTextPrimary,
                    },
                    theme.fontStyles.medium,
                  ]}
                  placeholder="e.g., Cozy Downtown Apartment with City Views"
                  placeholderTextColor={theme.colors.appTextSecondary}
                  defaultValue={title}
                  onChangeText={handleTitleChange}
                  maxLength={titleCharacterLimit}
                  multiline={false}
                  returnKeyType="next"
                />
                <View style={styles.characterCount}>
                  <Text
                    style={[
                      styles.characterCountText,
                      {
                        color:
                          title.length > titleCharacterLimit * 0.9
                            ? theme.colors.status?.warning || "#F59E0B"
                            : theme.colors.appTextSecondary,
                      },
                    ]}
                  >
                    {title.length}/{titleCharacterLimit}
                  </Text>
                </View>
              </View>
            </FormSection>

            <FormSection
              label={FORM_LABELS.description}
              hint={FORM_LABELS.descriptionHint}
            >
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.descriptionInput,
                    {
                      backgroundColor: theme.colors.appSurface,
                      borderColor:
                        description.length > 0
                          ? theme.colors.appPrimary
                          : theme.colors.elementsTextFieldBorder,
                      color: theme.colors.appTextPrimary,
                    },
                    theme.fontStyles.medium,
                  ]}
                  placeholder="Describe your property's unique features, amenities, location highlights, and what makes it special for guests..."
                  placeholderTextColor={theme.colors.appTextSecondary}
                  defaultValue={description}
                  onChangeText={handleDescriptionChange}
                  maxLength={descriptionCharacterLimit}
                  multiline={true}
                  numberOfLines={8}
                  textAlignVertical="top"
                  returnKeyType="default"
                />
                <View style={styles.characterCount}>
                  <Text
                    style={[
                      styles.characterCountText,
                      {
                        color:
                          description.length > descriptionCharacterLimit * 0.9
                            ? theme.colors.status?.warning || "#F59E0B"
                            : theme.colors.appTextSecondary,
                      },
                    ]}
                  >
                    {description.length}/{descriptionCharacterLimit}
                  </Text>
                </View>
              </View>
            </FormSection>

            {/* Writing Tips */}
            <Animated.View
              entering={FadeInDown.delay(400).springify()}
              style={[
                styles.tipsContainer,
                {
                  backgroundColor: theme.colors.appPrimary + "10",
                  borderColor: theme.colors.appPrimary + "30",
                },
              ]}
            >
              <Text
                style={[
                  styles.tipsTitle,
                  { color: theme.colors.appPrimary },
                  theme.fontStyles.semiBold,
                ]}
              >
                💡 Writing Tips
              </Text>
              <View style={styles.tipsList}>
                <Text
                  style={[
                    styles.tipItem,
                    { color: theme.colors.appTextSecondary },
                    theme.fontStyles.medium,
                  ]}
                >
                  • Highlight unique features and amenities
                </Text>
                <Text
                  style={[
                    styles.tipItem,
                    { color: theme.colors.appTextSecondary },
                    theme.fontStyles.medium,
                  ]}
                >
                  • Mention nearby attractions and transportation
                </Text>
                <Text
                  style={[
                    styles.tipItem,
                    { color: theme.colors.appTextSecondary },
                    theme.fontStyles.medium,
                  ]}
                >
                  • Be honest and accurate in your descriptions
                </Text>
                <Text
                  style={[
                    styles.tipItem,
                    { color: theme.colors.appTextSecondary },
                    theme.fontStyles.medium,
                  ]}
                >
                  • Use descriptive language to paint a picture
                </Text>
              </View>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  formContainer: {
    gap: 32,
  },
  inputContainer: {
    position: "relative",
  },
  titleInput: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    minHeight: 56,
  },
  descriptionInput: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    minHeight: 120,
    maxHeight: 200,
  },
  characterCount: {
    position: "absolute",
    bottom: 8,
    right: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  characterCountText: {
    fontSize: 12,
    fontWeight: "500",
  },
  tipsContainer: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  tipsTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  tipsList: {
    gap: 6,
  },
  tipItem: {
    fontSize: 14,
    lineHeight: 20,
  },
});
