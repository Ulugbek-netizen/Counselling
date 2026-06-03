export type UserRole = "platform_admin" | "school_admin" | "counsellor" | "student";
export type SubscriptionTier = "starter" | "growth" | "professional" | "enterprise";
export type SubscriptionStatus = "active" | "grace_period" | "expired" | "suspended";
export type ApplicationStatus = "considering" | "active" | "submitted" | "accepted" | "rejected" | "waitlisted" | "enrolled";
export type ApplicationType = "ea" | "ed" | "ed2" | "rea" | "rd" | "rolling" | "other";
export type EssayStatus = "not_started" | "draft" | "submitted_for_review" | "final";
export type ExamStatus = "planned" | "taken";
export type SessionStatus = "requested" | "approved" | "rescheduled" | "completed" | "cancelled";
export type DocumentCategory = "transcript" | "recommendation_letter" | "personal_statement" | "cv_resume" | "test_score_report" | "financial_document" | "other";
export type ScholarshipType = "full_tuition" | "partial" | "fixed_amount" | "living_stipend";
export type InvitationStatus = "sent" | "accepted" | "expired";

export interface School {
  id: string;
  name: string;
  country: string | null;
  city: string | null;
  address: string | null;
  logo_url: string | null;
  website: string | null;
  subscription_tier: SubscriptionTier;
  subscription_status: SubscriptionStatus;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  max_students: number;
  max_counsellors: number;
  grace_period_ends_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  school_id: string | null;
  role: UserRole;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  avatar_url: string | null;
  birthday: string | null;
  grade: string | null;
  title: string | null;
  department: string | null;
  phone: string | null;
  show_as_counsellor: boolean;
  preferred_majors: string[] | null;
  preferred_countries: string[] | null;
  budget_range: string | null;
  setup_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface University {
  id: string;
  name: string;
  country: string;
  city: string;
  website: string | null;
  type: string | null;
  tagline: string | null;
  description: string | null;
  tuition_international: number | null;
  tuition_currency: string;
  acceptance_rate_international: number | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UniversityProgram {
  id: string;
  university_id: string;
  name: string;
  degree_type: string | null;
  school_faculty: string | null;
  duration_years: number | null;
  duration_semesters: number | null;
  is_double_degree: boolean;
  is_multi_campus: boolean;
  multi_campus_details: string | null;
  created_at: string;
}

export interface UniversityRequirement {
  id: string;
  university_id: string;
  exam_name: string;
  minimum_score: string | null;
  average_admitted_score: string | null;
  is_required: boolean;
  notes: string | null;
}

export interface UniversityDeadline {
  id: string;
  university_id: string;
  application_type: ApplicationType;
  deadline_date: string;
  decision_date: string | null;
  notes: string | null;
}

export interface UniversityPathway {
  id: string;
  university_id: string;
  platform_name: string;
  url: string | null;
  fee: number | null;
  fee_currency: string;
  fee_waiver_available: boolean;
  applicable_programs: string | null;
  admin_tips: string | null;
}

export interface UniversityFeature {
  id: string;
  university_id: string;
  title: string;
  description: string | null;
  icon: string | null;
}

export interface Application {
  id: string;
  student_id: string;
  university_id: string;
  bookmark_id: string | null;
  application_type: ApplicationType | null;
  status: ApplicationStatus;
  deadline_date: string | null;
  submitted_at: string | null;
  decision_date: string | null;
  decision_received_at: string | null;
  notes: string | null;
  progress_percent: number;
  created_at: string;
  updated_at: string;
}

export interface Essay {
  id: string;
  student_id: string;
  application_id: string | null;
  university_id: string | null;
  title: string;
  content: string | null;
  status: EssayStatus;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface EssayComment {
  id: string;
  essay_id: string;
  author_id: string;
  content: string;
  position_start: number | null;
  position_end: number | null;
  created_at: string;
}

export interface StudentExam {
  id: string;
  student_id: string;
  exam_name: string;
  exam_date: string | null;
  score: string | null;
  status: ExamStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  student_id: string;
  counsellor_id: string;
  requested_by: string;
  subject: string | null;
  notes: string | null;
  scheduled_at: string | null;
  proposed_at: string | null;
  duration_minutes: number;
  status: SessionStatus;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  student_id: string;
  category: DocumentCategory;
  custom_label: string | null;
  file_name: string;
  file_url: string;
  file_size: number | null;
  mime_type: string | null;
  uploaded_by: string;
  created_at: string;
}

export interface Scholarship {
  id: string;
  name: string;
  amount: number | null;
  amount_currency: string;
  eligibility: string | null;
  deadline: string | null;
  required_documents: string | null;
  url: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScholarshipAward {
  id: string;
  application_id: string;
  student_id: string;
  scholarship_name: string;
  amount_per_year: number | null;
  amount_currency: string;
  scholarship_type: ScholarshipType;
  duration_years: number | null;
  is_renewable: boolean;
  renewable_conditions: string | null;
  total_amount: number | null;
  entered_by: string | null;
  verified_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Program {
  id: string;
  name: string;
  type: string | null;
  host_institution: string | null;
  location: string | null;
  country: string | null;
  price: number | null;
  price_currency: string;
  is_free: boolean;
  is_online: boolean;
  start_date: string | null;
  end_date: string | null;
  deadline: string | null;
  description: string | null;
  whats_included: string | null;
  url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  is_read: boolean;
  data: Record<string, unknown> | null;
  created_at: string;
}

export interface AccessRequest {
  id: string;
  student_name: string;
  email: string;
  school_id: string | null;
  school_name_if_missing: string | null;
  note: string | null;
  is_sales_lead: boolean;
  status: string;
  created_at: string;
}

// Supabase Database type for typed queries
export interface Database {
  public: {
    Tables: {
      schools: { Row: School; Insert: Partial<School> & { name: string }; Update: Partial<School> };
      profiles: { Row: Profile; Insert: Partial<Profile> & { id: string; role: UserRole }; Update: Partial<Profile> };
      universities: { Row: University; Insert: Partial<University> & { name: string; country: string; city: string }; Update: Partial<University> };
      university_programs: { Row: UniversityProgram; Insert: Partial<UniversityProgram> & { university_id: string; name: string }; Update: Partial<UniversityProgram> };
      applications: { Row: Application; Insert: Partial<Application> & { student_id: string; university_id: string }; Update: Partial<Application> };
      essays: { Row: Essay; Insert: Partial<Essay> & { student_id: string; title: string }; Update: Partial<Essay> };
      essay_comments: { Row: EssayComment; Insert: Partial<EssayComment> & { essay_id: string; author_id: string; content: string }; Update: Partial<EssayComment> };
      student_exams: { Row: StudentExam; Insert: Partial<StudentExam> & { student_id: string; exam_name: string }; Update: Partial<StudentExam> };
      sessions: { Row: Session; Insert: Partial<Session> & { student_id: string; counsellor_id: string; requested_by: string }; Update: Partial<Session> };
      documents: { Row: Document; Insert: Partial<Document> & { student_id: string; category: DocumentCategory; file_name: string; file_url: string; uploaded_by: string }; Update: Partial<Document> };
      scholarships: { Row: Scholarship; Insert: Partial<Scholarship> & { name: string }; Update: Partial<Scholarship> };
      scholarship_awards: { Row: ScholarshipAward; Insert: Partial<ScholarshipAward> & { application_id: string; student_id: string; scholarship_name: string; scholarship_type: ScholarshipType }; Update: Partial<ScholarshipAward> };
      programs: { Row: Program; Insert: Partial<Program> & { name: string }; Update: Partial<Program> };
      notifications: { Row: Notification; Insert: Partial<Notification> & { user_id: string; type: string; title: string }; Update: Partial<Notification> };
      access_requests: { Row: AccessRequest; Insert: Partial<AccessRequest> & { student_name: string; email: string }; Update: Partial<AccessRequest> };
    };
  };
}
