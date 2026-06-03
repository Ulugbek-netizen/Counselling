-- EduPath Database Schema
-- Migration: 001_initial_schema
-- All tables with row-level security for multi-school isolation

-- ============================================
-- ENUMS
-- ============================================

create type user_role as enum ('platform_admin', 'school_admin', 'counsellor', 'student');
create type subscription_tier as enum ('starter', 'growth', 'professional', 'enterprise');
create type subscription_status as enum ('active', 'grace_period', 'expired', 'suspended');
create type application_status as enum ('considering', 'active', 'submitted', 'accepted', 'rejected', 'waitlisted', 'enrolled');
create type application_type as enum ('ea', 'ed', 'ed2', 'rea', 'rd', 'rolling', 'other');
create type essay_status as enum ('not_started', 'draft', 'submitted_for_review', 'final');
create type exam_status as enum ('planned', 'taken');
create type session_status as enum ('requested', 'approved', 'rescheduled', 'completed', 'cancelled');
create type document_category as enum ('transcript', 'recommendation_letter', 'personal_statement', 'cv_resume', 'test_score_report', 'financial_document', 'other');
create type scholarship_type as enum ('full_tuition', 'partial', 'fixed_amount', 'living_stipend');
create type invitation_status as enum ('sent', 'accepted', 'expired');

-- ============================================
-- SCHOOLS
-- ============================================

create table schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text,
  city text,
  address text,
  logo_url text,
  website text,
  subscription_tier subscription_tier not null default 'starter',
  subscription_status subscription_status not null default 'active',
  stripe_customer_id text,
  stripe_subscription_id text,
  max_students int not null default 50,
  max_counsellors int not null default 3,
  grace_period_ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  school_id uuid references schools(id) on delete cascade,
  role user_role not null,
  first_name text,
  last_name text,
  email text,
  avatar_url text,
  birthday date,
  grade text,
  title text,
  department text,
  phone text,
  show_as_counsellor boolean default true,
  preferred_majors text[],
  preferred_countries text[],
  budget_range text,
  setup_completed boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- INVITATIONS
-- ============================================

create table invitations (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references schools(id) on delete cascade,
  email text not null,
  role user_role not null,
  invited_by uuid references profiles(id),
  status invitation_status not null default 'sent',
  token text not null unique,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============================================
-- UNIVERSITIES
-- ============================================

create table universities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text not null,
  city text not null,
  website text,
  type text,
  tagline text,
  description text,
  tuition_international numeric,
  tuition_currency text default 'USD',
  acceptance_rate_international numeric,
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table university_programs (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references universities(id) on delete cascade,
  name text not null,
  degree_type text,
  school_faculty text,
  duration_years int,
  duration_semesters int,
  is_double_degree boolean default false,
  is_multi_campus boolean default false,
  multi_campus_details text,
  created_at timestamptz not null default now()
);

create table university_requirements (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references universities(id) on delete cascade,
  exam_name text not null,
  minimum_score text,
  average_admitted_score text,
  is_required boolean default true,
  notes text
);

create table university_deadlines (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references universities(id) on delete cascade,
  application_type application_type not null,
  deadline_date date not null,
  decision_date date,
  notes text
);

create table university_pathways (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references universities(id) on delete cascade,
  platform_name text not null,
  url text,
  fee numeric,
  fee_currency text default 'USD',
  fee_waiver_available boolean default false,
  applicable_programs text,
  admin_tips text
);

create table university_features (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references universities(id) on delete cascade,
  title text not null,
  description text,
  icon text
);

-- ============================================
-- STUDENT UNIVERSITY BOOKMARKS
-- ============================================

create table university_bookmarks (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  university_id uuid not null references universities(id) on delete cascade,
  status application_status not null default 'considering',
  counsellor_notes text,
  approved_by uuid references profiles(id),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(student_id, university_id)
);

-- ============================================
-- APPLICATIONS
-- ============================================

create table applications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  university_id uuid not null references universities(id) on delete cascade,
  bookmark_id uuid references university_bookmarks(id) on delete cascade,
  application_type application_type,
  status application_status not null default 'active',
  deadline_date date,
  submitted_at timestamptz,
  decision_date date,
  decision_received_at timestamptz,
  notes text,
  progress_percent int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- ESSAYS
-- ============================================

create table essays (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  application_id uuid references applications(id) on delete cascade,
  university_id uuid references universities(id),
  title text not null,
  content text,
  status essay_status not null default 'not_started',
  version int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table essay_comments (
  id uuid primary key default gen_random_uuid(),
  essay_id uuid not null references essays(id) on delete cascade,
  author_id uuid not null references profiles(id),
  content text not null,
  position_start int,
  position_end int,
  created_at timestamptz not null default now()
);

create table essay_versions (
  id uuid primary key default gen_random_uuid(),
  essay_id uuid not null references essays(id) on delete cascade,
  content text not null,
  version int not null,
  created_at timestamptz not null default now()
);

-- ============================================
-- EXAMS
-- ============================================

create table student_exams (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  exam_name text not null,
  exam_date date,
  score text,
  status exam_status not null default 'planned',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- SESSIONS
-- ============================================

create table sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  counsellor_id uuid not null references profiles(id),
  requested_by uuid not null references profiles(id),
  subject text,
  notes text,
  scheduled_at timestamptz,
  proposed_at timestamptz,
  duration_minutes int default 30,
  status session_status not null default 'requested',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- DOCUMENTS
-- ============================================

create table documents (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  category document_category not null,
  custom_label text,
  file_name text not null,
  file_url text not null,
  file_size bigint,
  mime_type text,
  uploaded_by uuid not null references profiles(id),
  created_at timestamptz not null default now()
);

-- ============================================
-- SCHOLARSHIPS
-- ============================================

create table scholarships (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  amount numeric,
  amount_currency text default 'USD',
  eligibility text,
  deadline date,
  required_documents text,
  url text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table scholarship_bookmarks (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  scholarship_id uuid not null references scholarships(id) on delete cascade,
  recommended_by uuid references profiles(id),
  counsellor_notes text,
  is_approved boolean default false,
  created_at timestamptz not null default now(),
  unique(student_id, scholarship_id)
);

create table scholarship_awards (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications(id) on delete cascade,
  student_id uuid not null references profiles(id) on delete cascade,
  scholarship_name text not null,
  amount_per_year numeric,
  amount_currency text default 'USD',
  scholarship_type scholarship_type not null,
  duration_years int,
  is_renewable boolean default false,
  renewable_conditions text,
  total_amount numeric,
  entered_by uuid references profiles(id),
  verified_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- PROGRAMS & OLYMPIADS
-- ============================================

create table programs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text,
  host_institution text,
  location text,
  country text,
  price numeric,
  price_currency text default 'USD',
  is_free boolean default false,
  is_online boolean default false,
  start_date date,
  end_date date,
  deadline date,
  description text,
  whats_included text,
  url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table program_bookmarks (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  program_id uuid not null references programs(id) on delete cascade,
  recommended_by uuid references profiles(id),
  counsellor_notes text,
  is_recommended boolean,
  created_at timestamptz not null default now(),
  unique(student_id, program_id)
);

-- ============================================
-- CHAT
-- ============================================

create table chat_conversations (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  participant_1 uuid not null references profiles(id),
  participant_2 uuid not null references profiles(id),
  last_message_at timestamptz,
  created_at timestamptz not null default now()
);

create table chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references chat_conversations(id) on delete cascade,
  sender_id uuid not null references profiles(id),
  content text not null,
  is_read boolean default false,
  created_at timestamptz not null default now()
);

create table broadcasts (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  sender_id uuid not null references profiles(id),
  content text not null,
  audience_type text not null,
  audience_filter jsonb,
  recipient_count int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- NOTIFICATIONS
-- ============================================

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  link text,
  is_read boolean default false,
  data jsonb,
  created_at timestamptz not null default now()
);

-- ============================================
-- ACCESS REQUESTS
-- ============================================

create table access_requests (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  email text not null,
  school_id uuid references schools(id),
  school_name_if_missing text,
  note text,
  is_sales_lead boolean default false,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- ============================================
-- INDEXES
-- ============================================

create index idx_profiles_school on profiles(school_id);
create index idx_profiles_role on profiles(role);
create index idx_applications_student on applications(student_id);
create index idx_applications_university on applications(university_id);
create index idx_applications_status on applications(status);
create index idx_essays_student on essays(student_id);
create index idx_sessions_student on sessions(student_id);
create index idx_sessions_counsellor on sessions(counsellor_id);
create index idx_sessions_status on sessions(status);
create index idx_documents_student on documents(student_id);
create index idx_university_bookmarks_student on university_bookmarks(student_id);
create index idx_chat_messages_conversation on chat_messages(conversation_id);
create index idx_notifications_user on notifications(user_id);
create index idx_notifications_unread on notifications(user_id, is_read) where is_read = false;
create index idx_student_exams_student on student_exams(student_id);
create index idx_student_exams_date on student_exams(exam_date);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table schools enable row level security;
alter table profiles enable row level security;
alter table invitations enable row level security;
alter table universities enable row level security;
alter table university_programs enable row level security;
alter table university_requirements enable row level security;
alter table university_deadlines enable row level security;
alter table university_pathways enable row level security;
alter table university_features enable row level security;
alter table university_bookmarks enable row level security;
alter table applications enable row level security;
alter table essays enable row level security;
alter table essay_comments enable row level security;
alter table essay_versions enable row level security;
alter table student_exams enable row level security;
alter table sessions enable row level security;
alter table documents enable row level security;
alter table scholarships enable row level security;
alter table scholarship_bookmarks enable row level security;
alter table scholarship_awards enable row level security;
alter table programs enable row level security;
alter table program_bookmarks enable row level security;
alter table chat_conversations enable row level security;
alter table chat_messages enable row level security;
alter table broadcasts enable row level security;
alter table notifications enable row level security;
alter table access_requests enable row level security;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Helper function: get current user's school_id
create or replace function get_user_school_id()
returns uuid as $$
  select school_id from profiles where id = auth.uid()
$$ language sql security definer stable;

-- Helper function: get current user's role
create or replace function get_user_role()
returns user_role as $$
  select role from profiles where id = auth.uid()
$$ language sql security definer stable;

-- Helper function: check if platform admin
create or replace function is_platform_admin()
returns boolean as $$
  select exists(select 1 from profiles where id = auth.uid() and role = 'platform_admin')
$$ language sql security definer stable;

-- SCHOOLS
create policy "Platform admin sees all schools" on schools
  for select using (is_platform_admin());
create policy "School members see own school" on schools
  for select using (id = get_user_school_id());
create policy "Platform admin manages schools" on schools
  for all using (is_platform_admin());

-- PROFILES
create policy "Platform admin sees all profiles" on profiles
  for select using (is_platform_admin());
create policy "School members see own school profiles" on profiles
  for select using (school_id = get_user_school_id());
create policy "Users can update own profile" on profiles
  for update using (id = auth.uid());
create policy "Counsellors can update student profiles in school" on profiles
  for update using (
    school_id = get_user_school_id()
    and get_user_role() in ('counsellor', 'school_admin')
  );

-- UNIVERSITIES (public read, admin write)
create policy "Anyone can read universities" on universities
  for select using (true);
create policy "Platform admin manages universities" on universities
  for all using (is_platform_admin());

create policy "Anyone can read university programs" on university_programs
  for select using (true);
create policy "Platform admin manages programs" on university_programs
  for all using (is_platform_admin());

create policy "Anyone can read requirements" on university_requirements
  for select using (true);
create policy "Platform admin manages requirements" on university_requirements
  for all using (is_platform_admin());

create policy "Anyone can read deadlines" on university_deadlines
  for select using (true);
create policy "Platform admin manages deadlines" on university_deadlines
  for all using (is_platform_admin());

create policy "Anyone can read pathways" on university_pathways
  for select using (true);
create policy "Platform admin manages pathways" on university_pathways
  for all using (is_platform_admin());

create policy "Anyone can read features" on university_features
  for select using (true);
create policy "Platform admin manages features" on university_features
  for all using (is_platform_admin());

-- BOOKMARKS (student owns, school counsellors can see)
create policy "Students manage own bookmarks" on university_bookmarks
  for all using (student_id = auth.uid());
create policy "Counsellors see school bookmarks" on university_bookmarks
  for select using (
    exists(select 1 from profiles where id = university_bookmarks.student_id and school_id = get_user_school_id())
  );

-- APPLICATIONS
create policy "Students see own applications" on applications
  for select using (student_id = auth.uid());
create policy "Students manage own applications" on applications
  for all using (student_id = auth.uid());
create policy "Counsellors see school applications" on applications
  for select using (
    exists(select 1 from profiles where id = applications.student_id and school_id = get_user_school_id())
  );
create policy "Counsellors update school applications" on applications
  for update using (
    get_user_role() in ('counsellor', 'school_admin')
    and exists(select 1 from profiles where id = applications.student_id and school_id = get_user_school_id())
  );

-- ESSAYS
create policy "Students manage own essays" on essays
  for all using (student_id = auth.uid());
create policy "Counsellors see school essays" on essays
  for select using (
    exists(select 1 from profiles where id = essays.student_id and school_id = get_user_school_id())
  );

-- ESSAY COMMENTS
create policy "Authors manage own comments" on essay_comments
  for all using (author_id = auth.uid());
create policy "Essay owner sees comments" on essay_comments
  for select using (
    exists(select 1 from essays where id = essay_comments.essay_id and student_id = auth.uid())
  );
create policy "Counsellors see school essay comments" on essay_comments
  for select using (
    exists(
      select 1 from essays e
      join profiles p on p.id = e.student_id
      where e.id = essay_comments.essay_id and p.school_id = get_user_school_id()
    )
  );
create policy "Counsellors add comments to school essays" on essay_comments
  for insert with check (
    get_user_role() in ('counsellor', 'school_admin')
    and exists(
      select 1 from essays e
      join profiles p on p.id = e.student_id
      where e.id = essay_comments.essay_id and p.school_id = get_user_school_id()
    )
  );

-- EXAMS
create policy "Students manage own exams" on student_exams
  for all using (student_id = auth.uid());
create policy "Counsellors see school exams" on student_exams
  for select using (
    exists(select 1 from profiles where id = student_exams.student_id and school_id = get_user_school_id())
  );

-- SESSIONS
create policy "Participants see own sessions" on sessions
  for select using (student_id = auth.uid() or counsellor_id = auth.uid());
create policy "School counsellors see all school sessions" on sessions
  for select using (
    get_user_role() in ('counsellor', 'school_admin')
    and exists(select 1 from profiles where id = sessions.student_id and school_id = get_user_school_id())
  );
create policy "Students create session requests" on sessions
  for insert with check (student_id = auth.uid() and requested_by = auth.uid());
create policy "Counsellors manage sessions" on sessions
  for all using (
    get_user_role() in ('counsellor', 'school_admin')
    and exists(select 1 from profiles where id = sessions.student_id and school_id = get_user_school_id())
  );

-- DOCUMENTS
create policy "Students manage own documents" on documents
  for all using (student_id = auth.uid());
create policy "Counsellors see school documents" on documents
  for select using (
    exists(select 1 from profiles where id = documents.student_id and school_id = get_user_school_id())
  );

-- SCHOLARSHIPS (public read, admin write)
create policy "Anyone can read scholarships" on scholarships
  for select using (true);
create policy "Platform admin manages scholarships" on scholarships
  for all using (is_platform_admin());

-- SCHOLARSHIP BOOKMARKS
create policy "Students manage own scholarship bookmarks" on scholarship_bookmarks
  for all using (student_id = auth.uid());
create policy "Counsellors see school scholarship bookmarks" on scholarship_bookmarks
  for select using (
    exists(select 1 from profiles where id = scholarship_bookmarks.student_id and school_id = get_user_school_id())
  );

-- SCHOLARSHIP AWARDS
create policy "Students see own awards" on scholarship_awards
  for select using (student_id = auth.uid());
create policy "Both can manage awards" on scholarship_awards
  for all using (
    student_id = auth.uid()
    or (
      get_user_role() in ('counsellor', 'school_admin')
      and exists(select 1 from profiles where id = scholarship_awards.student_id and school_id = get_user_school_id())
    )
  );

-- PROGRAMS (public read, admin write)
create policy "Anyone can read programs" on programs
  for select using (true);
create policy "Platform admin manages programs" on programs
  for all using (is_platform_admin());

-- PROGRAM BOOKMARKS
create policy "Students manage own program bookmarks" on program_bookmarks
  for all using (student_id = auth.uid());
create policy "Counsellors see school program bookmarks" on program_bookmarks
  for select using (
    exists(select 1 from profiles where id = program_bookmarks.student_id and school_id = get_user_school_id())
  );

-- CHAT
create policy "Participants see own conversations" on chat_conversations
  for select using (participant_1 = auth.uid() or participant_2 = auth.uid());
create policy "Participants see own messages" on chat_messages
  for select using (
    exists(select 1 from chat_conversations where id = chat_messages.conversation_id and (participant_1 = auth.uid() or participant_2 = auth.uid()))
  );
create policy "Participants send messages" on chat_messages
  for insert with check (sender_id = auth.uid());

-- BROADCASTS
create policy "School members see school broadcasts" on broadcasts
  for select using (school_id = get_user_school_id());
create policy "Counsellors create broadcasts" on broadcasts
  for insert with check (
    get_user_role() in ('counsellor', 'school_admin')
    and school_id = get_user_school_id()
  );
create policy "Sender manages own broadcast" on broadcasts
  for update using (sender_id = auth.uid());
create policy "Sender deletes own broadcast" on broadcasts
  for delete using (sender_id = auth.uid());

-- NOTIFICATIONS
create policy "Users see own notifications" on notifications
  for select using (user_id = auth.uid());
create policy "Users update own notifications" on notifications
  for update using (user_id = auth.uid());

-- ACCESS REQUESTS
create policy "Platform admin sees all requests" on access_requests
  for select using (is_platform_admin());
create policy "Anyone can create access request" on access_requests
  for insert with check (true);

-- INVITATIONS
create policy "School admin sees school invitations" on invitations
  for select using (school_id = get_user_school_id());
create policy "Platform admin sees all invitations" on invitations
  for select using (is_platform_admin());

-- ============================================
-- AUTO-UPDATE TIMESTAMPS
-- ============================================

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_schools_updated_at before update on schools
  for each row execute function update_updated_at();
create trigger update_profiles_updated_at before update on profiles
  for each row execute function update_updated_at();
create trigger update_universities_updated_at before update on universities
  for each row execute function update_updated_at();
create trigger update_applications_updated_at before update on applications
  for each row execute function update_updated_at();
create trigger update_essays_updated_at before update on essays
  for each row execute function update_updated_at();
create trigger update_student_exams_updated_at before update on student_exams
  for each row execute function update_updated_at();
create trigger update_sessions_updated_at before update on sessions
  for each row execute function update_updated_at();
create trigger update_university_bookmarks_updated_at before update on university_bookmarks
  for each row execute function update_updated_at();
create trigger update_scholarship_awards_updated_at before update on scholarship_awards
  for each row execute function update_updated_at();

-- ============================================
-- FUNCTION: Create profile on signup
-- ============================================

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, role)
  values (
    new.id,
    new.email,
    coalesce(
      (new.raw_user_meta_data->>'role')::user_role,
      'student'::user_role
    )
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
