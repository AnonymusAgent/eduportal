'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  Check,
  User,
  BookOpen,
  Upload,
  FileText,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';

interface FormData {
  // Step 1: Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  nationalIdNumber: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  // Guardian Information
  fatherName: string;
  motherName: string;
  guardianName: string;
  guardianPhone: string;
  // Emergency Contact
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  // Step 2: Program Selection
  programId: string;
  campusId: string;
  academicSessionId: string;
  // Step 3: Previous Education
  previousInstitution: string;
  previousQualification: string;
  previousMarks: string;
  previousGrade: string;
  previousYear: string;
  // Step 4: Documents (handled separately)
}

const steps = [
  { id: 1, name: 'Personal Info', icon: User },
  { id: 2, name: 'Program', icon: BookOpen },
  { id: 3, name: 'Education', icon: GraduationCap },
  { id: 4, name: 'Documents', icon: Upload },
  { id: 5, name: 'Review', icon: FileText },
];

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  nationality: '',
  nationalIdNumber: '',
  address: '',
  city: '',
  country: '',
  postalCode: '',
  fatherName: '',
  motherName: '',
  guardianName: '',
  guardianPhone: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelation: '',
  programId: '',
  campusId: '',
  academicSessionId: '',
  previousInstitution: '',
  previousQualification: '',
  previousMarks: '',
  previousGrade: '',
  previousYear: '',
};

export default function ApplyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [programs, setPrograms] = useState<Array<{ value: string; label: string }>>([]);
  const [campuses, setCampuses] = useState<Array<{ value: string; label: string }>>([]);
  const [sessions, setSessions] = useState<Array<{ value: string; label: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [draftSuccess, setDraftSuccess] = useState('');
  const [applicationNumber, setApplicationNumber] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Fetch programs, campuses, and sessions
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const response = await fetch('/api/application/options');
      if (response.ok) {
        const data = await response.json();
        setPrograms(data.programs || []);
        setCampuses(data.campuses || []);
        setSessions(data.sessions || []);
      }
    } catch (error) {
      console.error('Failed to fetch options:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email && formData.phone && formData.dateOfBirth && formData.gender);
      case 2:
        return !!(formData.programId);
      case 3:
        return !!(formData.previousInstitution && formData.previousQualification);
      case 4:
        return true; // Documents are optional for now
      case 5:
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      setError('');
    } else {
      setError('Please fill in all required fields');
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setError('');
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/application/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to submit application');
        setIsLoading(false);
        return;
      }

      setApplicationNumber(data.applicationNumber);
      setIsSubmitted(true);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveDraft = async () => {
    setIsLoading(true);
    setDraftSuccess('');
    setError('');
    try {
      const response = await fetch('/api/application/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, currentStep }),
      });

      if (response.ok) {
        const data = await response.json();
        setApplicationNumber(data.applicationNumber);
        setDraftSuccess(`Draft saved! Your reference number: ${data.applicationNumber}`);
      } else {
        setError('Failed to save draft. Please try again.');
      }
    } catch (err) {
      setError('Failed to save draft. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 mb-2">
            Application Submitted Successfully!
          </h1>
          <p className="text-slate-500 mb-4">
            Your application has been received. You can track your application status using the reference number below.
          </p>
          <div className="bg-white/40 rounded-xl p-4 mb-6">
            <p className="text-sm text-slate-400">Application Reference Number</p>
            <p className="text-xl font-bold text-indigo-600">{applicationNumber}</p>
          </div>
          <p className="text-sm text-slate-400 mb-6">
            Please save this number for future reference. You will receive a confirmation email shortly.
          </p>
          <div className="space-y-3">
            <Link href="/application-status" className="block">
              <Button className="w-full">Track Application Status</Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="outline" className="w-full">Return to Home</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-strong border-b border-white/30 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">EduPortal Academy</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2">
            Apply for Admission
          </h1>
          <p className="text-slate-500">
            Complete the application form to apply for admission at EduPortal Academy
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <nav aria-label="Application progress">
            <ol className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;

                return (
                  <li
                    key={step.id}
                    className={`flex flex-col items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
                  >
                    <div className="flex items-center w-full">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                          isCompleted
                            ? 'bg-indigo-500 border-indigo-500 text-white'
                            : isCurrent
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-slate-300 text-slate-400'
                        }`}
                        aria-current={isCurrent ? 'step' : undefined}
                      >
                        {isCompleted ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 mx-2 ${
                            isCompleted ? 'bg-indigo-500' : 'bg-slate-300'
                          }`}
                        />
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium ${
                        isCurrent ? 'text-indigo-600' : 'text-slate-400'
                      }`}
                    >
                      {step.name}
                    </span>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

        {/* Form */}
        <Card>
          {error && (
            <Alert variant="error" className="mb-4" onDismiss={() => setError('')}>
              {error}
            </Alert>
          )}
          {draftSuccess && (
            <Alert variant="success" className="mb-4" onDismiss={() => setDraftSuccess('')}>
              {draftSuccess}
            </Alert>
          )}

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-800">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
                <Select
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' },
                    { value: 'prefer_not_to_say', label: 'Prefer not to say' },
                  ]}
                  placeholder="Select gender"
                  required
                />
                <Input
                  label="Nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                />
                <Input
                  label="National ID / Passport Number"
                  name="nationalIdNumber"
                  value={formData.nationalIdNumber}
                  onChange={handleInputChange}
                />
              </div>

              <h3 className="text-lg font-semibold text-slate-800 pt-4">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Street Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
                <Input
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                />
                <Input
                  label="Postal Code"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                />
              </div>

              <h3 className="text-lg font-semibold text-slate-800 pt-4">Guardian Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Father's Name"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                />
                <Input
                  label="Mother's Name"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleInputChange}
                />
                <Input
                  label="Guardian Name"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleInputChange}
                />
                <Input
                  label="Guardian Phone"
                  name="guardianPhone"
                  type="tel"
                  value={formData.guardianPhone}
                  onChange={handleInputChange}
                />
              </div>

              <h3 className="text-lg font-semibold text-slate-800 pt-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Contact Name"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleInputChange}
                />
                <Input
                  label="Contact Phone"
                  name="emergencyContactPhone"
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={handleInputChange}
                />
                <Input
                  label="Relationship"
                  name="emergencyContactRelation"
                  value={formData.emergencyContactRelation}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          {/* Step 2: Program Selection */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-800">Program Selection</h2>
              
              <div className="space-y-4">
                <Select
                  label="Select Program"
                  name="programId"
                  value={formData.programId}
                  onChange={handleInputChange}
                  options={programs.length > 0 ? programs : [
                    { value: 'bcs', label: 'Bachelor of Computer Science' },
                    { value: 'mcs', label: 'Master of Computer Science' },
                    { value: 'be', label: 'Bachelor of Engineering' },
                    { value: 'mba', label: 'Master of Business Administration' },
                  ]}
                  placeholder="Choose a program"
                  required
                />

                <Select
                  label="Campus"
                  name="campusId"
                  value={formData.campusId}
                  onChange={handleInputChange}
                  options={campuses.length > 0 ? campuses : [
                    { value: 'main', label: 'Main Campus' },
                  ]}
                  placeholder="Select campus"
                />

                <Select
                  label="Academic Session"
                  name="academicSessionId"
                  value={formData.academicSessionId}
                  onChange={handleInputChange}
                  options={sessions.length > 0 ? sessions : [
                    { value: 'fall2024', label: 'Fall 2024' },
                    { value: 'spring2025', label: 'Spring 2025' },
                  ]}
                  placeholder="Select session"
                />
              </div>
            </div>
          )}

          {/* Step 3: Previous Education */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-800">Previous Education</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Previous Institution Name"
                    name="previousInstitution"
                    value={formData.previousInstitution}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <Input
                  label="Qualification/Degree"
                  name="previousQualification"
                  value={formData.previousQualification}
                  onChange={handleInputChange}
                  placeholder="e.g., High School Diploma, Bachelor's Degree"
                  required
                />
                <Input
                  label="Year of Completion"
                  name="previousYear"
                  type="number"
                  value={formData.previousYear}
                  onChange={handleInputChange}
                  min="1950"
                  max={new Date().getFullYear()}
                />
                <Input
                  label="Marks/Percentage"
                  name="previousMarks"
                  value={formData.previousMarks}
                  onChange={handleInputChange}
                  placeholder="e.g., 85%"
                />
                <Input
                  label="Grade/GPA"
                  name="previousGrade"
                  value={formData.previousGrade}
                  onChange={handleInputChange}
                  placeholder="e.g., A or 3.5"
                />
              </div>
            </div>
          )}

          {/* Step 4: Documents */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-800">Upload Documents</h2>
              <p className="text-slate-500">
                Please upload the following documents. Accepted formats: PDF, JPG, PNG (Max 5MB each)
              </p>
              
              <div className="space-y-4">
                {[
                  { name: 'Photo', description: 'Recent passport-size photograph' },
                  { name: 'ID Document', description: 'National ID card or passport' },
                  { name: 'Academic Transcripts', description: 'Previous academic records' },
                  { name: 'Certificate', description: 'Degree or diploma certificate' },
                ].map((doc) => (
                  <div key={doc.name} className="border-2 border-dashed border-slate-300 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-800">{doc.name}</p>
                        <p className="text-sm text-slate-400">{doc.description}</p>
                      </div>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <span className="px-4 py-2 bg-white/40 hover:bg-white/50 rounded-lg text-sm font-medium text-slate-600 transition-colors">
                          Choose File
                        </span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <Alert variant="info">
                Document upload is optional at this stage. You can upload documents later through your application portal.
              </Alert>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-800">Review Your Application</h2>
              <p className="text-slate-500">
                Please review your information before submitting.
              </p>

              <div className="space-y-4">
                <div className="bg-white/30 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-800 mb-3">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-slate-400">Name:</p>
                    <p className="text-slate-800">{formData.firstName} {formData.lastName}</p>
                    <p className="text-slate-400">Email:</p>
                    <p className="text-slate-800">{formData.email}</p>
                    <p className="text-slate-400">Phone:</p>
                    <p className="text-slate-800">{formData.phone}</p>
                    <p className="text-slate-400">Date of Birth:</p>
                    <p className="text-slate-800">{formData.dateOfBirth}</p>
                  </div>
                </div>

                <div className="bg-white/30 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-800 mb-3">Program Details</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-slate-400">Program:</p>
                    <p className="text-slate-800">{programs.find(p => p.value === formData.programId)?.label || formData.programId || 'Not selected'}</p>
                  </div>
                </div>

                <div className="bg-white/30 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-800 mb-3">Previous Education</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-slate-400">Institution:</p>
                    <p className="text-slate-800">{formData.previousInstitution}</p>
                    <p className="text-slate-400">Qualification:</p>
                    <p className="text-slate-800">{formData.previousQualification}</p>
                    <p className="text-slate-400">Marks:</p>
                    <p className="text-slate-800">{formData.previousMarks || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <Alert variant="warning">
                By submitting this application, you confirm that all information provided is accurate and complete.
              </Alert>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/30">
            <div>
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Previous
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={saveDraft}
                isLoading={isLoading}
              >
                Save Draft
              </Button>
              {currentStep < 5 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  rightIcon={<Check className="w-4 h-4" />}
                >
                  Submit Application
                </Button>
              )}
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
