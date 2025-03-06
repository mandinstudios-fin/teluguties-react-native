import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Image,
  Platform,
  Modal,
  Alert,
} from 'react-native';
import Signature from "react-native-signature-canvas";
import useToastHook from '../../utils/useToastHook';

const TermsAndConditionsScreen = ({ handleStep }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const signatureRef = useRef(null);
  const [signature, setSignature] = useState('');
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const { errorToast } = useToastHook();
  const today = new Date().toLocaleDateString('en-GB');

  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const paddingToBottom = 20;

    if (layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  const handleOK = (signatureData) => {
    console.log("Signature Captured:", signatureData);
    setSignature(signatureData);
    setModalVisible(false);
  };

  const handleDonePress = () => {
    
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView
        style={styles.termsContainer}
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
      <Text style={styles.subHeading}>Effective Date: {today}</Text>
      <Text style={styles.paragraph}>
        Welcome to TeluguTies, a matrimonial platform designed to facilitate matchmaking between individuals through agents (brokers) and direct users. By registering as an agent on our platform, you agree to comply with the following terms and conditions. Please read them carefully before proceeding.
      </Text>
      
      <Text style={styles.sectionHeading}>1. Agent Registration and Eligibility</Text>
      <Text style={styles.subSection}>1.1 Eligibility Criteria:</Text>
      <Text style={styles.paragraph}>
        - Only individuals or entities with valid identification documents (e.g., Aadhaar Card, PAN Card, or any government-issued ID) can register as agents.
        - Agents must be at least 18 years of age and legally capable of entering into a binding agreement under Indian law.
        - Agents must provide accurate and complete information during registration, including their name, contact details, experience in matchmaking, and area of operation.
      </Text>
      
      <Text style={styles.subSection}>1.2 Unique Agent Code:</Text>
      <Text style={styles.paragraph}>
        - Upon successful registration, each agent will be assigned a unique Agent Code, which will be used to map profiles and track commissions.
        - The Agent Code is non-transferable and must not be shared with unauthorized individuals or entities.
      </Text>
      
      <Text style={styles.subSection}>1.3 Verification Process:</Text>
      <Text style={styles.paragraph}>
        - The platform reserves the right to verify the credentials of agents through background checks, document verification, or interviews.
        - Failure to meet the verification criteria may result in rejection of the application or suspension of the account.
      </Text>

      <Text style={styles.sectionHeading}>2. Responsibilities of Agents</Text>
      <Text style={styles.subSection}>2.1 Profile Management:</Text>
      <Text style={styles.paragraph}>
        - Agents are responsible for uploading accurate, complete, and truthful profiles of their clients.
        - Profiles must include all necessary details such as name, age, education, occupation, caste/sub-caste, income, horoscope (if applicable), and family background.
        - Agents must ensure that all uploaded profiles comply with the platform’s content guidelines and do not contain offensive, misleading, or inappropriate information.
      </Text>
      
      <Text style={styles.subSection}>2.2 Confidentiality:</Text>
      <Text style={styles.paragraph}>
        - Agents must maintain the confidentiality of client information and must not disclose it to third parties without explicit consent.
        - Any misuse of client data will result in immediate termination of the agent’s account and legal action, if necessary.
      </Text>
      
      <Text style={styles.subSection}>2.3 Ethical Conduct:</Text>
      <Text style={styles.paragraph}>
        - Agents must adhere to ethical practices and avoid engaging in fraudulent activities, misrepresentation, or coercion.
        - Agents must not charge clients additional fees beyond what is agreed upon with the platform.
      </Text>
      
      <Text style={styles.subSection}>2.4 Compliance with Laws:</Text>
      <Text style={styles.paragraph}>
        - Agents must comply with all applicable laws, rules, and regulations in India, including but not limited to the Information Technology Act, 2000, and the Consumer Protection Act, 2019.
      </Text>
      
      <Text style={styles.sectionHeading}>3. Rights and Obligations of the Platform</Text>
      <Text style={styles.paragraph}>
        - The platform will charge a percentage-based commission (e.g., 20–30%) from the agent’s earnings for every successful match facilitated through the platform.
        - Agents must pay the platform fee within the stipulated time frame (e.g., 7 days after receiving payment from clients).
      </Text>
      
      <Text style={styles.sectionHeading}>4. Intellectual Property</Text>
      <Text style={styles.paragraph}>
        - All intellectual property rights related to the platform, including its design, logo, features, and content, belong to TeluguTies.
        - Agents are prohibited from using the platform’s branding, trademarks, or content for personal or commercial purposes without prior written consent.
      </Text>
      
      <Text style={styles.sectionHeading}>5. Payments and Refunds</Text>
      <Text style={styles.paragraph}>
        - Agents will receive their earnings (after deducting the platform’s commission) via bank transfer or digital payment methods.
        - Payments will be processed within 5 business days after confirmation of a successful match.
      </Text>
      
      <Text style={styles.sectionHeading}>6. Limitation of Liability</Text>
      <Text style={styles.paragraph}>
        - The platform does not guarantee successful matches or the accuracy of client information provided by agents.
        - Agents are solely responsible for verifying the authenticity of client details and ensuring compatibility.
      </Text>
      
      <Text style={styles.sectionHeading}>7. Termination</Text>
      <Text style={styles.paragraph}>
        - The platform may suspend or terminate an agent’s account immediately if they violate these terms and conditions, engage in fraudulent or unethical activities, or receive multiple complaints from users.
        - Upon termination, the agent must cease all activities related to the platform and return any confidential information.
      </Text>
      
      <Text style={styles.sectionHeading}>8. Amendments to Terms and Conditions</Text>
      <Text style={styles.paragraph}>
        - TeluguTies reserves the right to modify these terms and conditions at any time.
        - Agents will be notified of changes via email or in-app notifications.
      </Text>
      
      <Text style={styles.sectionHeading}>9. Governing Law and Jurisdiction</Text>
      <Text style={styles.paragraph}>
        - These terms and conditions shall be governed by and construed in accordance with the laws of India.
        - Any disputes arising out of or related to these terms shall be subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana.
      </Text>
      </ScrollView>

      <View style={styles.signatureSection}>
        <TouchableOpacity
          style={styles.openButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>Enter Signature</Text>
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Sign Here</Text>

              {/* Signature Pad */}
              <View style={styles.signatureContainer}>
                <Signature
                  ref={signatureRef}
                  onOK={handleOK}
                  onEmpty={() => console.log("Empty signature")}
                  descriptionText="Sign here"
                  clearText="Clear"
                  confirmText="Save"
                  onEnd={() => {
                    if (signatureRef.current) {
                      signatureRef.current.readSignature(); // Save the signature
                    }
                  }}
                />
              </View>

              {/* Modal Buttons */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    signatureRef?.current.clearSignature();
                    setSignature('');
                  }}
                >
                  <Text style={styles.modalButtonText}>Clear</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    if (signatureRef.current) {
                      signatureRef.current.readSignature(); // Save the signature
                    }
                    handleDonePress()
                  }}
                >
                  <Text style={styles.modalButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>

      {signature && <View style={styles.signatureContainer}>
        <Image source={{ uri: signature }} height={100} width={100} />
      </View>}

      <TouchableOpacity
        style={styles.button2}
        onPress={() => signature ? handleStep() : errorToast("Please give Signature")}
      >
        <Text style={styles.buttonText2}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logo: {
    width: 200,
    height: 50,
    tintColor: '#7D1935', // Burgundy/maroon color for the logo
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: '#000',
  },
  termsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
    paddingVertical: 10
  },
  termsText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#000',
    paddingVertical: 15,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  subsectionTitle: {
    fontWeight: '600',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 3,
  },
  signatureSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    marginHorizontal: 10
  },
  signatureLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  signatureInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#7D1935',
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    flex: 0.48,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#7D1935',
  },
  declineButton: {
    backgroundColor: '#666',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollReminder: {
    textAlign: 'center',
    marginTop: 15,
    color: '#999',
    fontSize: 12,
  },
  button2: { backgroundColor: "#BE7356", padding: 15, borderRadius: 12, alignItems: "center", marginVertical: 20, marginHorizontal: 10 },
  buttonText2: { color: "white", fontWeight: "bold", fontSize: 16 },
  signatureContainer: {
    width: "100%",
    height: 200,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: 'center',
    alignItems: 'center'
  },
  openButton: {
    backgroundColor: "#BE7356",
    padding: 15,
    borderRadius: 12,
    alignItems: "center"
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: 'black'
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20
  },
  modalButton: {
    backgroundColor: "#BE7356",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5
  },
  modalButtonText: { color: "white", fontSize: 16 },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeading: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
    color: '#000'
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#000'
  },
  subSection: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    color: '#000'
  },
  paragraph: {
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
    color: '#000'
  },
});

export default TermsAndConditionsScreen;