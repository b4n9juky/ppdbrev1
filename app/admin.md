TASK: Build Admin PPDB Dashboard & Management Workspace
Project Context

Existing System:

Laravel 12
React + TypeScript
InertiaJS
Vite
TailwindCSS
Shadcn UI
MySQL

Current Status:

Operator page already exists.
Operator handles applicant verification.
Admin should NOT perform daily verification tasks.

This task is ONLY for the Admin area.

Objective

Create a modern Admin Dashboard that focuses on:

Monitoring registration progress
Monitoring operator performance
Managing quotas
Running selection process
Publishing announcements

The Admin page should be designed as a management dashboard, not a verification workspace.

Main Navigation

Create 4 admin pages:

Dashboard
Monitoring
Selection
Announcement
PAGE 1: Dashboard

Purpose:

Provide real-time PPDB statistics.

Statistics Cards

Display:

Total Applicants
Pending Verification
In Progress
Verified
Passed
Failed

Layout:

[ Total ]
[ Pending ]
[ In Progress ]
[ Verified ]
[ Passed ]
[ Failed ]

Each card should show:

Count
Percentage
Trend (optional)
Registration Path Quotas

Display quota utilization.

Example:

Regular Path

180 / 200

Achievement Path

75 / 150

Tahfidz Path

90 / 120

Use progress bars.

Operator Activity

Display operator performance.

Columns:

Operator Name
Applicants Processed
Applicants Verified
Last Activity

Example:

Ahmad
120 verified

Budi
98 verified

Siti
145 verified

Recent Activities

Display latest system activities.

Examples:

Applicant verified
Applicant revised
Selection generated
Announcement published
PAGE 2: Monitoring

Purpose:

Monitor all applicants.

Admin does not verify applicants.

Admin only monitors.

Filters

Provide:

Search
Registration Path
Verification Status
Selection Status
Assigned Operator
Registration Date
Applicants Table

Columns:

Registration Number
Name
Registration Path
Verification Status
Selection Status
Assigned Operator
Registration Date

Actions:

[ View Details ]

Applicant Detail Drawer

Open right-side drawer.

Display:

Profile
Photo
Registration Number
Name
NISN
NIK
School Origin
Documents

Read-only document preview.

Academic Scores

Read-only.

Verification Notes

Read-only.

Admin cannot edit verification data.

PAGE 3: Selection

Purpose:

Generate and manage admission results.

Selection Dashboard

Display:

For each registration path:

Quota
Verified Applicants
Remaining Seats

Example:

Regular

Quota: 200

Verified: 250

Remaining: 0

Generate Ranking

Button:

[ Generate Ranking ]

Process:

Calculate ranking
Apply quota rules
Determine pass/fail status

Show confirmation dialog before running.

Ranking Table

Columns:

Rank
Registration Number
Name
Registration Path
Total Score
Status

Status:

Passed
Reserve
Failed

Filters:

Path
Status
Manual Adjustment (Optional)

Allow admin to manually move applicant:

Passed → Reserve

Reserve → Passed

Require confirmation dialog.

Log all changes.

PAGE 4: Announcement

Purpose:

Manage publication of results.

Summary

Display:

Total Passed
Total Reserve
Total Failed
Announcement Settings

Fields:

Announcement Title
Announcement Date
Announcement Time

Options:

☑ Enable Student Portal

☑ Enable Download Result Letter

☑ Send WhatsApp Notification

☑ Send Email Notification

Preview Announcement

Display how students will see the announcement.

Publish Workflow

Buttons:

[ Save Draft ]

[ Publish Announcement ]

Confirmation required.

Access Control

Admin:

Can access:

Dashboard
Monitoring
Selection
Announcement

Cannot:

Verify applicants
Reject documents
Process daily verification workflow
UI Requirements

Use:

Shadcn UI
Data Table
Cards
Progress Bars
Dialog
Drawer
Tabs
Skeleton Loading

Responsive:

Desktop First

Tablet Friendly

Mobile Usable

Expected Components

components/admin/

DashboardStats.tsx

QuotaOverview.tsx

OperatorActivityTable.tsx

RecentActivityFeed.tsx

ApplicantMonitoringTable.tsx

ApplicantDetailDrawer.tsx

SelectionDashboard.tsx

RankingTable.tsx

AnnouncementSettings.tsx

AnnouncementPreview.tsx

Expected Result

Build a complete Admin PPDB area focused on:

Monitoring
Selection
Announcement Publishing

Admin should act as a decision maker and supervisor, not as a verifier.

All verification workflows remain on the Operator side.