export type TRegisterFormData = {
    fullname: string;
    dob: string;
    phoneNumber: string;
    selectedCode: string; 
    gender: string;
}

export interface Agent {
    uid?: string;
    aadhar_number?: string;
    agent_id?: string;
    date_of_birth?: string;
    full_name?: string;
    phone_number?: string;
    mail_id?: string | null;
    profile_pic?: string | null;
    district?: string | null;
    state?: string | null;
    selected_code?: string;
    requests?: any[];
    accepted_requests?: any[];
    rejected_requests?: any[];
}

export interface Profile {
  contactInformation?: {
    email?: string;
    kycDetails?: string;
    phone?: string;
    instagramId?: string;
    profilePicture?: string;
  };
  educationAndCareer?: {
    aboutOccupation?: string;
    annualIncome?: number;
    highestQualification?: string;
    occupation?: string;
    workingPlace?: string;
  };
  familyInformation?: {
    aboutFamily?: string;
    familyType?: string;
    fatherName?: string;
    fatherOccupation?: string;
    nativePlace?: string;
    numberOfSiblings?: number;
  };
  lifestyleAndInterests?: {
    aboutLifestyle?: string;
    drinkingHabits?: string;
    interests?: string[];
    maritalStatus?: string;
  };
  metadata?: {
    createdAt?: string;
    updatedAt?: string;
    isVerified?: boolean;
    agentId?: string;
  };
  partnerPreferences?: {
    aboutPreferences?: string;
    ageRange?: string;
    heightRange?: string;
    preferredCity?: string;
    religion?: string[];
  };
  personalInformation?: {
    age?: number;
    dateOfBirth?: string;
    firstName?: string;
    gender?: string;
    height?: string;
    lastName?: string;
    location?: string;
    motherTongue?: string;
  };
  profileType?: string;
  createdAt?: FieldValue;
  updatedAt?: FieldValue;
}
