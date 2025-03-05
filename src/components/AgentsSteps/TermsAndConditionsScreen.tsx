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

const TermsAndConditionsScreen = ({ handleStep }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const signatureRef = useRef(null);
  const [signature, setSignature] = useState('');
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

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
        <Text style={styles.termsText}>
          Effective Date: [Insert Date]{'\n\n'}
          Welcome to TeluguTies, a matrimonial platform designed to facilitate matchmaking between individuals through agents (brokers) and direct users. By registering as an agent on our platform, you agree to comply with the following terms and conditions. Please read them carefully before proceeding.{'\n\n'}

          <Text style={styles.sectionTitle}>1. Agent Registration and Eligibility{'\n'}</Text>
          <Text style={styles.subsectionTitle}>1.1 Eligibility Criteria:{'\n'}</Text>
          • Only individuals or entities with valid identification documents (e.g., Aadhaar Card, PAN Card, or any government-issued ID) can register as agents.{'\n'}
          • Agents must be at least 18 years of age and legally capable of entering into a binding agreement under Indian law.{'\n'}
          • Agents must provide accurate and complete information during registration, including their name, contact details, experience in matchmaking, and area of operation.{'\n\n'}

          <Text style={styles.subsectionTitle}>1.2 Unique Agent Code:{'\n'}</Text>
          • Upon successful registration, each agent will be assigned a unique Agent Code, which will be used to map profiles and track commissions.{'\n'}
          • The Agent Code is non-transferable and must not be shared with unauthorized individuals or entities.{'\n\n'}

          <Text style={styles.subsectionTitle}>1.3 Verification Process:{'\n'}</Text>
          • The platform reserves the right to verify the credentials of agents through background checks, document verification, or interviews.{'\n'}
          • Failure to meet the verification criteria may result in rejection of the application or suspension of the account.{'\n\n'}

          <Text style={styles.sectionTitle}>2. Responsibilities of Agents{'\n'}</Text>
          <Text style={styles.subsectionTitle}>2.1 Profile Management:{'\n'}</Text>
          • Agents are responsible for uploading accurate, complete, and truthful profiles of their clients.{'\n'}
          • Profiles must include all necessary details such as name, age, education, occupation, caste/sub-caste, income, horoscope (if applicable), and family background.{'\n'}
          • Agents must ensure that all uploaded profiles comply with the platform's content guidelines and do not contain offensive, misleading, or inappropriate information.{'\n\n'}

          <Text style={styles.subsectionTitle}>2.2 Confidentiality:{'\n'}</Text>
          • Agents must maintain the confidentiality of client information and must not disclose it to third parties without explicit consent.{'\n'}
          • Any misuse of client data will result in immediate termination of the agent's account and legal action, if necessary.{'\n\n'}

          <Text style={styles.subsectionTitle}>2.3 Ethical Conduct:{'\n'}</Text>
          • Agents must adhere to ethical practices and avoid engaging in fraudulent activities, misrepresentation, or coercion.{'\n'}
          • Agents must not charge clients additional fees beyond what is agreed upon with the platform.{'\n\n'}

          <Text style={styles.subsectionTitle}>2.4 Compliance with Laws:{'\n'}</Text>
          • Agents must comply with all applicable laws, rules, and regulations in India, including but not limited to the Information Technology Act, 2000, and the Consumer Protection Act, 2019.{'\n\n'}

          {/* Additional terms content would continue here */}
          <Text style={styles.sectionTitle}>9. Governing Law and Jurisdiction{'\n'}</Text>
          <Text style={styles.subsectionTitle}>9.1 Applicable Law:{'\n'}</Text>
          • These terms and conditions shall be governed by and construed in accordance with the laws of India.{'\n\n'}

          <Text style={styles.subsectionTitle}>9.2 Jurisdiction:{'\n'}</Text>
          • Any disputes arising out of or related to these terms shall be subject to the exclusive jurisdiction of the courts in Hyderabad/Telangana.
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
        onPress={() => signature && handleStep()}
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
    backgroundColor: '#f9f9f9',
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
});

export default TermsAndConditionsScreen;