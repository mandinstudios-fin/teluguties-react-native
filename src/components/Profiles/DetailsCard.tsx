import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type PersonalInfo = {
  [key: string]: string | number | undefined;
};

type PersonalInfoCardProps = {
  title?: string;
  data: PersonalInfo;
  labels?: { [key: string]: string };
};

const DetailsCard = ({ 
  title = 'Personal Information', 
  data,
  labels = {} 
}: PersonalInfoCardProps) => {

  const formatLabel = (key: string): string => {
  if (labels[key]) return labels[key];

  return key
    .replace(/_/g, " ") // Convert snake_case to spaces
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Convert camelCase to spaces
    .replace(/\b\w/g, c => c.toUpperCase()); // Capitalize each word
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.fieldsContainer}>
        {Object.entries(data).map(([key, value]) => (
          <View key={key} style={styles.fieldRow}>
            <Text style={styles.label}>{formatLabel(key)}</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.value}>{value?.toString() || 'Not Specified'}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  fieldsContainer: {
    gap: 12,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 15,
    color: '#666',
    width: '40%', // Ensures labels align properly
  },
  valueContainer: {
    flex: 1,
    alignItems: 'flex-end'
  },
  value: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    flexWrap: 'wrap',
  },
});

export default DetailsCard;
